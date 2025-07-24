import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginFormSchema } from "../validators/user.validator";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./Login.styles"; // Importa os componentes estilizados

export function LoginPage() {
  const [apiMessage, setApiMessage] = useState<string>("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  async function handleLogin(data: LoginFormData) {
    setApiMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/users/login",
        data
      );

      const { token } = response.data;

      if (token) {
        localStorage.setItem("authToken", token);
      }

      // Redireciona para o dashboard em caso de sucesso
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setApiMessage(
          error.response.data.message || "Ocorreu um erro ao fazer login."
        );
      } else {
        setApiMessage("Não foi possível conectar ao servidor.");
      }
    }
  }

  return (
    <S.PageContainer>
      <S.FormContainer>
        <h1>Acesse sua Conta</h1>
        <S.Form onSubmit={handleSubmit(handleLogin)}>
          <S.FormGroup>
            <S.Label htmlFor="email">E-mail</S.Label>
            <S.Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
            )}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label htmlFor="password">Senha</S.Label>
            <S.Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
            )}
          </S.FormGroup>

          <S.Button type="submit">Entrar</S.Button>
        </S.Form>

        {apiMessage && <S.ApiMessage isError={true}>{apiMessage}</S.ApiMessage>}

        <S.NavigationLink>
          Não tem uma conta? <Link to="/register">Crie uma agora</Link>
        </S.NavigationLink>
      </S.FormContainer>
    </S.PageContainer>
  );
}
