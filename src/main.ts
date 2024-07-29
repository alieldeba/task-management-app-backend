import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'https://localhost:3000', // Allow this specific origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow cookies to be sent
    });

    await app.listen(8000);
}
bootstrap();
