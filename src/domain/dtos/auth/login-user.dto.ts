import { Validators } from "../../../config/validators";

export class LoginUserDTO {

    private constructor(public email: string, public password: string) { }

    static create(object: { [key: string]: any }): [string?, LoginUserDTO?] {
        const { email, password } = object;

        if (!email) return ["Missing email"];
        if (!password) return ["Missing password"];
        if (!Validators.email.test(email)) return ["Invalid email"];

        return [undefined, new LoginUserDTO(email.toLowerCase(), password)];
    }
}
