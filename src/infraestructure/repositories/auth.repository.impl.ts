import { AuthDataSource, AuthRepository, RegisterUserDTO, UserEntity } from "../../domain";
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
}