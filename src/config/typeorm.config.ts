import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule.forRoot()],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'sqlite',
      // entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      // entities: [Event],
      database: 'database.db',
      entities: [__dirname + '/../entities/*.entity.{js,ts}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      //   cli: {
      //     migrationsDir: __dirname + '/../database/migrations',
      //   },
      migrationsTableName: 'migrations',
      //   extra: {
      //     charset: 'utf8mb4_unicode_ci',
      //   },
      synchronize: false,
      logging: true,
      autoLoadEntities: true,
    };
  },
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  // entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  // entities: [Event],
  database: 'database.db',
  entities: [__dirname + '/../entities/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  //   cli: {
  //     migrationsDir: __dirname + '/../database/migrations',
  //   },
  migrationsTableName: 'migrations',
  //   extra: {
  //     charset: 'utf8mb4_unicode_ci',
  //   },
  synchronize: false,
  logging: true,
  autoLoadEntities: true,
};
