import {
  AuthDataSource,
  CustomError,
  RegisterUserDTO,
  UserEntity,
} from "../../domain";

export class AuthDatasourceImpl implements AuthDataSource {
  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    const { name, email, password } = registerUserDTO;

    try {
      // TODO: Implement logic to save user in database

      // Verify if user already exists
      // Password hash
      // Map answer to UserEntity

      return new UserEntity(1, name, email, password);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServerError();
    }
  }
}
