import { Body, Controller, Delete, Get, Patch, Post, Put } from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller({})
export class TaskController {

    tasksService: TasksService;
    constructor(tasksService : TasksService){
        this.tasksService = tasksService;
    }

    //genere servicio
    @Get('/tasks')
    getAllTasks(){

        return this.tasksService.getTasks();
    }

    //extraer valor de thunder extension de mi primer tarea body
    @Post()
    createTask(@Body() task: any){
    console.log(task)
    return this.tasksService.createTask();
    }

    @Put('/tasks')
    updateTask(){
        return this.tasksService.updateTask();
    }

    @Delete('/tasks')
    deleteTask(){
        return this.tasksService.deleteTask();
    }

    @Patch('/tasks')
    updateTaskStatus(){
        return this.tasksService.updateTaskStatus();
    }




}