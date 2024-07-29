import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await app.listen(8000);
}
bootstrap();
