import { MysqlDatabase } from "../../data/mysql";
import { HttpError, UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { UserEntityMapper } from "../mappers/user.mapper";
import { buildLogger } from "../../config/logger";
import { RegisterTeacherDTO } from "../../domain/dtos/admin/register-teacher.dto";

interface RegisterTeacherSuccessDTO {
    email: string;
    fathersLastName?: string;
    mothersLastName?: string;
    names?: string;
}

export class AdminDatasourceImpl implements AdminDataSource {

    private logger = buildLogger("AdminDatasourceImpl");

    constructor() { }

    async getTeachers(): Promise<UserEntity[]> {
        try {
            const pool = await MysqlDatabase.getPoolInstance();
            const [rows]: [any[], any] = await pool.query("SELECT * FROM User WHERE roleId = 2");

            return rows.map((user) => UserEntityMapper.userEntityFromObject(user));
        } catch (error) {
            this.logger.error(`${error}`);
            throw HttpError.internalServerError();
        }
    }

    async registerTeacher(registerTeacherDto: RegisterTeacherDTO): Promise<any> {
        try {
            const pool = await MysqlDatabase.getPoolInstance();
            const { email, fathersLastName, mothersLastName, names } = registerTeacherDto;
            const setClause = `roleId = 2`;

            if (fathersLastName) {
                setClause.concat(`, fathersLastName = '${fathersLastName}'`);
            }

            if (mothersLastName) {
                setClause.concat(`, mothersLastName = '${mothersLastName}'`);
            }

            if (names) {
                setClause.concat(`, names = '${names}'`);
            }

            const [result]: [any, any] = await pool.execute(`UPDATE User SET ${setClause} WHERE email = ?`, [email]);

            if (result.affectedRows === 0) {
                throw HttpError.notFound("User not found");
            }

            return {
                email,
                fathersLastName,
                mothersLastName,
                names
            } as RegisterTeacherSuccessDTO;

        } catch (error: any) {

            if (error instanceof HttpError) {
                throw error;
            }

            this.logger.error(`${error}`);
            throw HttpError.internalServerError();
        }
    }
}