import express from 'express';

interface Options {
    port?: number;
}

export class Server {

    public readonly app = express()
    private readonly port: number;

    constructor(option: Options) {
        const { port = 3100 } = option;

        this.port = port;
    }

    async start() {
        this.app.listen(this.port, () => {
            console.log(`Server started on port ${this.port}`);
        });
    }

}