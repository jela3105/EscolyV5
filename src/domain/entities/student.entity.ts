export class StudentEntity {
    constructor(
        public readonly id: string,
        public readonly groupId: string | null,
        public readonly names: string,
        public readonly fathersLastName: string,
        public readonly mothersLastName: string,
        public readonly guardians: string[],
    ) { }
}