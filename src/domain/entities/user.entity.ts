export class UserEntity {
  constructor(
    public userId: number,
    public roleId: number,
    public names: string,
    public mothersLastName: string,
    public fathersLastName: string,
    public email: string,
    public token: string
  ) {}
}
