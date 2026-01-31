
---

### 🌐 ExpressTS Backend – `README.md`

```markdown
# Work Flow — ExpressTS Backend
```

This is the Express.js + TypeScript backend for **Work Flow**, a productivity and project workflow management system for teams and admins.

### This project uses POSTGRESQL VERSION: 14.17

## 🚀 Features
- REST API with Role-based Auth (JWT)
- Task & project lifecycle management
- Staff attendance, layoff, and performance tracking
- Admin stats and analytics endpoints
- Scalable folder structure with CI/CD support

## 🛠️ Tech Stack
- Node.js + Express.js
- TypeScript
- JWT Auth

## 📦 Getting Started
```bash
npm install
npm install express
npm install --save-dev typescript ts-node @types/express @types/node nodemon
npm install typorm dotenv
Npm install pg --save
npm run dev
```

## Make sure these compiler options are in tsconfig.json
Check to make sure of the following in tsconfig.json
```typescript
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES6",
    "module": "commonjs"
  }
}
```

## Import reflect-metadata at the very top of your entry point
At the top of ```src/index.ts``` or ```main.ts``` (before anything else):
```typescript
import 'reflect-metadata';
```


## Setup basic Auth (JWT & Bcrypt)
```bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

# Dev Env Setup on Different OSs

## MacOS

### Setup PostgreSQL in just 2 steps!
1. Install Postgresql
```bash
brew install postgresql
# Start postgresql service
brew services start postgresql
```
Check brew services status
```bash
brew services list
```

2. Create DB user and DB
```bash
psql postgres
# Then inside the psql shell:
CREATE USER myuser WITH PASSWORD 'mypassword';
CREATE DATABASE mydb OWNER myuser;
\q
```

Generate Migration
```bash
npm run migration:generate src/migrations/MigrationName
```

Run Migration
```bash
npm run typeorm -- migration:run -d src/data-source.ts
```


## 🔒 License

This project is **proprietary / source-available**.

The source code is visible for evaluation purposes only.
Unauthorized use, redistribution, or commercial use is prohibited.

See the [LICENSE](./LICENSE) file for details.
