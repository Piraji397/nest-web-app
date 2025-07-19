import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user/user.interface';

@Injectable()
export class UsersService {
    private users:User[] = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password',
        },
        {
            id: 2,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            password: 'password',
        },
    ]

    findAll() {
        return this.users.map((user:User) => {
            delete (user as any).password;
            return user;
        });
    }

    findOne(id: number) {
        const user:User | undefined = this.users.find((user:User) => user.id === id);
        if(!user){
            throw new NotFoundException('User not found');
        }
        delete (user as any).password;
        return user;
    }

    create(user:User){
        const newUser = {id:this.users.length + 1, ...user};
        this.users.push(newUser);
        return newUser;
    }
}
