import { MysqlDatabase } from "../../data/mysql";
import { HttpError, UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { UserEntityMapper } from "../mappers/user.mapper";
import { buildLogger } from "../../config/logger";
import { RegisterTeacherDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RoleEntity } from "../../domain/entities/role.entity";
import { RoleEnum } from "../../domain/enums/role.enum";

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

        const { email, names, fathersLastName, mothersLastName } = registerTeacherDto;

        try {
            const pool = await MysqlDatabase.getPoolInstance();
            // Verify if user already exists
            const [rows]: [any[], any] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

            if (rows.length != 0) {
                throw HttpError.conflict("User already exists");
            }

            // Insert user
            await pool.execute(
                "INSERT INTO User (roleId, names, fathersLastName, mothersLastName, email) VALUES (?, ?, ?, ?, ?)",
                [
                    RoleEntity.fromEnum(RoleEnum.TEACHER).roleNumber,
                    names,
                    fathersLastName,
                    mothersLastName,
                    email,
                ]
            );
            const [userInserted]: [any[], any] = await pool.query(
                "SELECT * FROM User WHERE email = ?",
                [email]
            );

            return UserEntityMapper.userEntityFromObject(userInserted[0]);
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }

            this.logger.error(`${error}`);
            throw HttpError.internalServerError();
        }
    }
}