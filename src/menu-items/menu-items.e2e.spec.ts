import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { menuItemsModuleConfig } from './menu-items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from '../config/typeorm.config';

describe('MenuItemsController', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      ...menuItemsModuleConfig,
      imports: [
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        ...menuItemsModuleConfig.imports,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Menu Item Result Test', async () => {
    const response = await request(app.getHttpServer())
      .get('/menu-items/menu')
      .expect(200);

    const result = response.body;

    expect(result.length).toBe(1);
    expect(result[0].children[0].name).toBe('Laracon');
    expect(result[0].children[0].children[0].url).toBe(
      '/events/laracon/workshops/illuminate',
    );
    expect(result[0].children[0].children[1].url).toBe(
      '/events/laracon/workshops/eloquent',
    );
    expect(result[0].children[1].name).toBe('Reactcon');
    expect(result[0].children[1].children[0].url).toBe(
      '/events/reactcon/workshops/noclass',
    );
    expect(result[0].children[1].children[1].url).toBe(
      '/events/reactcon/workshops/jungle',
    );
  });
});
