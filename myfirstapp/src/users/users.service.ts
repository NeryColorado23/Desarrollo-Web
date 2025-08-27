import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    private users = [
        {
        id:1,
        name: 'Nery C',
        phone: 4245413
        },
        {
        id:2,
        name: 'Nery O',
        phone: 424
        }

]
    ///esto lo llamara users controller
    getUsers(){
        return this.users;
    }
}
