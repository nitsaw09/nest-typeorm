import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { EventsModule } from './events/events.module';
import { MenuItemsModule } from './menu-items/menu-items.module';

export const appModuleConfig = {
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    EventsModule,
    MenuItemsModule,
  ],
  controllers: [],
  providers: [],
};

@Module(appModuleConfig)
export class AppModule {}
