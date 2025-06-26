import * as jwt from 'jsonwebtoken';
import { User } from '../../entities/user';
import { handleNullValues } from './handle.null.values';

export function handleGenerateToken(aUser: User) {

    handleNullValues(process.env.JWT_SECRET, "Chave JWT não definida");

    const token = jwt.sign({
        id: aUser.id,
        email: aUser.email
    },
    process.env.JWT_SECRET,
    {
        subject: aUser.email,
        expiresIn: '3h'
    }
);

return token;

}