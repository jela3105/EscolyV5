import { MysqlDatabase } from "../../data/mysql/mysql-database";
import {
  AuthDataSource,
  CustomError,
  RegisterUserDTO,
  UserEntity,
} from "../../domain";

export class AuthMysqlDatasourceImpl implements AuthDataSource {
  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    const { name, email = "h@.h.com", password } = registerUserDTO;

    console.log("email" + email);

    try {
      const pool = await MysqlDatabase.createPool();

      // Verify if user already exists
      pool.query(
        "SELECT * FROM User WHERE email = ?",
        [email],
        (err, results) => {
          console.log(results);
          if (results) throw CustomError.badRequest("User already exists");
          throw err;
        }
      );

      // Password hash

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

      throw CustomError.internalServerError();
    }
  }
}
