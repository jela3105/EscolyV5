import { Validators } from "../../../config";

export class RegisterUserDTO {
  private constructor(
    public names: string,
    public fathersLastName: string,
    public mothersLastName: string,
    public email: string,
    public role: number,
    public password: string
  ) { }

  static create(object: { [key: string]: any }): [string?, RegisterUserDTO?] {
    const {
      names,
      fathersLastName,
      mothersLastName,
      email,
      role = 1,
      password,
    } = object;

    if (!names) return ["Missing names"];
    if (!fathersLastName) return ["Missing fathers last name"];
    if (!mothersLastName) return ["Missing mothers last name"];
    if (!email) return ["Missing email"];
    if (!Validators.email.test(email)) return ["Invalid email"];
    if (!password) return ["Missing password"];
    if (password.lenght < 6) return ["Password too short"];

    return [
      undefined,
      new RegisterUserDTO(
        names,
        fathersLastName,
        mothersLastName,
        email.toLowerCase(),
        role,
        password
      ),
    ];
  }
}
