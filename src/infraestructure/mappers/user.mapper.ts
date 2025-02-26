import { CustomError, UserEntity } from "../../domain";

export class UserEntityMapper {
    static userEntityFromObject(object: {[key: string]: any}): UserEntity {

        const {userId, id, roleId, names, fathersLastName, mothersLastName, email, password, token } = object;

        if( !userId && !id ){
            throw CustomError.badRequest('Missing id');
        }

        if (!names) throw CustomError.badRequest('Missing names');
        if (!fathersLastName) throw CustomError.badRequest('Missing fathersLastName');
        if (!mothersLastName) throw CustomError.badRequest('Missing mothersLastName');
        if (!email) throw CustomError.badRequest('Missing email');

        return new UserEntity(
        userId || id,
        roleId,
        names,
        fathersLastName,
        mothersLastName,
        email,
        password,
        token
        );
    }
}