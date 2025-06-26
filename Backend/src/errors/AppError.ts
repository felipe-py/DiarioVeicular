// Esta é a nossa classe de erro base.
// 'extends Error' faz com que ela se comporte como um erro padrão do JavaScript.
export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        // 'super(message)' chama o construtor da classe 'Error' pai
        super(message);
        // Definimos nosso próprio statusCode
        this.statusCode = statusCode;
    }
}