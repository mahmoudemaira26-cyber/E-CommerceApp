import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { PORT } from './Config/ConfigService.js';
import { ResponseInterceptor } from './Common/InterCeptors/ResponseInterCeptor.js';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from "express-rate-limit"
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.use(cors());

  app.use(helmet());


  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: 'Too Many Requests',
    }),
  );
  const port = PORT;
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port, () => {
    console.log(`Server Is Running on Port ${port}`);
  });
}
await bootstrap();
