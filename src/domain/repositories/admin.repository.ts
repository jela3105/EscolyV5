import { UserEntity } from "../entities/user.entity";

export abstract class AdminRepository {
  abstract getTeachers(): Promise<UserEntity[]>;
}