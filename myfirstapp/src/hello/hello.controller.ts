import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';    

@Controller()   
export class HelloController {

    @Get('/hello')
    index( @Req() request: Request, @Res() response: Response){
        console.log(request.url)
        response.status(200).json({
            message: 'HEllo World',
        });
    }      
}  