import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import 'dotenv/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const apiPath: string = 'auth';
  app.setGlobalPrefix(apiPath);
  if (process.env.SWAGGER !== 'false') {
    const options = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('HIGID')
      .setDescription('')
      .setVersion('1.0')
      .build();

    const customOptions: SwaggerCustomOptions = {
      customSiteTitle: 'Api Docs',
      swaggerOptions: {
        jsonEditor: true,
      },
    };
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document, customOptions);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        console.error('Validation errors:', JSON.stringify(errors));
        return new BadRequestException(errors);
      },
    }),
  );
  await app.listen(process.env.PORT || 5000);
}

bootstrap().then(() =>
  // eslint-disable-next-line no-console
  console.log(
    'Server is running on http://localhost:' + process.env.PORT || 5000,
  ),
);
