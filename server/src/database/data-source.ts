import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import * as pg from 'pg';

// Force pg to use SSL by default
const sslConfig = {
    ssl: {
        rejectUnauthorized: false, // Accept Neon self-signed cert
    },
};

// Patch pg to always use SSL if needed
pg.defaults.ssl = sslConfig.ssl;
config();
const configService = new ConfigService();
export const AppDataSource = new DataSource({
    type: 'postgres',
    url: configService.get('DATABASE_URI'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/migrations/*.{js,ts}'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: sslConfig.ssl, // Required by Neon
    extra: sslConfig,
});