interface GuardianDescription {
    id: number;
    names: string;
    fathersLastName: string;
    mothersLastName: string;
    email: string;
}

export class StudentDescriptionEntity {
    constructor(
        public readonly id: string,
        public readonly groupId: string | null,
        public readonly groupName: string | null,
        public readonly year: number | null,
        public readonly names: string,
        public readonly fathersLastName: string,
        public readonly mothersLastName: string,
        public readonly guardians: GuardianDescription[],
    ) { }
}