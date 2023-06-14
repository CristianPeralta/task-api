import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task, TaskSchema } from '../schemas/task.schema';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

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
});
