export class ChangePasswordDTO {
    private constructor(
        public readonly currentPassword: string,
        public readonly newPassword: string
    ) { }

    static create(object: { [key: string]: any }): [string?, ChangePasswordDTO?] {
        const { currentPassword, newPassword } = object;

        if (!currentPassword) return ['Current password is required'];
        if (!newPassword) return ['New password is required'];
        if (currentPassword === newPassword) return ['Passwords must be different'];

        return [undefined, new ChangePasswordDTO(currentPassword, newPassword)];
    }
} 