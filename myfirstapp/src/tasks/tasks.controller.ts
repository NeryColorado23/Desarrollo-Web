import { Controller, Get } from "@nestjs/common";

@Controller({})
export class TaksController {

    @Get('/tasks')
    getAllTasks(){
        return 'Obteniendo tareas'
    }
    
    @Get('/')
    index(){
        return 'Home Page'
    }

}