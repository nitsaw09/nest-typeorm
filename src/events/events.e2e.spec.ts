import { format, subYears, addYears } from 'date-fns';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from '../config/typeorm.config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { eventsModuleConfig } from './events.module';

describe('events', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      ...eventsModuleConfig,
      imports: [
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        ...eventsModuleConfig.imports,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`GET /events/warmupevents`, async () => {
    const response = await request(app.getHttpServer())
      .get('/events/warmupevents')
      .expect(200);

    const result = response.body;

    const date1 = format(subYears(new Date(), 1), 'yyyy');
    const date2 = format(addYears(new Date(), 1), 'yyyy');

    expect(result.length).toBe(3);
    expect(result[0].name).toBe('Laravel convention ' + date1);
    expect(result[1].name).toBe('Laravel convention ' + date2);
    expect(result[2].name).toBe('React convention ' + date2);
  });

  it('GET /events/events', async () => {
    const date1 = format(subYears(new Date(), 1), 'yyyy');
    const date2 = format(addYears(new Date(), 1), 'yyyy');

    const response = await request(app.getHttpServer())
      .get('/events/events')
      .expect(200);

    const result = response.body;

    expect(result.length).toBe(3);
    expect(result[0].name).toBe('Laravel convention ' + date1);
    expect(result[0].workshops[0].name).toBe(
      'Illuminate your knowledge of the laravel code base',
    );
    expect(result[1].name).toBe('Laravel convention ' + date2);
    expect(result[1].workshops[0].name).toBe(
      'The new Eloquent - load more with less',
    );
    expect(result[1].workshops[1].name).toBe(
      'AutoEx - handles exceptions 100% automatic',
    );
    expect(result[2].name).toBe('React convention ' + date2);
    expect(result[2].workshops[0].name).toBe(
      '#NoClass pure functional programming',
    );
    expect(result[2].workshops[1].name).toBe('Navigating the function jungle');
  });

  it('GET /events/futureevents', async () => {
    const date2 = format(addYears(new Date(), 1), 'yyyy');
    const response = await request(app.getHttpServer())
      .get('/events/futureevents')
      .expect(200);

    const result = response.body;

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Laravel convention ' + date2);
    expect(result[0].workshops[0].name).toBe(
      'The new Eloquent - load more with less',
    );
    expect(result[0].workshops[1].name).toBe(
      'AutoEx - handles exceptions 100% automatic',
    );
    expect(result[1].name).toBe('React convention ' + date2);
    expect(result[1].workshops[0].name).toBe(
      '#NoClass pure functional programming',
    );
    expect(result[1].workshops[1].name).toBe('Navigating the function jungle');
  });
});
