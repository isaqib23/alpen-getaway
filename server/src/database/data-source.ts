import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();
export const AppDataSource = new DataSource({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URI'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/migrations/*.{js,ts}'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: {
        rejectUnauthorized: false,
    },
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});