import { User } from '../../src/entities/user';
import { UserRepository } from '../../src/repositories/user/user.repository';
import { UserServiceImplementation } from '../../src/services/user/implementation/user.service.implementation';
import { ConflictError } from '../../src/errors/user/user.error.conflict';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthenticationError } from '../../src/errors/user/user.error.Authentication';

// 1. PRIMEIRO MOCK DO REPOSITÓRIO
// CRIA UMA VERSÃO FALSA DO USER REPOSITORY, jest.fn() cria funções simuladas
const mockUserRepository: jest.Mocked<UserRepository> = {
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
};


jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
// 2. CRIA INSTÂNCIA DO SERVICE COM O MOCK
// AO INVÉS DE PASSAR O userRepositoryPrisma, PASSA O MOCK CRIADO ACIMA
// DESSA FORMA O BANCO REAL NÃO É ACESSADO
const userService = UserServiceImplementation.build(mockUserRepository);


// 3. AGRUPAMENTO DOS TESTES
describe("UserSerice - Create", () => {

    // LIMPA MOCK ANTES DE CADA TESTE
    beforeEach(() => {
        jest.resetAllMocks();
    });


    it("REGISTRO: Deve registrar um usuário com sucesso", async () => {
        // Arrange
        const userData = {
            email: "teste@email.com",
            password: "123456",
            name: "testador",
        };
        
        mockUserRepository.save.mockResolvedValue(undefined);

        // Act
        const result = await userService.createService(userData.email, userData.password, userData.name);

        // Assert
        expect(result.message).toBe("Cadastro realizado com sucesso");
        expect(result.email).toBe(userData.email);
        expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
    });


    it("REGISTRO: Deve lançar um ConflictError se o repositório falhar ao salvar por e-mail duplicado", async () => {
        // Arrange
        const userData = {
            email: "user@email.com",
            password: "654321",
            name: "testes",
        };
        
        const conflictError = new ConflictError("Este e-mail já está em uso.");
        mockUserRepository.save.mockRejectedValue(conflictError);

        // Act & Assert
        await expect(
            userService.createService(userData.email, userData.password, userData.name)
        ).rejects.toThrow(ConflictError);
        
        expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });
});

describe("UserService - Login", () => {
    
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("LOGIN: Deve registrar sucesso no login", async () => {

        const inputPassword = '123456';
        const hashPassword = 'qwexcv';
        const fakeUser = User.with(
            "id123",
            "teste@email.com",
            hashPassword,
            "testMan"
        );

        // 1. SIMULA USUÁRIO NO BANCO
        mockUserRepository.find.mockResolvedValue(fakeUser);

        // 2. SIMULA COMPARAÇÃO DE SENHA
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        // 3. SIMULA GERAÇÃO DO TOKEN
        (jwt.sign as jest.Mock).mockReturnValue('fake-token');

        const result = await userService.loginService(fakeUser.email, inputPassword);

        expect(result.message).toBe("Login realizado com sucesso");
        expect(result.token).toBe('fake-token');
        expect(result.user.id).toBe(fakeUser.id);
        expect(mockUserRepository.find).toHaveBeenCalledWith(fakeUser.email);
        expect(bcrypt.compare).toHaveBeenCalledWith(inputPassword, hashPassword);
    });


    // TESTE 2: FALHA POR SENHA INCORRETA
    it("LOGIN: Deve lançar um AuthenticationError se a senha estiver incorreta", async () => {
        // Arrange
        const inputPassword = "wrong_password";
        const hashedPasswordInDb = "hashed_password_abc";
        const fakeUserFromDb = User.with("user-id-123", "user@example.com", hashedPasswordInDb, "Test User");

        // O usuário é encontrado no banco
        mockUserRepository.find.mockResolvedValue(fakeUserFromDb);
        // MAS a comparação de senha retorna 'false'
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        // Act & Assert
        await expect(
            userService.loginService(fakeUserFromDb.email, inputPassword)
        ).rejects.toThrow(AuthenticationError); // Esperamos o erro de autenticação

        // Garantimos que a geração de token NUNCA foi chamada
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    
    // TESTE 3: FALHA POR E-MAIL NÃO ENCONTRADO
    it("LOGIN: Deve lançar um AuthenticationError se o e-mail não for encontrado", async () => {
        // Arrange
        const inputEmail = "nonexistent@example.com";

        // SIMULAMOS QUE O USUÁRIO NÃO EXISTE NO BANCO
        // O mock do 'find' retorna null.
        mockUserRepository.find.mockResolvedValue(null);

        // Act & Assert
        await expect(
            userService.loginService(inputEmail, "any_password")
        ).rejects.toThrow(AuthenticationError);

        // Garantimos que a comparação de senha NUNCA foi chamada
        expect(bcrypt.compare).not.toHaveBeenCalled();
        // E que a geração de token NUNCA foi chamada
        expect(jwt.sign).not.toHaveBeenCalled();
    });
});