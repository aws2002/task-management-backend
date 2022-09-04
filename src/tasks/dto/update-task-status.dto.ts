import { IsEnum } from 'class-validator';
import { TaskStatus } from '../utls/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
