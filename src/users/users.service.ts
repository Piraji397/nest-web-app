import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user/user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { errorResponse, successResponse } from 'src/utils/request-response.utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private prisma:PrismaService){}

    findAll() {
        try {
            // return this.users.map((user:User) => {
            //     delete (user as any).password;
            //     return user;
            // });
            const users = this.prisma.user.findMany()
            return successResponse('Users fetched successfully', users);
        } catch (error) {
            throw new BadRequestException(errorResponse(404, 'Errror occured while fetching all users', error.message))
        }
    }

    findOne(id: number) {
        try {
            // const user:User | undefined = this.users.find((user:User) => user.id === id);
            const existingUser = this.prisma.user.findUnique({where: {id}});
            if(!existingUser){
                throw new NotFoundException(errorResponse(404, `User not found with id : ${id}`));
            }
            delete existingUser.password;
            return successResponse('User fetched successfully', existingUser);
        } catch (error) {
            throw new BadRequestException(errorResponse(404, `Error fetching user with id : ${id}`, error.message))
        }
    }

    async create(user:User){
        try {
            // const newUser = {id:this.users.length + 1, ...user};
            // this.users.push(newUser);

            const existingUser = await this.prisma.user.findUnique({where: {email:user.email, OR: [{name:user.name}]}});

            if(existingUser){
                throw new BadRequestException(errorResponse(400, 'User already exists'));
            }

            if(user.password){
                user.password = await bcrypt.hash(user.password, 10);
            }

            const newUser = this.prisma.user.create({data:user});

            return successResponse('User created successfully', newUser);
        } catch (error) {
            throw new BadRequestException(errorResponse(404, 'Error creating user', error.message))
        }
    }
}
