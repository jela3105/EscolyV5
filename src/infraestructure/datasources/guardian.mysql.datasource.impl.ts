import { buildLogger } from "../../config";
import { MysqlDatabase } from "../../data/mysql";
import { HttpError } from "../../domain";
import { GuardianDataSource } from "../../domain/datasources/guardian.datasource";

export class GuardianDataSourceImpl implements GuardianDataSource {
    private logger = buildLogger("GuardianDatasourceImpl");

    constructor() { }

    async getStudents(id: number): Promise<any[]> {
        const pool = await MysqlDatabase.getPoolInstance();
        try {
            const [rows] = await pool.query(`
                SELECT 
                    Student.studentId as id,
                    Student.names, 
                    Student.fathersLastName, 
                    Student.mothersLastName, 
                    Student.deviceId,
                    Groupp.groupName, 
                    Groupp.Yearr AS year, 
                    CONCAT(User.names, ' ', User.fathersLastName, ' ', User.mothersLastName) AS teacher
                FROM Guardian
                INNER JOIN Student ON Student.studentId = Guardian.studentId
                INNER JOIN User AS GuardianUser ON GuardianUser.userId = Guardian.userId
                INNER JOIN Groupp ON Student.groupId = Groupp.groupId
                INNER JOIN User ON User.userId = Groupp.userId
                WHERE GuardianUser.userId = ?;
            `, [id]);
            return rows as any[];
        } catch (error: any) {
            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async updateDevice(studentId: number, deviceId: string, guardianId: number): Promise<void> {
        const pool = await MysqlDatabase.getPoolInstance();
        try {

            // Check if the guardian has access to the student
            const [studentsIds]: [any[], any] = await pool.query(`
                SELECT Guardian.studentId
                FROM Guardian
                WHERE Guardian.userId = ?`, [guardianId]);

            if (studentsIds.length === 0)
                throw HttpError.forbidden("El tutor no tiene estudiantes registrados");

            // Check if the studentId is in the list of studentsIds
            // If the studentId is not in the list, throw an error
            const studentExists = studentsIds.some((student: any) => student.studentId === studentId);

            if (!studentExists) throw HttpError.forbidden("El tutor no tiene acceso a este estudiante");

            // Check if the deviceId is already assigned to another student
            const [existingDevice]: [any[], any] = await pool.query(`
                SELECT studentId
                FROM Student
                WHERE deviceId = ?;
            `, [deviceId, studentId]);

            if (existingDevice.length > 0) {
                throw HttpError.badRequest("El dispositivo ya está asignado a otro estudiante");
            }

            await pool.query(`
                UPDATE Student 
                SET deviceId = ?
                WHERE studentId = ?;
            `, [deviceId, studentId]);

        } catch (error: any) {

            if (error instanceof HttpError) throw error;

            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }


}
