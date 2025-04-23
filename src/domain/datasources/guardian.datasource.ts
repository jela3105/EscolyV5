
export abstract class GuardianDataSource {

    abstract getStudents(id: number): Promise<any[]>;

}