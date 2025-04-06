import { Validators } from "../../../config";

export class RegisterStudentDTO {
    constructor(
        public readonly names: string,
        public readonly fathersLastName: string,
        public readonly mothersLastName: string,
        public readonly guardians: string[],
    ) { }


    static create(object: { [key: string]: any; }): [string?, RegisterStudentDTO?] {
        const { names, fathersLastName, mothersLastName, guardians } = object;

        if (!names) {
            return ["Missing names", undefined];
        }

        if (!fathersLastName) {
            return ["Missing fathers last name", undefined];
        }

        if (!mothersLastName) {
            return ["Missing mothers last name", undefined];
        }

        if (guardians.length === 0) {
            return ["Guardians are required", undefined];
        }

        for (const guardian of guardians) {
            if (!Validators.email.test(guardian)) {
                return [`Invalid guardian email: ${guardian}`, undefined];
            }
        }

        return [undefined, new RegisterStudentDTO(names, fathersLastName, mothersLastName, guardians)];
    }
}