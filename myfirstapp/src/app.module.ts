import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [TaskModule, ProjectsModule, AuthModule, UsersModule, HelloModule],
  controllers: [UsersController],
})
export class AppModule {}
