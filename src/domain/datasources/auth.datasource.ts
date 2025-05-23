import { ChangePasswordDTO } from "../dtos/auth/change-password.dto";
import { LoginUserDTO } from "../dtos/auth/login-user.dto";
import { RegisterUserDTO } from "../dtos/auth/register-user.dto";
import { UserEntity } from "../entities/user.entity";

export abstract class AuthDataSource {

    abstract login(loginUserDTO: LoginUserDTO): Promise<UserEntity>;
    abstract register(registerUserDTO: RegisterUserDTO): Promise<UserEntity>;
    abstract createUserPassword(email: string, password: string): Promise<void>;
    abstract recoverUserPassword(email: string, password: string): Promise<void>;
    abstract userExists(email: string): Promise<boolean>;
    abstract updatePassword(email: string, currentPassword: string, changePasswordDTO: ChangePasswordDTO): Promise<void>;

}