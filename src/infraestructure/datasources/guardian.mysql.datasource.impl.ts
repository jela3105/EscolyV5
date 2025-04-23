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
                    Student.names, 
                    Student.fathersLastName, 
                    Student.mothersLastname, 
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
}
