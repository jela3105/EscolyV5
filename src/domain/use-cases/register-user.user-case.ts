import { RegisterUserDTO } from "../dtos/auth/register-user.dto";
import { HttpError } from "../errors/http.error";
import { AuthRepository } from "../repositories/auth.repository";

interface User {
    user: {
        id: number;
        name: string;
        email: string;
    }
}

type SignToken = (payload: Object, durantion?: number) => Promise<string | null>;

abstract class RegisterUserUseCase {
    abstract execute(registerUserDto: RegisterUserDTO): Promise<any>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken
    ) { }

    async execute(registerUserDto: RegisterUserDTO): Promise<User> {

        const user = await this.authRepository.register(registerUserDto);

        return {
            user: {
                id: user.userId,
                name: user.names,
                email: user.email
            }
        }
    }

}