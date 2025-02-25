import { stringify } from "querystring";
import { MysqlDatabase } from "../../data/mysql/mysql-database";
import {
  AuthDataSource,
  CustomError,
  RegisterUserDTO,
  UserEntity,
} from "../../domain";

export class AuthMysqlDatasourceImpl implements AuthDataSource {
  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    const { role, names, fathersLastName, mothersLastName, email, password } =
      registerUserDTO;

    console.log(registerUserDTO);

    try {
      const pool = await MysqlDatabase.getPoolInstance();

      // Verify if user already exists
      const [rows]: [any[], any] = await pool.query(
        "SELECT * FROM User WHERE email = ?",
        [email]
      );

      if (rows.length > 0) {
        throw CustomError.conflict("User already exists");
      }

      // Password hash

      // Insert user
      console.log("Inserting user");
      const [result] = await pool.execute(
        "INSERT INTO User (roleId, names, fathersLastName, mothersLastName, email, password) VALUES (?, ?, ?, ?, ?, ?)",
        [role, names, fathersLastName, mothersLastName, email, password]
      );

      console.log(result);

      // Map answer to UserEntity
      return new UserEntity(
        1,
        1,
        "Diego",
        "Rivera",
        "Corona",
        "dr@g.com",
        "password",
        "token"
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.log(error);
      throw CustomError.internalServerError();
    }
  }
}
