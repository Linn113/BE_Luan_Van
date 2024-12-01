import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ConfigurationEnv, { databaseConfigType } from '../config.env';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { JwtModule } from '@nestjs/jwt';
import { SharedJwtModule } from './jwt/jwt.module';
import { DiscountModule } from './discount/discount.module';
import { NewModule } from './new/new.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ConfigurationEnv],
      envFilePath: ['.env', '.env.development.local', '.env.production.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const databaseConfig =
          configService.get<databaseConfigType>('database');
        return {
          type: databaseConfig.type,
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.dbName,
          synchronize: true,
          // dropSchema: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    OrderModule,
    SharedJwtModule,
    DiscountModule,
    NewModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
