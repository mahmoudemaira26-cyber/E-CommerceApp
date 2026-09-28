import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './Modules/Auth/AuthModule.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { SharedModule } from './Common/Modules/SharedModules.js';
import { UserModule } from './Modules/User/User.Module.js';
import { BrandModule } from './Modules/Brand/BrandModule.js';
import { CategoryModule } from './Modules/Category/CategoryModule.js';
import { SubCategoryModule } from './Modules/SupCategory/SupCategoryCategoryModule.js';
import { ProductModule } from './Modules/Product/Product.Module.js';
import { CartModule } from './Modules/Cart/Cart.Module.js';
import { CouponModule } from './Modules/Coupon/CouponModule.js';
import { OrderModule } from './Modules/Order/OrderModule.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule,
    BrandModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule,
    CartModule,
    CouponModule,
    OrderModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.dev'] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>('DB_LOCAL'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('DB_connected'));
          connection.on('open', () => console.log('open'));
          connection.on('disconnected', () => console.log('disconnected'));
          connection.on('reconnected', () => console.log('reconnected'));
          connection.on('disconnecting', () => console.log('disconnecting'));

          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
