import { MysqlDatabase } from "../../data/mysql";
import { HttpError, UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { UserEntityMapper } from "../mappers/user.mapper";
import { buildLogger } from "../../config/logger";
import { RegisterTeacherDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RoleEntity } from "../../domain/entities/role.entity";
import { RoleEnum } from "../../domain/enums/role.enum";
import { GroupEntity } from "../../domain/entities/group.entity";
import { GroupEntityMapper } from "../mappers/group.mapper";
import { RegisterGroupDTO } from "../../domain/dtos/admin/register-group.dto";

interface RegisterTeacherSuccessDTO {
    email: string;
    fathersLastName?: string;
    mothersLastName?: string;
    names?: string;
}

export class AdminDatasourceImpl implements AdminDataSource {
    private logger = buildLogger("AdminDatasourceImpl");

    constructor() { }

    async getGroups(): Promise<GroupEntity[]> {
        try {
            const pool = await MysqlDatabase.getPoolInstance();
            const [rows]: [any[], any] = await pool.query(
                "SELECT concat(names,' ' , mothersLastName, ' ', fathersLastName) teacher, Yearr, groupName, groupId from Groupp left join User on User.userId = Groupp.userId ORDER BY Yearr"
            );

            return rows.map((group) => GroupEntityMapper.groupEntityFromObject(group));
        } catch (error) {
            this.logger.error(`${error}`);
            throw HttpError.internalServerError();
        }
    }

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

    async registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void> {
        const { year, name } = registerGroupDTO;

        try {
            const pool = await MysqlDatabase.getPoolInstance();

            const [rows]: [any[], any] = await pool.execute(
                "INSERT INTO Groupp (groupName, Yearr) VALUES (?, ?)",
                [name, year]
            )

        } catch (error) {

            if (error instanceof HttpError) {
                throw error;
            }

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