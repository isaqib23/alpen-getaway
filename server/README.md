# Alpen Getaway Admin Portal

A comprehensive NestJS-based admin portal for managing a Alpen Getaway platform.

## Features

- User Management (Customer, Affiliate, B2B, Admin)
- Company Registration & Approval
- Vehicle & Driver Management
- Route & Fare Management
- Booking Lifecycle Management
- Payment Processing with Stripe
- CMS for Frontend Pages
- Review & Rating System
- Analytics Dashboard

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your database and other settings in .env

# Start development server
npm run start:dev


# Alpen Getaway Admin - TypeORM Migration Commands

## 📋 Your Current Package.json Scripts
```json
{
  "migration:generate": "typeorm-ts-node-commonjs migration:generate",
  "migration:run": "typeorm-ts-node-commonjs migration:run",
  "migration:revert": "typeorm-ts-node-commonjs migration:revert",
  "schema:sync": "typeorm-ts-node-commonjs schema:sync",
  "seed": "ts-node -r tsconfig-paths/register src/database/seeds/seed.command.ts",
  "seed:prod": "node dist/database/seeds/seed.command.js"
}
```

## 🚀 Ready-to-Use Migration Commands

### 1. Generate Migrations (Auto-detect from entities)
```bash
# Generate initial migration for all entities
npm run migration:generate -- src/database/migrations/InitialAlpenSchema -d src/database/data-source.ts

# Generate migration for specific features
npm run migration:generate -- src/database/migrations/CreateUsersAndAuth -d src/database/data-source.ts

npm run migration:generate -- src/database/migrations/AddBookingSystem -d src/database/data-source.ts

npm run migration:generate -- src/database/migrations/AddPaymentIntegration -d src/database/data-source.ts

npm run migration:generate -- src/database/migrations/AddReviewAndRating -d src/database/data-source.ts

npm run migration:generate -- src/database/migrations/AddCMSPages -d src/database/data-source.ts
```

### 2. Run Migrations
```bash
# Run all pending migrations
npm run migration:run -- -d src/database/data-source.ts

# Show which migrations will be run (dry run)
npm run migration:show -- -d src/database/data-source.ts
```

### 3. Revert Migrations
```bash
# Revert the last migration
npm run migration:revert -- -d src/database/data-source.ts
```

### 4. Schema Sync (Development Only)
```bash
# Sync schema directly (USE ONLY IN DEVELOPMENT!)
npm run schema:sync -- -d src/database/data-source.ts
```

### 5. Seed Database
```bash
# Seed with test data (your existing script)
npm run seed

# Production seeding
npm run seed:prod
```

## 🏔️ Alpen Getaway Specific Migration Workflow

### Initial Setup
```bash
# 1. Generate your initial migration
npm run migration:generate -- src/database/migrations/InitialAlpenGetawaySchema -d src/database/data-source.ts

# 2. Run the migration
npm run migration:run -- -d src/database/data-source.ts

# 3. Seed with Alpen Getaway test data
npm run seed
```

### Adding New Features
```bash
# Adding ride booking features
npm run migration:generate -- src/database/migrations/AddRideBookingTables -d src/database/data-source.ts

# Adding company/affiliate features
npm run migration:generate -- src/database/migrations/AddCompanyManagement -d src/database/data-source.ts

# Adding route fares
npm run migration:generate -- src/database/migrations/AddRouteFareSystem -d src/database/data-source.ts

# Adding analytics
npm run migration:generate -- src/database/migrations/AddAnalyticsTables -d src/database/data-source.ts
```

## 📁 Required File Structure
```
alpen-getaway-admin/
├── src/
│   ├── database/
│   │   ├── data-source.ts          ← You need this file
│   │   ├── migrations/             ← Generated migrations go here
│   │   │   ├── 1704067200000-InitialAlpenGetawaySchema.ts
│   │   │   ├── 1704153600000-AddRideBookingTables.ts
│   │   │   └── 1704240000000-AddCompanyManagement.ts
│   │   └── seeds/
│   │       ├── database-seeder.ts
│   │       ├── seeder.module.ts
│   │       └── seed.command.ts
│   └── ... (your modules)
└── package.json
```

## ⚙️ Required: src/database/data-source.ts
```typescript
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'postgres'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME', 'alpen_getaway_db'),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Never true in production
  logging: configService.get('NODE_ENV') === 'development',
});
```

## 🎯 Quick Start Commands for Alpen Getaway

### Complete Setup (First Time)
```bash
# 1. Install dependencies (already done)
npm install

# 2. Generate initial migration
npm run migration:generate -- src/database/migrations/InitialAlpenSchema -d src/database/data-source.ts

# 3. Run migration
npm run migration:run -- -d src/database/data-source.ts

# 4. Seed database
npm run seed

# 5. Start development
npm run start:dev
```

### Daily Development Workflow
```bash
# After modifying entities
npm run migration:generate -- src/database/migrations/YourFeatureName -d src/database/data-source.ts

# Review the generated migration file, then run
npm run migration:run -- -d src/database/data-source.ts

# Test with fresh data
npm run seed
```

## 🏔️ Alpen Getaway Environment Variables (.env)
```env
# Database Configuration for Alpen Getaway
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=alpen_getaway_db

# Application
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-alpen-getaway-jwt-secret
JWT_EXPIRES_IN=24h

# Stripe (for payment processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## ⚠️ Important Notes

1. **Create data-source.ts first** - TypeORM CLI needs this file
2. **Always review migrations** before running them
3. **Backup database** before running migrations in production
4. **Use migrations in production**, never schema:sync

## 🎯 Most Common Commands You'll Use

```bash
# Generate migration
npm run migration:generate -- src/database/migrations/YourFeature -d src/database/data-source.ts

# Run migrations
npm run migration:run -- -d src/database/data-source.ts

# Seed data
npm run seed

# Start development
npm run start:dev
```

Your Alpen Getaway admin portal is ready for database migrations! 🏔️🚀