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
    describe('create', () => {
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
        try {
          await taskService.create({
            description: 'sample description',
          } as CreateTaskDto);
        } catch (error) {
          error = error as Error;
          expect(error.name).toEqual('ValidationError');
          expect(error.errors).not.toBeNull();
          expect(error.errors.title).not.toBeNull();
          expect(error.errors.title.message).toEqual(
            'Path `title` is required.',
          );
        }
      });

      it('should create Task with only a title', async () => {
        const task = await taskService.create({
          title: 'sample title',
        });
        expect(task).toBeDefined();
        expect(task._id).toBeDefined();
        expect(task.title).toEqual('sample title');
        expect(task.done).toEqual(false); // default value
      });

      it('should create Task with title, description and done properties', async () => {
        const task = await taskService.create({
          title: 'sample title',
          description: 'sample description',
          done: true,
        });
        expect(task).toBeDefined();
        expect(task._id).toBeDefined();
        expect(task.title).toEqual('sample title');
        expect(task.description).toEqual('sample description');
        expect(task.done).toEqual(true);
      });
    });

    describe('findOne', () => {
      it('should get a Task by ID', async () => {
        const task = await taskService.create({
          title: 'sample title',
        });
        const createdTask = await taskService.findOne(String(task._id));
        expect(createdTask).toBeDefined();
        expect(createdTask).not.toBeNull();
        expect(createdTask._id).toBeDefined();
        expect(createdTask._id).toStrictEqual(task._id);
        expect(task.title).toEqual('sample title');
      });

      it('should return null for non-existing ID', async () => {
        const nonExistingId = new mongoose.Types.ObjectId().toHexString();
        const result = await taskService.findOne(String(nonExistingId));
        expect(result).toBeNull();
      });
    });

    describe('findAll', () => {
      it('should return an empty array when no tasks exist', async () => {
        const tasks = await taskService.findAll();
        expect(tasks).toBeDefined();
        expect(tasks).toBeInstanceOf(Array);
        expect(tasks.length).toBe(0);
      });

      it('should get all tasks', async () => {
        await Promise.all(
          ['title 1', 'title 2', 'title 3'].map((t) =>
            taskService.create({
              title: t,
            }),
          ),
        );
        const tasks = await taskService.findAll();
        expect(tasks).toBeDefined();
        expect(tasks).not.toBeNull();
        expect(tasks).toBeInstanceOf(Array);
        expect(tasks.length).toBe(3);
      });
    });

    describe('update', () => {
      it('should update a Task', async () => {
        const task = await taskService.create({
          title: 'sample title',
        });
        const taskUpdates = {
          title: 'updated title',
          description: 'updated description',
          done: true,
        };
        const updatedTask = await taskService.update(
          String(task._id),
          taskUpdates,
        );
        expect(updatedTask).toBeDefined();
        expect(updatedTask._id).toBeDefined();
        expect(updatedTask._id).toStrictEqual(task._id);
        expect(updatedTask.title).toBe(taskUpdates.title);
        expect(updatedTask.description).toBe(taskUpdates.description);
        expect(updatedTask.done).toBe(taskUpdates.done);
      });

      it('should return null for non-existing ID', async () => {
        const taskUpdates = {
          title: 'updated title',
          description: 'updated description',
          done: true,
        };
        const nonExistingId = new mongoose.Types.ObjectId().toHexString();
        const updatedTask = await taskService.update(
          String(nonExistingId),
          taskUpdates,
        );
        expect(updatedTask).toBeNull();
      });
    });

    describe('delete', () => {
      it('should delete a Task', async () => {
        const task = await taskService.create({
          title: 'sample title',
        });

        const deletedTask = await taskService.delete(String(task._id));
        expect(deletedTask).toBeDefined();
        expect(deletedTask._id).toBeDefined();
        expect(deletedTask._id).toStrictEqual(task._id);

        const result = await taskService.findOne(String(deletedTask._id));
        expect(result).toBeNull();
      });

      it('should return null for non-existing ID', async () => {
        const nonExistingId = new mongoose.Types.ObjectId().toHexString();
        const result = await taskService.delete(String(nonExistingId));
        expect(result).toBeNull();
      });
    });
  });
});