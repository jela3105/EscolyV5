import { RegisterUserDTO } from "../dtos/auth/register-user.dto";
import { UserEntity } from "../entities/user.entity";

export abstract class AuthRepository{
    // TODO: Implement the login method
    //abstract login(loginUserDTO : LoginUserDTO) : Promise<UserEntity>;

    abstract register(registerUserDTO : RegisterUserDTO) : Promise<UserEntity>;
}