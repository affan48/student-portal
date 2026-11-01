# Deployment & DevOps Guide

## 1. Local Development (SQLite)
Zero-configuration local runtime for rapid development and testing:
```bash
# 1. Install dependencies
npm install

# 2. Sync SQLite Database & Generate Prisma Client
npm run db:push

# 3. Seed Reference Data
npm run db:seed

# 4. Start Next.js Development Server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 2. Production Deployment with Docker & PostgreSQL
For containerized deployments matching production university infrastructure:

```bash
# 1. Build and run containers
docker-compose up -d --build

# 2. Apply Prisma migrations inside the app container
docker-compose exec ums-app npx prisma db push --schema=./prisma/schema.prisma

# 3. Seed production fixtures
docker-compose exec ums-app node scripts/seed.mjs
```

## 3. Environment Variables (.env)
```env
DATABASE_URL="file:./dev.db" # Or postgresql://user:pass@host:5432/dbname?schema=public
JWT_SECRET="your-secure-jwt-secret-here"
JWT_REFRESH_SECRET="your-secure-refresh-token-secret-here"
PORT=3000
NODE_ENV="production"
```

## 4. Running Automated Tests
```bash
npm test
```
Runs unit and integration tests verifying password hashing, JWT token verification, GPA/CGPA mathematics, attendance calculations, running balance integrity, and database relations.

