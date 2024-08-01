import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

// Load environment variables
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.use(helmet());

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(8000);
}
bootstrap();
