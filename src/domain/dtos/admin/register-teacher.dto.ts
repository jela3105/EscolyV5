import { Validators } from "../../../config/validators";

export class RegisterTeacherDTO {
    private constructor(
        //TODO: Receive group id
        public email: string,
        public names: string,
        public fathersLastName: string,
        public mothersLastName: string
    ) { }

    static create(object: { [key: string]: any; }): [string?, RegisterTeacherDTO?] {

        const {email, names ,fathersLastName, mothersLastName } = object;

        if (!email) return ["Missing email"];
        if (!Validators.email.test(email)) return ["Invalid email"];

        return [
            undefined,
            new RegisterTeacherDTO(
                email.toLowerCase(),
                names,
                fathersLastName,
                mothersLastName
            ),
        ];
    }
}
