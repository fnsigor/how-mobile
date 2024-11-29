import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { Activities } from "@/app/trip/activities"
import { activitiesServer } from "@/server/activities-server"
import dayjs from "dayjs"

/* 
Explicação dos testes:
Renderização da página de atividades:

Verifica se o título "Atividades" é exibido corretamente.
Verifica se as atividades estão sendo carregadas e exibidas corretamente na lista.
Abertura do modal de nova atividade:

Verifica se, ao clicar no botão de adicionar nova atividade, o modal correspondente aparece.
Criação de nova atividade:

Simula o preenchimento do formulário para criar uma nova atividade e confirma se a função de criação foi chamada corretamente.
Após submeter, verifica se o alerta de sucesso é exibido.
Exibição de alerta quando o formulário está incompleto:

Testa o comportamento do alerta caso o usuário tente submeter o formulário sem preencher todos os campos obrigatórios.
Estado de loading:

Verifica se o componente exibe um indicador de loading enquanto as atividades estão sendo carregadas.
*/

// Mocking the server functions
jest.mock("@/server/activities-server", () => ({
  activitiesServer: {
    create: jest.fn(),
    getActivitiesByTripId: jest.fn(),
  },
}))

describe("Activities", () => {
  const mockTripDetails = {
    id: "123",
    starts_at: new Date(),
    ends_at: new Date(),
  }

  it("should render the activities page", async () => {
    activitiesServer.getActivitiesByTripId.mockResolvedValue([
      {
        date: "2024-11-28",
        activities: [
          {
            id: "1",
            title: "Passeio na praia",
            occurs_at: dayjs().add(1, "hour").toString(),
          },
        ],
      },
    ])

    const { getByText, getByPlaceholderText, getByTestId } = render(
      <Activities tripDetails={mockTripDetails} />
    )

    // Verifica se o título 'Atividades' é renderizado
    expect(getByText("Atividades")).toBeTruthy()

    // Verifica se a lista de atividades está visível
    await waitFor(() => {
      expect(getByText("Dia 28")).toBeTruthy()
      expect(getByText("Passeio na praia")).toBeTruthy()
    })

    // Verifica se o botão de nova atividade está visível
    fireEvent.press(getByTestId("add-activity-button"))
    expect(getByText("Cadastrar atividade")).toBeTruthy()
  })

  it("should open the modal to create a new activity", async () => {
    activitiesServer.getActivitiesByTripId.mockResolvedValue([])

    const { getByTestId, getByPlaceholderText } = render(
      <Activities tripDetails={mockTripDetails} />
    )

    // Abrir o modal de nova atividade
    fireEvent.press(getByTestId("add-activity-button"))
    expect(getByPlaceholderText("Qual atividade?")).toBeTruthy()
  })

  it("should create a new activity", async () => {
    activitiesServer.create.mockResolvedValue({})
    activitiesServer.getActivitiesByTripId.mockResolvedValue([])

    const { getByTestId, getByPlaceholderText, getByText } = render(
      <Activities tripDetails={mockTripDetails} />
    )

    fireEvent.press(getByTestId("add-activity-button"))

    // Preencher os campos
    fireEvent.changeText(getByPlaceholderText("Qual atividade?"), "Passeio de barco")
    fireEvent.changeText(getByPlaceholderText("Data"), "28 de Novembro")
    fireEvent.changeText(getByPlaceholderText("Horário?"), "10")

    // Submeter a atividade
    fireEvent.press(getByText("Salvar atividade"))

    // Verifica se a criação da atividade foi chamada
    await waitFor(() => {
      expect(activitiesServer.create).toHaveBeenCalledWith({
        tripId: mockTripDetails.id,
        occurs_at: expect.any(String),
        title: "Passeio de barco",
      })
    })

    // Verifica se o alert foi disparado
    expect(getByText("Nova Atividade")).toBeTruthy()
  })

  it("should show an alert when the form is incomplete", async () => {
    const { getByTestId, getByText } = render(
      <Activities tripDetails={mockTripDetails} />
    )

    fireEvent.press(getByTestId("add-activity-button"))

    // Submeter sem preencher os campos
    fireEvent.press(getByText("Salvar atividade"))

    // Verifica se o alerta foi exibido
    await waitFor(() => {
      expect(getByText("Preencha todos os campos!")).toBeTruthy()
    })
  })

  it("should display loading state while activities are being fetched", async () => {
    activitiesServer.getActivitiesByTripId.mockResolvedValueOnce([])
    const { getByTestId } = render(<Activities tripDetails={mockTripDetails} />)

    expect(getByTestId("loading-spinner")).toBeTruthy()
  })
})
