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
                    StudentInfo.names, 
                    StudentInfo.fathersLastName, 
                    StudentInfo.mothersLastname, 
                    Groupp.groupName, 
                    Groupp.Yearr as year, 
                    CONCAT(User.names, ' ', User.fathersLastName, ' ', User.mothersLastName) AS teacher
                FROM 
                    (
                        SELECT 
                            Student.names, 
                            Student.fathersLastName, 
                            Student.mothersLastname, 
                            Groupp.groupId 
                        FROM Guardian 
                        INNER JOIN Student ON Student.studentId = Guardian.studentId 
                        INNER JOIN User ON User.userId = Guardian.userId 
                        INNER JOIN Groupp ON Student.groupId = Groupp.groupId 
                        WHERE User.userId = ?
                    ) AS StudentInfo
                INNER JOIN Groupp ON Groupp.groupId = StudentInfo.groupId
                INNER JOIN User ON User.userId = Groupp.userId;
            `, [id]);
            return rows as any[];
        } catch (error: any) {
            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

}
