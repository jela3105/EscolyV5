import { LoginUserDTO } from "../dtos/auth/login-user.dto";
import { HttpError } from "../errors/http.error";
import { AuthRepository } from "../repositories/auth.repository";

interface UserToken {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    }
}

abstract class LoginUserUseCase {
    abstract execute(loginUserDTO: LoginUserDTO): Promise<any>;
}

type SignToken = (payload: Object, durantion?: number) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken
    ) { }

    async execute(loginUserDTO: LoginUserDTO): Promise<UserToken> {

        const user = await this.authRepository.login(loginUserDTO);
        const token = await this.signToken({ id: user.userId });

        if (!token) {
            throw HttpError.internalServerError();
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

