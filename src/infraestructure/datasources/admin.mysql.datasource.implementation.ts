import { MysqlDatabase } from "../../data/mysql";
import { HttpError, UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { UserEntityMapper } from "../mappers/user.mapper";
import { buildLogger } from "../../config/logger";

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
}