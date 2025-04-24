
export abstract class GuardianDataSource {

    abstract getStudents(id: number): Promise<any[]>;
    abstract updateDevice(studentId: number, deviceId: string, guardianId: number): Promise<void>;
    abstract addHomeLocation(studentId: number, lat: number, lng: number, guardianId: number): Promise<void>;
    abstract updateHomeLocation(locationId: number, lat: number, lng: number, guardianId: number): Promise<void>;

}