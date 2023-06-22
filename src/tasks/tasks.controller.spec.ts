import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../schemas/task.schema';
import { getModelToken } from '@nestjs/mongoose';
// import { CreateTaskDto } from '../dto/create-task.dto';

describe('Task Service', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getModelToken('Task'),
          useValue: Task,
        },
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
    expect(tasksController).toBeDefined();
  });

  describe('Task Controller', () => {
    describe('create', () => {
      // ...
    });

    describe('findOne', () => {
      // ...
    });

    describe('findAll', () => {
      // ...
    });

    describe('delete', () => {
      // ...
    });

    describe('update', () => {
      // ...
    });
  });
});
