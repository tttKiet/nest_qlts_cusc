import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import passport from 'passport';

declare const module: any;

async function bootstrap() {
  const port = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);

  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(
    session({
      secret: process.env?.SESSION_SECRET || 'SESSION_SECRET',
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
    }),
  );
  app.setGlobalPrefix('/api/v1');
  // app.useGlobalGuards(new JwtGuards());
  await app.listen(port, () => {
    console.log(`Backend listenning http://127.0.0.1:${port}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
