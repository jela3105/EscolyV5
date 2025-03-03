import { UserEntity } from "../entities/user.entity";

export abstract class AdminDataSource {
    abstract getTeachers(): Promise<UserEntity[]>;
}