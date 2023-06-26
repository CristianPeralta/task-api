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

  beforeEach(async () => {
    await mongooseConnection.collection('tasks').deleteMany({});
  });

  const createTaskDto = {
    title: 'New Task',
  };

  const updateTaskDto = {
    title: 'Updated Task',
    done: true,
  };

  const createNewTask = () =>
    request(app.getHttpServer()).post('/tasks').send(createTaskDto);

  const nonExistentTaskIdGenerated = () =>
    new mongoose.Types.ObjectId().toHexString();

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
    it('should create a new task', async () => {
      await createNewTask()
        .expect(HttpStatus.CREATED)
        .then((response) => {
          const createdTask = response.body;
          expect(response.body._id).toBeDefined();
          expect(createdTask.title).toBe(createTaskDto.title);
          expect(createdTask.done).toBe(false);
        });
    });

    it('should return ConflictException if task already exists', async () => {
      await createNewTask();
      await createNewTask() // Existing Task
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
      const createdTaskResponse = await createNewTask();
      const taskId = createdTaskResponse.body._id;

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(HttpStatus.OK);

      expect(response.body._id).toBeDefined();
      expect(response.body._id).toBe(taskId);
    });

    it('should return 404 if the task does not exist', async () => {
      const nonExistentTaskId = nonExistentTaskIdGenerated();

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
      const createdTaskResponse = await createNewTask();
      const taskId = createdTaskResponse.body._id;

      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .send(updateTaskDto)
        .expect(HttpStatus.OK);

      expect(response.body.title).toBe(updateTaskDto.title);
      expect(response.body.done).toBe(updateTaskDto.done);
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistentTaskId = nonExistentTaskIdGenerated();

      const response = await request(app.getHttpServer())
        .put(`/tasks/${nonExistentTaskId}`)
        .send(updateTaskDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Task does not exist');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task and return 204 status code', async () => {
      const createdTaskResponse = await createNewTask();
      const taskId = createdTaskResponse.body._id;

      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(HttpStatus.NO_CONTENT);

      await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 404 status code when trying to delete a non-existent task', async () => {
      const nonExistentTaskId = nonExistentTaskIdGenerated();

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${nonExistentTaskId}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Task does not exist');
    });
  });
});
