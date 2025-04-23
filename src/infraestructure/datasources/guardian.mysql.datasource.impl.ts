import { buildLogger } from "../../config";
import { MysqlDatabase } from "../../data/mysql";
import { HttpError } from "../../domain";
import { GuardianDataSource } from "../../domain/datasources/guardian.datasource";

export class GuardianDataSourceImpl implements GuardianDataSource {
    private logger = buildLogger("GuardianDatasourceImpl");

    constructor() { }

}
