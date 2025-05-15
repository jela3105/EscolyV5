export abstract class GuardianRepository {

    abstract getStudents(id: number): Promise<any[]>;
    abstract updateDevice(studentId: number, deviceId: string, guardianId: number): Promise<void>;
    abstract getDeviceId(studentId: number, guardianId: number): Promise<string>;
}