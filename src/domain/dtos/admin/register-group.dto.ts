
export class RegisterGroupDTO {
    private constructor(
        public year: number,
        public name: string
    ) {
    }

    static create(object: { [key: string]: any; }): [string?, RegisterGroupDTO?] {
        const { year, name } = object

        if (!year) return ["Missing year"];
        if (!name) return ["Missing name"]
        if (year < 1 || year > 6) return ["Year must be between 1 and 6"];

        return [
            undefined,
            new RegisterGroupDTO(
                year,
                name
            ),
        ];
    }
}