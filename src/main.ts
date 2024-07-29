import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

// Load environment variables
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        cors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
            allowedHeaders: 'Content-Type, Authorization',
        }),
    );

    await app.listen(8000);
}
bootstrap();
