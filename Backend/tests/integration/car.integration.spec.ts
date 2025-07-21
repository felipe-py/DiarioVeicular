import request from 'supertest';
import { app } from '../../src/main'; // Você precisará exportar seu 'app' Express do main.ts
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { User } from '../../src/entities/user';
import * as bcrypt from 'bcryptjs';

// Usamos um cliente Prisma separado para interagir com o banco de teste
const prismaTestClient = new PrismaClient();

describe('POST /cars - Teste de Integração para Criação de Veículo', () => {
    let userToken: string;
    let userId: string;

    // ANTES de todos os testes deste arquivo, criamos um usuário para os testes.
    beforeAll(async () => {
        // Limpa a tabela de usuários para garantir um estado limpo
        await prismaTestClient.user.deleteMany({});
        
        // Arrange: Criar um usuário de teste
        const hashedPassword = await bcrypt.hash('password123', 10);
        const userEntity = User.create('testuser@example.com', hashedPassword, 'Test User');
        
        const user = await prismaTestClient.user.create({
            data: {
                id: userEntity.id,
                email: userEntity.email,
                password: userEntity.password,
                name: userEntity.name
            }
        });
        userId = user.id;

        // Gerar um token JWT para este usuário
        userToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    });

    // DEPOIS de todos os testes, limpamos o banco e nos desconectamos.
    afterAll(async () => {
        await prismaTestClient.car.deleteMany({});
        await prismaTestClient.user.deleteMany({});
        await prismaTestClient.$disconnect();
    });

    // O teste em si
    it('deve criar um novo veículo com sucesso para um usuário autenticado', async () => {
        // Arrange: Dados do novo carro
        const carData = {
            car_license: 'BRA2E19',
            brand: 'Honda',
            model: 'Civic',
            color: 'Preto',
            manufacture_year: '2023',
            model_year: '2023',
            km: 15000,
        };

        // Act: Fazer a requisição HTTP para a API
        const response = await request(app)
            .post('/cars/register') // A rota da sua API
            .set('Authorization', `Bearer ${userToken}`) // Envia o token de autenticação
            .send(carData); // Envia os dados do carro no corpo

        // Assert (Afirmar): Parte 1 - Checar a resposta da API
        expect(response.status).toBe(201); // O status code deve ser 201 Created
        expect(response.body.message).toBe("Veículo criado com sucesso!");
        expect(response.body.car).toBeDefined();
        expect(response.body.car.car_license).toBe(carData.car_license);

        // Assert (Afirmar): Parte 2 - Checar diretamente no banco de dados de teste
        const carInDb = await prismaTestClient.car.findUnique({
            where: { car_license: carData.car_license },
        });

        expect(carInDb).not.toBeNull(); // O carro não pode ser nulo no banco
        expect(carInDb?.model).toBe(carData.model);
        expect(carInDb?.user_id).toBe(userId); // Verifica se o carro foi associado ao usuário correto
    });

    it('deve retornar 401 Unauthorized se nenhum token for fornecido', async () => {
        // Arrange: Dados do carro, mas sem token
        const carData = {
            car_license: 'FAIL123',
            brand: 'VW',
            model: 'Gol',
            color: 'Branco',
            manufacture_year: '2020',
            model_year: '2020',
            km: 50000,
        };

        // Act
        const response = await request(app)
            .post('/cars/register')
            .send(carData);

        // Assert
        expect(response.status).toBe(401);
    });
});