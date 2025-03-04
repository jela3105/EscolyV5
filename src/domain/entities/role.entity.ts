import { RoleEnum } from "../enums/role.enum";

export class RoleEntity {

    constructor(
        public roleId: RoleEnum,
        public roleNumber: number
    ) { }

    static fromEnum(role: RoleEnum): RoleEntity {
        switch (role) {
            case RoleEnum.GUARDIAN:
                return new RoleEntity(RoleEnum.GUARDIAN, 1);
            case RoleEnum.TEACHER:
                return new RoleEntity(RoleEnum.TEACHER, 2);
            case RoleEnum.ADMIN:
                return new RoleEntity(RoleEnum.ADMIN, 3);
        }
    }
}