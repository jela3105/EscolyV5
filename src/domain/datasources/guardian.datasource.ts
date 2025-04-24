
export abstract class GuardianDataSource {

    abstract getStudents(id: number): Promise<any[]>;
    abstract updateDevice(studentId: number, deviceId: string, guardianId: number): Promise<void>;

}