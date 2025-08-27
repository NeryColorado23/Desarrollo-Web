import {Module} from "@nestjs/common";
import { TaksController } from "./tasks.controller";


@Module({
  controllers: [TaksController],    
})
export class TaskModule{
}
