import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import mongoose from 'mongoose';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let mongooseConnection: mongoose.Connection;
  let createdTasksId: string;

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
          createdTasksId = response.body._id;
          expect(createdTask.title).toBe(createTaskDto.title);
          expect(createdTask.done).toBe(false);
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

  describe('/tasks/:id (GET)', () => {
    it('should return a task if it exists', async () => {
      const taskId = createdTasksId;

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(HttpStatus.OK);

      const task = response.body;
      expect(task).toBeDefined();
      expect(task._id).toBe(taskId);
    });

    it('should return 404 if the task does not exist', async () => {
      const nonExistentTaskId = new mongoose.Types.ObjectId().toHexString();

      await request(app.getHttpServer())
        .get(`/tasks/${nonExistentTaskId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((response) => {
          expect(response.body.message).toBeDefined();
          const errorMessage = response.body.message;
          expect(errorMessage).toBe('Task does not exist');
        });
    });
  });

  describe('/tasks/:id (PUT)', () => {
    it('should update a task successfully', async () => {
      const taskId = createdTasksId;
      const updateTaskDto = {
        title: 'Updated Task',
        done: true,
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .send(updateTaskDto)
        .expect(HttpStatus.OK);

      expect(response.body.title).toBe(updateTaskDto.title);
      expect(response.body.done).toBe(updateTaskDto.done);
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistentTaskId = new mongoose.Types.ObjectId().toHexString();
      const updateTaskDto = {
        title: 'Updated Task',
        done: true,
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${nonExistentTaskId}`)
        .send(updateTaskDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Task does not exist');
    });
  });
});
