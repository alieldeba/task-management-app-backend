import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

// Load environment variables
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        cors({
            origin: 'https://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true, // If you need to send cookies or HTTP authentication information
        }),
    );

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(8000);
}
bootstrap();
