import { AuthRepository } from "../../repositories/auth.repository";


abstract class RegisterUserUseCase {
    abstract execute(email: string, password: string): Promise<void>;
}

export class CreateUserPassword implements RegisterUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async execute(email: string, password: string) {
        await this.authRepository.createUserPassword(email, password);
    }

}