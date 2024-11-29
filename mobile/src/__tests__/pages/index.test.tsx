import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Index from "@/app/index";
import { tripServer } from "@/server/trip-server";
import { tripStorage } from "@/storage/trip";

/*
Descrição dos Testes:
Exibição da tela de carregamento: Verifica se a tela de carregamento aparece ao buscar dados de viagem no armazenamento local.
Erro ao criar viagem sem informações: Confirma que o alerta é exibido ao tentar avançar sem preencher os dados obrigatórios.
Avançar ao próximo passo: Verifica se os dados corretos permitem passar para a etapa de adição de e-mails.
Adicionar e-mail válido: Garante que e-mails válidos sejam adicionados à lista.
Erro ao adicionar e-mail inválido: Testa se o alerta de erro é exibido para e-mails inválidos.
Criar viagem com sucesso: Simula a criação de uma viagem e verifica se as funções de servidor e armazenamento são chamadas corretamente.
*/

// Mock dos servidores e armazenamento
jest.mock("@/server/trip-server");
jest.mock("@/storage/trip");

describe("Index Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir a tela de carregamento ao buscar viagem existente", async () => {
    tripStorage.get = jest.fn().mockResolvedValue("123");
    tripServer.getById = jest.fn().mockResolvedValue({
      id: "123",
      destination: "Praia",
    });

    const { getByTestId } = render(<Index />);

    expect(getByTestId("loading")).toBeTruthy();
    await waitFor(() => {
      expect(tripServer.getById).toHaveBeenCalledWith("123");
    });
  });

  it("deve exibir mensagem de erro ao criar uma viagem sem destino", async () => {
    const { getByText, getByPlaceholderText } = render(<Index />);

    const continuarButton = getByText("Continuar");
    fireEvent.press(continuarButton);

    await waitFor(() => {
      expect(getByText("Preencha todos as informações da viagem para seguir.")).toBeTruthy();
    });
  });

  it("deve permitir avançar para o próximo passo ao preencher dados corretamente", async () => {
    const { getByText, getByPlaceholderText } = render(<Index />);

    fireEvent.changeText(getByPlaceholderText("Para onde?"), "São Paulo");
    fireEvent.changeText(getByPlaceholderText("Quando?"), "2024-11-01");

    const continuarButton = getByText("Continuar");
    fireEvent.press(continuarButton);

    await waitFor(() => {
      expect(getByText("Quem estará na viagem?")).toBeTruthy();
    });
  });

  it("deve permitir adicionar um e-mail válido", async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<Index />);

    fireEvent.changeText(getByPlaceholderText("Para onde?"), "São Paulo");
    fireEvent.changeText(getByPlaceholderText("Quando?"), "2024-11-01");
    fireEvent.press(getByText("Continuar"));

    const emailInput = getByPlaceholderText("Digite o e-mail do convidado");
    fireEvent.changeText(emailInput, "teste@email.com");

    const convidarButton = getByText("Convidar");
    fireEvent.press(convidarButton);

    await waitFor(() => {
      expect(queryByText("teste@email.com")).toBeTruthy();
    });
  });

  it("deve mostrar erro ao adicionar um e-mail inválido", async () => {
    const { getByText, getByPlaceholderText } = render(<Index />);

    fireEvent.changeText(getByPlaceholderText("Para onde?"), "São Paulo");
    fireEvent.changeText(getByPlaceholderText("Quando?"), "2024-11-01");
    fireEvent.press(getByText("Continuar"));

    const emailInput = getByPlaceholderText("Digite o e-mail do convidado");
    fireEvent.changeText(emailInput, "email_invalido");

    const convidarButton = getByText("Convidar");
    fireEvent.press(convidarButton);

    await waitFor(() => {
      expect(getByText("E-mail inválido!")).toBeTruthy();
    });
  });

  it("deve criar uma viagem com sucesso", async () => {
    tripServer.create = jest.fn().mockResolvedValue({
      tripId: "123",
    });
    tripStorage.save = jest.fn().mockResolvedValue();

    const { getByText, getByPlaceholderText } = render(<Index />);

    fireEvent.changeText(getByPlaceholderText("Para onde?"), "São Paulo");
    fireEvent.changeText(getByPlaceholderText("Quando?"), "2024-11-01");
    fireEvent.press(getByText("Continuar"));

    fireEvent.press(getByText("Confirmar Viagem"));

    await waitFor(() => {
      expect(tripServer.create).toHaveBeenCalledWith({
        destination: "São Paulo",
        starts_at: expect.any(String),
        ends_at: expect.any(String),
        emails_to_invite: [],
      });
    });

    expect(tripStorage.save).toHaveBeenCalledWith("123");
  });
});
