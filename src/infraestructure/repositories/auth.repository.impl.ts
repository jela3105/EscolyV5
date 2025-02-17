import { AuthDataSource, AuthRepository, RegisterUserDTO, UserEntity } from "../../domain";

export class AuthRepositoryImpl implements AuthRepository{

    constructor (
        private readonly datasource: AuthDataSource
    ){}

    register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
        return this.datasource.register(registerUserDTO);
    }

}