import { buildLogger } from "../../config";
import { MysqlDatabase } from "../../data/mysql/mysql-database";
import {
  AuthDataSource,
  HttpError,
  RegisterUserDTO,
  UserEntity,
} from "../../domain";
import { ChangePasswordDTO } from "../../domain/dtos/auth/change-password.dto";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { RoleEntity } from "../../domain/entities/role.entity";
import { RoleEnum } from "../../domain/enums/role.enum";
import { UserEntityMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthMysqlDatasourceImpl implements AuthDataSource {

  private logger = buildLogger("AuthMysqlDatasourceImpl");

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

      this.logger.error(`${error}`);
      throw HttpError.internalServerError();
    }
  }

  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {

    const { names, fathersLastName, mothersLastName, email, password } = registerUserDTO;

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
          RoleEntity.fromEnum(RoleEnum.GUARDIAN).roleNumber,
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

      this.logger.error(`${error}`);
      throw HttpError.internalServerError();
    }
  }

  async createUserPassword(email: string, password: string): Promise<void> {
    try {
      const pool = await MysqlDatabase.getPoolInstance();
      const [rows]: [any[], any] = await pool.query("SELECT password FROM User WHERE email = ? AND password IS NULL", [email]);

      if (rows.length === 0) {
        throw HttpError.conflict("Password already set");
      }

      await pool.execute("UPDATE User SET password = ? WHERE email = ?", [this.hashFunction(password), email])
    } catch (error) {

      if (error instanceof HttpError) {
        throw error;
      }

      this.logger.error(`${error}`);
      throw HttpError.internalServerError();
    }
  }

  async recoverUserPassword(email: string, password: string): Promise<void> {

    try {

      const pool = await MysqlDatabase.getPoolInstance();
      await pool.execute("UPDATE User SET password = ? WHERE email = ?", [this.hashFunction(password), email])

    } catch (error) {

      if (error instanceof HttpError) {
        throw error;
      }

      this.logger.error(`${error}`);
      throw HttpError.internalServerError();
    }
  }

  async userExists(email: string): Promise<boolean> {
    const pool = await MysqlDatabase.getPoolInstance();
    const [rows]: [any[], any] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

    if (rows.length != 0) {
      return true;
    }
    return false;
  }

  async updatePassword(email: string, currentPassword: string, changePasswordDTO: ChangePasswordDTO): Promise<void> {

    if (!this.compareFunction(changePasswordDTO.currentPassword, currentPassword)) {
      throw HttpError.unauthorized("Current password is incorrect");
    }

    try {
      const pool = await MysqlDatabase.getPoolInstance();
      await pool.execute("UPDATE User SET password = ? WHERE email = ?", [this.hashFunction(changePasswordDTO.newPassword), email]);
    } catch (error) {

      if (error instanceof HttpError) {
        throw error;
      }

      this.logger.error(`${error}`);
      throw HttpError.internalServerError();
    }

  }
}
