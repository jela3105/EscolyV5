import { Validators } from "../../../config/validators";

export class UpdateUserDTO {
    private constructor(
        public names: string,
        public fathersLastName: string,
        public mothersLastName: string,
        public email: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateUserDTO?] {
        const {
            names,
            fathersLastName,
            mothersLastName,
            email,
        } = object;

        if (!names) return ["Missing names"];
        if (!fathersLastName) return ["Missing fathers last name"];
        if (!mothersLastName) return ["Missing mothers last name"];
        if (!email) return ["Missing email"];
        if (!Validators.email.test(email)) return ["Invalid email"];

        return [
            undefined,
            new UpdateUserDTO(
                names,
                fathersLastName,
                mothersLastName,
                email.toLowerCase()
            ),
        ];
    }
} 