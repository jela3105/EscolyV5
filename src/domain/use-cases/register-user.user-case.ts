import { RegisterUserDTO } from "../dtos/auth/register-user.dto";
import { CustomError } from "../errors/custom.error";
import { AuthRepository } from "../repositories/auth.repository";

interface UserToken {
    token: string;
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

    async execute(registerUserDto: RegisterUserDTO): Promise<UserToken> {

        const user = await this.authRepository.register(registerUserDto);
        const token = await this.signToken({ id: user.userId });

        if (!token) {
            throw CustomError.internalServerError("Error generating token");
        }

        return {
            token: token,
            user: {
                id: user.userId,
                name: user.names,
                email: user.email
            }
        }
    }

}