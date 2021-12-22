import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG_ENV } from './constants/config.enum';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get<string>(CONFIG_ENV.POSTGRES_HOST),
        port: parseInt(configService.get<string>(CONFIG_ENV.POSTGRES_PORT)),
        username: configService.get<string>(CONFIG_ENV.POSTGRES_USER),
        password: configService.get<string>(CONFIG_ENV.POSTGRES_PASSWORD),
        database: configService.get<string>(CONFIG_ENV.POSTGRES_DATABASE),

        entities: [__dirname + '**/*.entity{.ts,.js}'],

        migrationsTableName: 'migration',

        migrations: ['src/migration/*.ts'],

        cli: {
          migrationsDir: 'src/migration',
        },

        autoLoadEntities: true,

        ssl: Boolean(configService.get<string>(CONFIG_ENV.NODE_ENV) === 'PROD'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(CONFIG_ENV.JWT_SECRET),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(private connection: Connection)
}
