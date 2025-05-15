
export class CreateTicketDTO {
    private constructor(
        public title: string,
        public description: string,
        public severityId: number,
    ) {
    }

    static create(object: { [key: string]: any; }): [string?, CreateTicketDTO?] {
        const { title, description, severityId } = object

        if (!title) return ["Es requerido el título del ticket"];
        if (!description) return ["Es requerido el contenido del ticket"];
        if (!severityId) return ["Es requerido la severidad del ticket"];
        if (isNaN(severityId)) return ["Valor invalido para la severidad del ticket"];

        return [
            undefined,
            new CreateTicketDTO(
                title,
                description,
                severityId,
            ),
        ];
    }
}