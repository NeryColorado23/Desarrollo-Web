import {Injectable} from '@nestjs/common';

@Injectable()
export class TasksService{

    getTasks(){
        return ['Task1','Task2','Task3']
    }
}