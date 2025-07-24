import request from "supertest";
import { app } from "../../src/main"; // Você precisará exportar seu 'app' Express do main.ts
import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { User } from "../../src/entities/user";
import * as bcrypt from "bcryptjs";

// Usamos um cliente Prisma separado para interagir com o banco de teste
const prismaTestClient = new PrismaClient();

describe("POST /cars - Teste de Integração para Criação de Veículo", () => {
  let userToken: string;
  let userId: string;

  // ANTES de todos os testes deste arquivo, criamos um usuário para os testes.
  beforeAll(async () => {
    // Limpa a tabela de usuários para garantir um estado limpo
    await prismaTestClient.user.deleteMany({});

    // Arrange: Criar um usuário de teste
    const hashedPassword = await bcrypt.hash("password123", 10);
    const userEntity = User.create(
      "testuser@example.com",
      hashedPassword,
      "Test User"
    );

    const user = await prismaTestClient.user.create({
      data: {
        id: userEntity.id,
        email: userEntity.email,
        password: userEntity.password,
        name: userEntity.name,
      },
    });
    userId = user.id;

    // Gerar um token JWT para este usuário
    userToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
  });

  // DEPOIS de todos os testes, limpamos o banco e nos desconectamos.
  afterAll(async () => {
    await prismaTestClient.car.deleteMany({});
    await prismaTestClient.user.deleteMany({});
    await prismaTestClient.$disconnect();
  });

  // TESTES DE REGISTRO DE VEÍCULO
  it("deve criar um novo veículo com sucesso para um usuário autenticado", async () => {
    // Arrange: Dados do novo carro
    const carData = {
      car_license: "BRA2E19",
      brand: "Honda",
      model: "Civic",
      color: "Preto",
      manufacture_year: "2023",
      model_year: "2023",
      km: 15000,
    };

    // Act: Fazer a requisição HTTP para a API
    const response = await request(app)
      .post("/cars/register") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`) // Envia o token de autenticação
      .send(carData); // Envia os dados do carro no corpo

    // Assert (Afirmar): Parte 1 - Checar a resposta da API
    expect(response.status).toBe(201); // O status code deve ser 201 Created
    expect(response.body.message).toBe("Veículo cadastrado com sucesso");
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

  it("deve retornar 401 Unauthorized se nenhum token for fornecido", async () => {
    // Arrange: Dados do carro, mas sem token
    const carData = {
      car_license: "FAI1123",
      brand: "VW",
      model: "Gol",
      color: "Branco",
      manufacture_year: "2020",
      model_year: "2020",
      km: 50000,
    };

    // Act
    const response = await request(app).post("/cars/register").send(carData);

    // Assert
    expect(response.status).toBe(401);
  });

  // TESTES DE ATUALIZAÇÃO DE VEÍCULO
  it("deve retornar 200 para informação do veículo atualizada com sucesso", async () => {
    const carData = {
      car_license: "JSI0G39",
      brand: "Toyota",
      model: "Corolla xli 1.8 AT",
      color: "Prata",
      manufacture_year: "2009",
      model_year: "2010",
      km: 144995,
    };

    await request(app)
      .post("/cars/register") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`) // Envia o token de autenticação
      .send(carData); // Envia os dados do carro no corpo

    const updateData = {
      km: 145102,
    };

    const response = await request(app)
      .patch("/cars/update/JSI0G39")
      .set("Authorization", `Bearer ${userToken}`)
      .send(updateData);

    const carInDb = await prismaTestClient.car.findUnique({
      where: { car_license: carData.car_license },
    });

    expect(carInDb).not.toBeNull();

    expect(response.status).toBe(200);
    expect(carInDb!.km).toBe(145102);
  });

  it("deve retornar 400 para erro em atualizar quilometragem do carro", async () => {
    const carData = {
      car_license: "JSI0G39",
      brand: "Toyota",
      model: "Corolla xli 1.8 AT",
      color: "Prata",
      manufacture_year: "2009",
      model_year: "2010",
      km: 144995,
    };

    await request(app)
      .post("/cars/register") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`) // Envia o token de autenticação
      .send(carData); // Envia os dados do carro no corpo

    const updateData = {
      km: 141257,
    };

    const response = await request(app)
      .patch("/cars/update/JSI0G39")
      .set("Authorization", `Bearer ${userToken}`)
      .send(updateData);

    const carInDb = await prismaTestClient.car.findUnique({
      where: { car_license: carData.car_license },
    });

    expect(carInDb).not.toBeNull();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("A quilometragem não pode ser reduzida");
    expect(carInDb!.km).toBe(145102);
  });

  // TESTES DE BUSCA DE UM VEÍCULO UTILIZANDO PLACA
  it("deve retornar 200 juntamente com o automóvel pesquisado", async () => {
    const carData = {
      car_license: "JRN7771",
      brand: "vw",
      model: "Polo 1.6",
      color: "verde",
      manufacture_year: "2008",
      model_year: "2009",
      km: 185247,
    };

    await request(app)
      .post("/cars/register") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`) // Envia o token de autenticação
      .send(carData); // Envia os dados do carro no corpo

    const response = await request(app)
      .get("/cars/findCar") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`) // Envia o token de autenticação
      .send({ car_license: "JRN7771" });

    const carInDb = await prismaTestClient.car.findUnique({
      where: { car_license: carData.car_license },
    });

    expect(carInDb).not.toBeNull();

    expect(response.status).toBe(200);
    expect(carInDb!.car_license).toBe("JRN7771");
  });

  // TESTE DE BUSCA DE TODOS OS VEÍCULOS DE UM PROPRIETÁRIO
  it("deve retornar 200 juntamente com todos os automóveis do usuário", async () => {
    const carData = {
      car_license: "JRN7771",
      brand: "vw",
      model: "Polo 1.6",
      color: "verde",
      manufacture_year: "2008",
      model_year: "2009",
      km: 185247,
    };

    await request(app)
      .post("/cars/register") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`) // Envia o token de autenticação
      .send(carData); // Envia os dados do carro no corpo

    const response = await request(app)
      .get("/dashboard") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`); // Envia o token de autenticação

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.cars)).toBe(true);
  });

  // TESTE PARA DELETAR VEÍCULO REGISTRADO
  it("deve retornar 201 atestanto que o carro foi apagado", async () => {
    const carData = {
      car_license: "JRN7771",
      brand: "vw",
      model: "Polo 1.6",
      color: "verde",
      manufacture_year: "2008",
      model_year: "2009",
      km: 185247,
    };

    await request(app)
      .post("/cars/register") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`) // Envia o token de autenticação
      .send(carData); // Envia os dados do carro no corpo

    const response = await request(app)
      .delete("/cars/delete") // A rota da sua API
      .set("Authorization", `Bearer ${userToken}`) // Envia o token de autenticação
      .send({ car_license: "JRN7771" });

    expect(response.status).toBe(201);
  });
});
