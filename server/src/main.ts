import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {AppDataSource} from "@/database/data-source";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    //await AppDataSource.initialize();
    //await AppDataSource.runMigrations();
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Serve static files
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // CORS
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'https://alpen-getaway.vercel.app',
                'http://localhost:3000', // local dev for Next.js
                'http://localhost:3001',
                'http://localhost:5173',
                'http://localhost:5174',
                'https://alpen-getaway-t1of-murex.vercel.app'
            ];

            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
    });

    // API prefix
    app.setGlobalPrefix('api/v1');

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle('Alpen Getaway Admin API')
        .setDescription('Admin portal API for Alpen Getaway application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Server started on port:`, app.get(ConfigService));
    console.log(`🚀 Admin portal running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();