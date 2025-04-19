import { Validators } from "../../../config";

export class UpdateStudentDTO {
    constructor(
        public readonly names?: string,
        public readonly fathersLastName?: string,
        public readonly mothersLastName?: string,
    ) { }

    static create(object: { [key: string]: any; }): [string?, UpdateStudentDTO?] {
        const { names, fathersLastName, mothersLastName } = object;

        if (!names) return ["El nombre es requerido"];
        if (!fathersLastName) return ["El apellido paterno es requerido"];
        if (!mothersLastName) return ["El apellido materno es requerido"];

        return [undefined, new UpdateStudentDTO(names, fathersLastName, mothersLastName)];
    }
} 