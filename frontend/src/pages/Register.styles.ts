import styled from "styled-components";

// Um container principal para centralizar o formulário na tela
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

// O container do formulário em si, com uma borda e preenchimento
export const FormContainer = styled.div`
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

// O elemento <form>
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem; // Espaçamento entre os elementos
`;

// Um grupo para o label e o input
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// O label dos campos
export const Label = styled.label`
  font-weight: bold;
  color: #333;
`;

// O campo de input estilizado
export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

// O botão de submit estilizado
export const Button = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

// Componente para exibir mensagens de erro de validação
export const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
`;

// Componente para exibir mensagens da API
export const ApiMessage = styled.p<{ isError: boolean }>`
  color: ${(props) => (props.isError ? "#dc3545" : "#28a745")};
  text-align: center;
  font-weight: bold;
`;

// Um link simples para a outra página
export const NavigationLink = styled.p`
  margin-top: 1rem;
  text-align: center;
  color: #555;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
`;
