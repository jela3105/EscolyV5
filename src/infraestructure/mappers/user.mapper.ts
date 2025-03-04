import { HttpError, UserEntity } from "../../domain";
import { RoleEnum } from "../../domain/enums/role.enum";

export class UserEntityMapper {
    static userEntityFromObject(object: { [key: string]: any }): UserEntity {

        const { userId, id, roleId, names, fathersLastName, mothersLastName, email, password, token } = object;

        if (!userId && !id) {
            throw HttpError.badRequest('Missing id');
        }

        if (!names) throw HttpError.badRequest('Missing names');
        if (!fathersLastName) throw HttpError.badRequest('Missing fathersLastName');
        if (!mothersLastName) throw HttpError.badRequest('Missing mothersLastName');
        if (!email) throw HttpError.badRequest('Missing email');

        const role = roleId in RoleEnum ? (roleId as RoleEnum) : RoleEnum.GUARDIAN;

        return new UserEntity(
            userId || id,
            role,
            names,
            fathersLastName,
            mothersLastName,
            email,
            password,
            token
        );
    }
}