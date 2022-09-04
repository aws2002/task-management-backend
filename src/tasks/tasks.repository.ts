import { Task } from "./entities/task.entity"
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./utls/task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/entities/user.entity";
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

  async getTasks(
    filterDto: GetTasksFilterDto, 
    user: User
    ): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id })
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere("(task.title LIKE :search OR task.description LIKE :search)", { search: `%${search}%` })
    }
    const tasks = await query.getMany();
    return tasks
  }
}