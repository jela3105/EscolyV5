import { RegisterTeacherDTO } from "../dtos/admin/register-teacher.dto";
import { UserEntity } from "../entities/user.entity";

export abstract class AdminRepository {
  abstract getTeachers(): Promise<UserEntity[]>;
  abstract registerTeacher(registerTeacherDto: RegisterTeacherDTO): Promise<UserEntity>
}