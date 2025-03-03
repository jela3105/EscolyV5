import { MysqlDatabase } from "../../data/mysql/mysql-database";
import {
  AuthDataSource,
  HttpError,
  RegisterUserDTO,
  UserEntity,
} from "../../domain";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { UserEntityMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthMysqlDatasourceImpl implements AuthDataSource {

  constructor(
    private readonly hashFunction: HashFunction,
    private readonly compareFunction: CompareFunction
  ) { }

  async login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
    
    const { email, password } = loginUserDTO;

    try {
      const pool = await MysqlDatabase.getPoolInstance();
      const [rows]: [any[], any] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

      if (rows.length == 0) {
        throw HttpError.unauthorized("User not found");
      }

      const user = rows[0];

      if (!this.compareFunction(password, user.password)) {
        throw HttpError.unauthorized("Password or email incorrect");
      }

      return UserEntityMapper.userEntityFromObject(user);
    } catch (error) {

      if (error instanceof HttpError) {
        throw error;
      }

      console.log(error);
      throw HttpError.internalServerError();
    }
  }

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
}
