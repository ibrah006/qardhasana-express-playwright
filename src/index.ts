import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';

import os from 'os';
import { createProxyMiddleware } from 'http-proxy-middleware';
import helmet from "helmet";
import { chromium } from 'playwright';

const MAX_SCROLL_OFFSET = 2200;

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript backend for workflow!');
});

app.use(helmet({
  frameguard: false  // Disables X-Frame-Options
}));

app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  // Or allow specific origins:
  // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.get("/_api/preview", async (req, res) => {
  const url = (req.query.url)?.toString();
  if (!url) {
    res.status(400).json({message: "Missing url"});
    return;
  }
  const previewName = req.query.previewName;

  const targetUrl = new URL(url);
  const response = await fetch(targetUrl.href);
  let html = await response.text();

  const baseTag = `<base href="${targetUrl.origin}/">`;
  html = html.replace("<head>", `<head>${baseTag}`);

  // Inject widget script
  // const widgetScript = `
  //   <script src="http://localhost:3333/_api/widget?preview=true&previewName=${previewName}"></script>
  // `;
  // html = html.replace("</body>", `${widgetScript}</body>`);

  res.set("Content-Type", "text/html");
  res.send(html);
});

app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url?.toString();
  
  if (!targetUrl) {
      res.status(400).send('Missing url parameter');
      return;
  }
  
  // Optional: Validate the URL for security
  try {
      new URL(targetUrl);
  } catch (e) {
      res.status(400).send('Invalid URL');
      return;
  }
  
  createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
  })(req, res, next);
});

let browser: any = null;

async function getBrowser() {
  browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  return browser;
}

async function takeScreenshot(url: string) {
  const browser = await getBrowser();
  // const browser = await puppeteer.launch({
  //   // headless: true,
  //   args: ["--no-sandbox", "--disable-setuid-sandbox"]
  // });

  const page = await browser.newPage();

  // await page.setViewport({
  //   width: 1280,
  //   height: 800
  // });

  // 3️⃣ Limit max scroll / page height
  // Get the real page height
  

  // Set a standard maximum scroll height (e.g., 2000px)
  // const maxHeight = 1200;
  // const finalHeight = Math.min(pageHeight, maxHeight);

  // Load the site
  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  const fullPageHeight = await page.evaluate(() =>
    document.documentElement.scrollHeight
  );
  
  const screenshot = await page.screenshot({
    fullPage: true,
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 1280,
      height: fullPageHeight < MAX_SCROLL_OFFSET? fullPageHeight : MAX_SCROLL_OFFSET, // 👈 max height
    },
  });
  
  await page.close();
  return screenshot;
}


app.post("/_api/ss-preview", async (req, res) => {
  // const { url } = req.body;
  const url = req.query.url as string;

  if (!url || !url.startsWith("http")) {
    res.status(400).json({ error: "Invalid URL" });
    return;
  }

  try {
    const image = await takeScreenshot(url);

    res.set("Content-Type", "image/png");
    res.send(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate preview", message: err });
  }
});


app.listen(PORT, () => {
  const ip = getLocalExternalIp();
  console.log(`Server is running at http://${ip || 'localhost'}:${PORT}`);
});

function getLocalExternalIp(): string | undefined {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return undefined;
}

export default app;