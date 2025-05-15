interface Student {
    studentId: number,
    names: string,
    mothersLastName: string,
    fathersLastName: string,
}

export interface GroupDescriptionEntity {
    id: number,
    teacher: {
        id: number,
        names: string,
        fathersLastName: string,
        mothersLastName: string
    }
    year: number,
    name: string,
    students: Student[]
}

