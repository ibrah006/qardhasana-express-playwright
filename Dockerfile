FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /app

# 1️⃣ Install dependencies first (cache-friendly)
COPY package*.json ./
RUN npm install

# 2️⃣ Copy source
COPY . .

# 3️⃣ Build your app (TypeScript / Vite / etc.)
RUN npm run build

# 4️⃣ Runtime config
ENV PORT=3000
EXPOSE 3000

# 5️⃣ Start the server
CMD ["npm", "run", "start"]
