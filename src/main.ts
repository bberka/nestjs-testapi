import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  validateEnvFile();

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API for user authentication')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT Authorization in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT ?? 3000;

  console.log(`Server is running on http://localhost:${port}`);

  await app.listen(port);
}
bootstrap();

function validateEnvFile() {
  //check if env variables are set
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    process.exit(1);
  }

  if (!process.env.JWT_EXPIRE_MINUTES) {
    console.error('JWT_EXPIRE_MINUTES is not set');
    process.exit(1);
  }
}
