import { RoleEnum } from "../enums/role.enum";

export class UserEntity {
  constructor(
    public userId: number,
    public roleId: RoleEnum,
    public names: string,
    public fathersLastName: string,
    public mothersLastName: string,
    public email: string,
    public password: string,
    public token: string
  ) { }
}
