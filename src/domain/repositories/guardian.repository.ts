export abstract class GuardianRepository {

    abstract getStudents(id: number): Promise<any[]>;
}