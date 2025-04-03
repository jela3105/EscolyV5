import { AuthRepository } from "../../repositories/auth.repository";

abstract class RecoverPasswordUseCase {
    abstract execute(email: string, password: string): Promise<void>;
}

export class RecoverUserPassword implements RecoverPasswordUseCase {

    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async execute(email: string, password: string) {
        await this.authRepository.recoverUserPassword(email, password);
    }

}