import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from "@nestjs/typeorm"
import { TasksRepository } from './tasks.repository';
import { Task } from './entities/task.entity';
import { TaskStatus } from './utls/task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class TasksService {
  private logger = new Logger('TasksService')
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository
  ) { }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, userId: user.id } })
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    return found
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto
    const task = new Task()
    task.description = description
    task.title = title
    task.status = TaskStatus.OPEN
    task.user = user
    try {
      await task.save()
    } catch (err) {
      this.logger.log(`Failed to create a task for user ${user.username}. Data: ${createTaskDto}`)
      throw new InternalServerErrorException()
    }

    delete task.user
    return task
  }
  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {

      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatusById(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user)
    task.status = status
    await task.save()
    return task
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {

    return this.tasksRepository.getTasks(filterDto, user)
  }
}
