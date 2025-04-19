import { buildLogger } from "../../config";
import { MysqlDatabase } from "../../data/mysql";
import { HttpError } from "../../domain";
import { SupportDataSource } from "../../domain/datasources/support.datasource";
import { CreateTicketDTO } from "../../domain/dtos/support/CreateTicketDTO";

export class SupportDataSourceImpl implements SupportDataSource {
    private logger = buildLogger("SupportDatasourceImpl");

    constructor() { }

    async createTicket(createTicketDTO: CreateTicketDTO, userId: number): Promise<void> {
        const { title, description, severityId } = createTicketDTO;
        const pool = await MysqlDatabase.getPoolInstance();
        try {
            await pool.execute(
                "INSERT INTO BugReport (userId, title, description, severityId) VALUES (?, ?, ?, ?)",
                [userId, title, description, severityId]
            );
        } catch (error: any) {

            if (error.code == "ER_NO_REFERENCED_ROW_2")
                throw HttpError.conflict("La severidad ingresada no existe");

            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

    async getAllByUserId(id: number): Promise<any[]> {
        const pool = await MysqlDatabase.getPoolInstance();
        try {
            const [rows] = await pool.query("SELECT * FROM BugReport WHERE userId = ?", [id]);
            return rows as any[];
        } catch (error: any) {
            this.logger.error(`${error.code} ${error}`);
            throw HttpError.internalServerError();
        }
    }

}
