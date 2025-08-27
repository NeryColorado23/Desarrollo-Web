import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [TaskModule, ProjectsModule],
})
export class AppModule {}
