import {Injectable} from '@nestjs/common';

export interface User{
    name: String;
    email: String;
    password: String;
}

@Injectable()
export class TasksService{

    //uso de interface
    getTasks(): User{
        return {
            name: 'Nery',
            email: 'nery@gmail',
            password: '123456'
        }
    }
    testing(){
        return 'test en proceso'
    }

    createTask(){
        return 'Creando Tareas'
    }

    updateTask(){
        return 'Actualizando Tareas'
    }

    deleteTask(){
        return 'Eliminando Tareas'
    }

    updateTaskStatus(){
        return 'Actualizando estado de tareas'
    }
 

}