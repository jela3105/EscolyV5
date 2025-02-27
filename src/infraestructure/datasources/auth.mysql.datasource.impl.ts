import { MysqlDatabase } from "../../data/mysql/mysql-database";
import {
  AuthDataSource,
  HttpError,
  RegisterUserDTO,
  UserEntity,
} from "../../domain";
import { UserEntityMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthMysqlDatasourceImpl implements AuthDataSource {

  constructor(
    private readonly hashFunction: HashFunction,
    private readonly compareFunction: CompareFunction
  ) { }

  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {

    const { role, names, fathersLastName, mothersLastName, email, password } = registerUserDTO;

    try {
      const pool = await MysqlDatabase.getPoolInstance();

      // Verify if user already exists
      const [rows]: [any[], any] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

      if (rows.length != 0) {
        throw HttpError.conflict("User already exists");
      }

      // Insert user
      await pool.execute(
        "INSERT INTO User (roleId, names, fathersLastName, mothersLastName, email, password) VALUES (?, ?, ?, ?, ?, ?)",
        [
          role,
          names,
          fathersLastName,
          mothersLastName,
          email,
          this.hashFunction(password),
        ]
      );
      const [userInserted]: [any[], any] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

      return UserEntityMapper.userEntityFromObject(userInserted[0]);
    } catch (error) {

      if (error instanceof HttpError) {
        throw error;
      }

      console.log(error);
      throw HttpError.internalServerError();
    }
  }

  async getUsers(): Promise<UserEntity[]> {

    try {
      const pool = await MysqlDatabase.getPoolInstance();
      const [rows]: [any[], any] = await pool.query("SELECT * FROM User");

      return rows.map((user) => UserEntityMapper.userEntityFromObject(user));
    } catch (error) {
      console.log(error);
      throw HttpError.internalServerError();
    }
  }
}
