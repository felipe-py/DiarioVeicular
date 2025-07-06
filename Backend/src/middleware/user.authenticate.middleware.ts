import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthenticationError } from '../errors/user/user.error.Authentication';

interface TokenPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
    sub: string;
}

export function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { authorization } = request.headers;

    if (!authorization) {
        throw new AuthenticationError('Token de autenticação não fornecido.');
    }

    const [, token] = authorization.split(' ');

    if (!token) {
        throw new AuthenticationError('Token malformatado.');
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Chave secreta do JWT não definida no .env');
        }

        const decoded = jwt.verify(token, secret);
        const { id, email } = decoded as TokenPayload;

        request.user = { id, email };

        return next();
    } catch (error) {
        throw new AuthenticationError('Token inválido ou expirado.');
    }
}