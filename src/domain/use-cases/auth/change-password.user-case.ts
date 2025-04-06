import { AuthRepository } from "../../repositories/auth.repository";
import { BcryptAdapter } from "../../../config";
import { ChangePasswordDTO } from "../../dtos/auth/change-password.dto";

export class ChangePassword {
    constructor(private readonly authRepository: AuthRepository) { }

    async execute(email: string, currentPassword: string, changePasswordDTO: ChangePasswordDTO): Promise<void> {
        await this.authRepository.updatePassword(email, currentPassword, changePasswordDTO);
    }
} 