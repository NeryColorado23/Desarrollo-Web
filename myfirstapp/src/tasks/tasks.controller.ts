import { Controller, Delete, Get, Patch, Post, Put } from "@nestjs/common";
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

    @Post('/tasks')
    createTask(){
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