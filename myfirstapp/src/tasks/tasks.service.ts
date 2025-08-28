import {Injectable} from '@nestjs/common';

@Injectable()
export class TasksService{

    getTasks(){
        return ['Task1','Task2','Task3']
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