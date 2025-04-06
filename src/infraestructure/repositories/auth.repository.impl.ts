import { AuthDataSource, AuthRepository, RegisterUserDTO, UserEntity } from "../../domain";
import { ChangePasswordDTO } from "../../domain/dtos/auth/change-password.dto";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";

export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly datasource: AuthDataSource
    ) { }

    register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
        return this.datasource.register(registerUserDTO);
    }

    login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
        return this.datasource.login(loginUserDTO);
    }

    createUserPassword(email: string, password: string) {
        return this.datasource.createUserPassword(email, password);
    }

    recoverUserPassword(email: string, password: string): Promise<void> {
        return this.datasource.recoverUserPassword(email, password);
    }

    userExists(email: string): Promise<boolean> {
        return this.datasource.userExists(email);
    }

    updatePassword(email: string, currentPassword: string, changePasswordDTO: ChangePasswordDTO): Promise<void> {
        return this.datasource.updatePassword(email, currentPassword, changePasswordDTO);
    }
}