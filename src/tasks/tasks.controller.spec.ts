import { ConflictException, NotFoundException } from '@nestjs/common';
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
      it('should return a task when a valid ID is provided', async () => {
        const taskId = '1';
        const task = { _id: taskId, title: 'Task 1', done: false };
        jest.spyOn(tasksService, 'findOne').mockResolvedValue(task as any);

        const result = await tasksController.findOne(taskId);

        expect(result).toEqual(task);
        expect(tasksService.findOne).toHaveBeenCalledWith(taskId);
      });

      it('should throw NotFoundException when an invalid ID is provided', async () => {
        const invalidTaskId = '999';
        jest.spyOn(tasksService, 'findOne').mockResolvedValue(null);

        await expect(tasksController.findOne(invalidTaskId)).rejects.toThrow(
          NotFoundException,
        );
        expect(tasksService.findOne).toHaveBeenCalledWith(invalidTaskId);
      });
    });

    describe('findAll', () => {
      it('should return an array of tasks', async () => {
        const tasks = [
          { _id: '1', title: 'Task 1', done: false },
          {
            _id: '2',
            title: 'Task 2',
            description: 'Some description 2',
            done: true,
          },
        ];
        jest.spyOn(tasksService, 'findAll').mockResolvedValue(tasks as any);

        const result = await tasksController.findAll();

        expect(result).toEqual(tasks);
        expect(tasksService.findAll).toHaveBeenCalled();
      });
    });

    describe('delete', () => {
      it('should delete a task and return it', async () => {
        const taskId = 'task-id';
        const deletedTask = { _id: taskId, title: 'Sample Task', done: false };

        jest
          .spyOn(tasksService, 'delete')
          .mockResolvedValue(deletedTask as any);

        const result = await tasksController.delete(taskId);

        expect(tasksService.delete).toHaveBeenCalledWith(taskId);
        expect(result).toBe(deletedTask);
      });

      it('should throw NotFoundException for non-existing task', async () => {
        const taskId = 'non-existing-task-id';

        jest.spyOn(tasksService, 'delete').mockResolvedValue(null);

        try {
          await tasksController.delete(taskId);
        } catch (error) {
          expect(tasksService.delete).toHaveBeenCalledWith(taskId);
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('Task does not exist');
        }
      });
    });

    describe('update', () => {
      // ...
    });
  });
});
