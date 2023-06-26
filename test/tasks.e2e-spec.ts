import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tasks (GET)', () => {
    it('should return an array of tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });
});
