import { MysqlDatabase } from "../../data/mysql";
import { HttpError, UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { UserEntityMapper } from "../mappers/user.mapper";
import { buildLogger } from "../../config/logger";
import { RegisterUserDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RoleEntity } from "../../domain/entities/role.entity";
import { RoleEnum } from "../../domain/enums/role.enum";
import { GroupEntity } from "../../domain/entities/group.entity";
import { GroupEntityMapper } from "../mappers/group.mapper";
import { RegisterGroupDTO } from "../../domain/dtos/admin/register-group.dto";
import { StudentEntity } from "../../domain/entities/student.entity";
import { RegisterStudentDTO } from "../../domain/dtos/admin/register-student.dto";
import { GroupDescriptionEntity } from "../../domain/entities/group-description.entity";
import { StudentDescriptionEntity } from "../../domain/entities/student-description.entity";
import { UpdateUserDTO } from "../../domain/dtos/admin/update-user.dto";
import { UpdateStudentDTO } from "../../domain/dtos/admin/update-student.dto";

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
                "SELECT Groupp.userId AS teacher, Yearr, groupName, groupId from Groupp left join User on User.userId = Groupp.userId ORDER BY Yearr, groupName"
            );

            return rows.map((group) => GroupEntityMapper.groupEntityFromObject(group));
        } catch (error: any) {
            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async getGroupById(id: number): Promise<GroupDescriptionEntity> {
        try {
            const pool = await MysqlDatabase.getPoolInstance();
            const [students]: [any[], any] = await pool.query(
                "SELECT studentId, names, mothersLastName, fathersLastName from Student WHERE groupId = ?", [id]
            )

            const [teacher]: [any[], any] = await pool.query(
                "SELECT userId, names, fathersLastName, mothersLastName, Yearr, groupName FROM User NATURAL JOIN Groupp WHERE groupId = ?", [id]
            );

            return {
                id,
                year: teacher[0].Yearr,
                name: teacher[0].groupName,
                teacher: {
                    id: teacher[0].userId,
                    names: teacher[0].names,
                    fathersLastName: teacher[0].fathersLastName,
                    mothersLastName: teacher[0].mothersLastName,
                },
                students: students
            };

        } catch (error: any) {
            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async getStudentById(id: number): Promise<StudentDescriptionEntity> {
        try {
            const pool = await MysqlDatabase.getPoolInstance();
            const [rows]: [any[], any] = await pool.query(
                "SELECT studentId, groupId, names, mothersLastName, fathersLastName, Groupp.Yearr, Groupp.groupName FROM Student NATURAL JOIN Groupp WHERE studentId = ?", [id]
            );

            const student = rows[0];

            if (!student) {
                throw HttpError.notFound("Student not found");
            }

            const [guardians]: [any[], any] = await pool.query(
                "SELECT User.userId, User.names, User.mothersLastName, User.fathersLastName, User.email FROM Guardian NATURAL JOIN User WHERE studentId = ?", [id]
            )
            return new StudentDescriptionEntity(
                student.studentId,
                student.groupId,
                student.groupName,
                student.Yearr,
                student.names,
                student.fathersLastName,
                student.mothersLastName,
                guardians.map(({ userId, names, fathersLastName, mothersLastName, email }) => ({
                    id: userId,
                    names,
                    fathersLastName,
                    mothersLastName,
                    email
                }))
            );

        } catch (error: any) {
            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async getUsers(role: RoleEnum): Promise<UserEntity[]> {
        try {
            const pool = await MysqlDatabase.getPoolInstance();
            const [rows]: [any[], any] = await pool.query("SELECT * FROM User WHERE roleId = ?", [role]);

            return rows.map((user) => UserEntityMapper.userEntityFromObject(user));
        } catch (error: any) {
            this.logger.error(`${error.code} ${error}`);
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

        } catch (error: any) {

            if (error instanceof HttpError) {
                throw error;
            }

            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async registerStudent(registerStudentDTO: RegisterStudentDTO): Promise<StudentEntity> {
        const { names, fathersLastName, mothersLastName, guardians } = registerStudentDTO;

        try {
            const pool = await MysqlDatabase.getPoolInstance();

            const [rows]: any = await pool.execute(
                "CALL CreateStudentWithGuardians(?, ?, ?, ?)",
                [names, fathersLastName, mothersLastName, JSON.stringify(guardians)]
            )

            return new StudentEntity(
                rows[0][0].studentId,
                null,
                names,
                fathersLastName,
                mothersLastName,
                guardians
            )

        } catch (error: any) {


            if (error.code == "ER_SIGNAL_EXCEPTION") {
                throw HttpError.conflict(error.sqlMessage);
            }

            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async registerUser(registerUserDTO: RegisterUserDTO, role: RoleEnum): Promise<any> {

        const { email, names, fathersLastName, mothersLastName } = registerUserDTO;

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
                    RoleEntity.fromEnum(role).roleNumber,
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
        } catch (error: any) {

            if (error instanceof HttpError) {
                throw error;
            }

            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
        console.log(id)
        const { email, names, fathersLastName, mothersLastName } = updateUserDTO;

        try {
            const pool = await MysqlDatabase.getPoolInstance();

            // Verify if user exists
            const [existingUser]: [any[], any] = await pool.query("SELECT * FROM User WHERE userId = ?", [id]);
            if (existingUser.length === 0) {
                throw HttpError.notFound("User not found");
            }

            console.log(JSON.stringify(existingUser[0]))

            // Verify if new email is already taken by another user
            const [emailCheck]: [any[], any] = await pool.query("SELECT * FROM User WHERE email = ? AND userId != ?", [email, id]);
            if (emailCheck.length > 0) {
                throw HttpError.conflict("Email already in use");
            }

            // Update user
            await pool.execute(
                "UPDATE User SET names = ?, fathersLastName = ?, mothersLastName = ?, email = ? WHERE userId = ?",
                [names, fathersLastName, mothersLastName, email, id]
            );

            // Get updated user
            const [updatedUser]: [any[], any] = await pool.query("SELECT * FROM User WHERE userId = ?", [id]);
            return UserEntityMapper.userEntityFromObject(updatedUser[0]);
        } catch (error: any) {

            if (error instanceof HttpError) {
                throw error;
            }

            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async updateStudent(id: number, updateStudentDTO: UpdateStudentDTO): Promise<void> {
        const { names, fathersLastName, mothersLastName, groupId } = updateStudentDTO;

        try {
            const pool = await MysqlDatabase.getPoolInstance();

            await pool.execute(
                "UPDATE Student SET names = ?, fathersLastName = ?, mothersLastName = ?, groupId = ? WHERE studentId = ?",
                [names, fathersLastName, mothersLastName, groupId, id]
            )

        } catch (error: any) {

            if (error.code == "ER_NO_REFERENCED_ROW_2") {
                throw HttpError.conflict("El grupo no existe");
            }

            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

}