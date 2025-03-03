import { MysqlDatabase } from "../../data/mysql";
import { HttpError, UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { UserEntityMapper } from "../mappers/user.mapper";

export class AdminDatasourceImpl implements AdminDataSource {

    constructor() { }

    async getTeachers(): Promise<UserEntity[]> {
        try {
            const pool = await MysqlDatabase.getPoolInstance();
            const [rows]: [any[], any] = await pool.query("SELECT * FROM User WHERE roleId = 2");

            return rows.map((user) => UserEntityMapper.userEntityFromObject(user));
        } catch (error) {
            console.log(error);
            throw HttpError.internalServerError();
        }
    }
}