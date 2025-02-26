import { stringify } from "querystring";
import { MysqlDatabase } from "../../data/mysql/mysql-database";
import {
  AuthDataSource,
  CustomError,
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
  ) {}

  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    const { role, names, fathersLastName, mothersLastName, email, password } =
      registerUserDTO;

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

      // Insert user
      const [insertionResult] = await pool.execute(
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

      const [userInserted] = await pool.query(
        "SELECT * FROM User WHERE email = ?",
        [email]
      );

      // TODO: validate mapper
      return UserEntityMapper.userEntityFromObject(userInserted);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.log(error);
      throw CustomError.internalServerError();
    }
  }
}
