import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';
import { TaskStatus } from './utls/task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User
   ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe,) id: number,@GetUser() user:User): Promise<Task> {
    return this.tasksService.getTaskById(id,user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  )
    : Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: number,@GetUser() user:User): Promise<void> {
    return this.tasksService.deleteTask(id,user);
  }
  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user:User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(id, status,user)
  }
}