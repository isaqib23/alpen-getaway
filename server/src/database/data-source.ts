import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: configService.get('DATABASE_PORT', 5432),
    username: configService.get('DATABASE_USERNAME', 'postgres'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME', 'alpen_getaway_db'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/migrations/*.{js,ts}'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: {
        rejectUnauthorized: false,
    }
});