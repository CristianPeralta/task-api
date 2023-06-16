import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task, TaskSchema } from '../schemas/task.schema';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';

describe('Task Service', () => {
  let taskService: TasksService;
  let mongod: MongoMemoryServer;
  let mongooseConnection: mongoose.Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      ],
      providers: [TasksService],
    }).compile();

    taskService = module.get<TasksService>(TasksService);

    mongooseConnection = module.get<mongoose.Connection>(getConnectionToken());
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();
  });

  afterAll(async () => {
    await mongod.stop();
    await mongooseConnection.close();
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('Tasks Service', () => {
    it('should list Tasks', async () => {
      const tasks = await taskService.findAll();
      expect(tasks.length).toBe(0);
    });

    it('should not create Task with falsy params', async () => {
      expect.assertions(3);
      try {
        await taskService.create(null);
      } catch (error) {
        error = error as Error;
        expect(error.name).toEqual('ValidationError');
        expect(error.errors).not.toBeNull();
        expect(error.errors.title).not.toBeNull();
      }
    });

    it('should not create Task without title', async () => {
      expect(
        taskService.create({
          description: 'sample description',
        } as CreateTaskDto),
      ).rejects.toThrowError();
    });

    it('should not create Task without arguments', async () => {
      const callWithoutArguments = taskService.create.bind(taskService);
      try {
        await callWithoutArguments();
      } catch (error) {
        error = error as Error;
        expect(error.name).toEqual('ValidationError');
        expect(error.errors).not.toBeNull();
        expect(error.errors.title).not.toBeNull();
      }
    });
  });
});
