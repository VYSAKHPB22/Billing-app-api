import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use((request, _response, next) => {
//     console.log(`${request.method} ${request.originalUrl}`);
//     next();
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   const config = new DocumentBuilder()
//     .setTitle('Billing POS API')
//     .setDescription('Billing/POS backend with categories, cart, and orders')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api/docs', app, document);

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();


async function bootstrap() {
  console.log('BOOTSTRAP START');

  const app = await NestFactory.create(AppModule);

  console.log('APP CREATED');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  console.log('PIPES ADDED');

  const config = new DocumentBuilder()
    .setTitle('Billing POS API')
    .setDescription('Billing/POS backend with categories, cart, and orders')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  console.log('SWAGGER CONFIG');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  console.log('BEFORE LISTEN');

  await app.listen(process.env.PORT ?? 3000);

  console.log('SERVER STARTED');
}
bootstrap();