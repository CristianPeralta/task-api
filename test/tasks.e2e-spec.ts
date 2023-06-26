import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import mongoose from 'mongoose';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let mongooseConnection: mongoose.Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    mongooseConnection = moduleFixture.get<mongoose.Connection>(
      getConnectionToken(),
    );
    await mongooseConnection.dropDatabase();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await mongooseConnection.close();
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

  describe('POST /tasks', () => {
    it('should create a new task', () => {
      const createTaskDto = {
        title: 'New Task',
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          const createdTask = response.body;
          expect(response.body.title).toBeDefined();
          expect(createdTask.title).toBe(createTaskDto.title);
        });
    });

    it('should return ConflictException if task already exists', () => {
      const createTaskDto = {
        title: 'New Task', // Existing Task
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(HttpStatus.CONFLICT)
        .expect((response) => {
          expect(response.body.message).toBeDefined();
          const errorMessage = response.body.message;
          expect(errorMessage).toBe('Task already exists');
        });
    });
  });
});
