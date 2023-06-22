import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../schemas/task.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';

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
      it('should call create method of TasksService and return the created task', async () => {
        const createTaskDto: CreateTaskDto = { title: 'Sample Task' };
        const createdTask = {
          _id: '1',
          title: 'Sample Task',
          done: false,
        };

        jest
          .spyOn(tasksService, 'create')
          .mockResolvedValue(createdTask as any);

        const result = await tasksController.create(createTaskDto);

        expect(tasksService.create).toHaveBeenCalledWith(createTaskDto);
        expect(result).toEqual(createdTask);
      });

      it('should throw ConflictException if TaskService throws a duplicate key error', async () => {
        const createTaskDto: CreateTaskDto = { title: 'Sample Task' };
        const duplicateKeyError = { code: 11000 };
        jest.spyOn(tasksService, 'create').mockRejectedValue(duplicateKeyError);

        await expect(
          tasksController.create(createTaskDto),
        ).rejects.toThrowError(new ConflictException('Task already exists'));
      });

      it('should throw original error if TaskService throws an error other than duplicate key error', async () => {
        const createTaskDto: CreateTaskDto = { title: 'Sample Task' };
        const otherError = new Error('Some error');
        jest.spyOn(tasksService, 'create').mockRejectedValue(otherError);

        await expect(
          tasksController.create(createTaskDto),
        ).rejects.toThrowError(otherError);
      });
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
