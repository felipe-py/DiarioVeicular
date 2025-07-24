import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormData,
  registerFormSchema,
} from "../validators/user.validator";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as S from "./Register.styles";

export function RegisterPage() {
  const [apiMessage, setApiMessage] = useState<string>("");
  const [apiError, setApiError] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  async function handleRegister(data: RegisterFormData) {
    setApiMessage("");
    setApiError(false);

    try {
      const response = await axios.post(
        "http://localhost:8000/users/register",
        data
      );
      setApiMessage(response.data.message);
    } catch (error) {
      setApiError(true);
      // Tratamento de erro mais seguro, sem 'any'
      if (axios.isAxiosError(error) && error.response) {
        setApiMessage(
          error.response.data.message || "Ocorreu um erro ao registrar."
        );
      } else {
        setApiMessage("Não foi possível conectar ao servidor.");
      }
    }
  }

  // AQUI ESTÁ A PARTE CRÍTICA: A FUNÇÃO PRECISA DESTE 'RETURN'
  return (
    <S.PageContainer>
      <S.FormContainer>
        <h1>Crie sua Conta</h1>
        <S.Form onSubmit={handleSubmit(handleRegister)}>
          <S.FormGroup>
            <S.Label htmlFor="name">Nome</S.Label>
            <S.Input id="name" type="text" {...register("name")} />
            {errors.name && (
              <S.ErrorMessage>{errors.name.message}</S.ErrorMessage>
            )}
          </S.FormGroup>

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

          <S.Button type="submit">Registrar</S.Button>
        </S.Form>

        {apiMessage && (
          <S.ApiMessage isError={apiError}>{apiMessage}</S.ApiMessage>
        )}

        <S.NavigationLink>
          Já tem uma conta? <Link to="/users/login">Faça login</Link>
        </S.NavigationLink>
      </S.FormContainer>
    </S.PageContainer>
  );
}
