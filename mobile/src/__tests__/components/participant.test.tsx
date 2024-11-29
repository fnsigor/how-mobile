import React from "react";
import { Participant } from "@/components/participant";
import { render } from "../test-utils/test-utils";

/*
Nome do participante:
Verifica se o nome do participante é exibido corretamente. Se o nome não for fornecido, verifica se o texto padrão "Pendente" é exibido.

E-mail do participante:
Certifica que o e-mail é renderizado corretamente.

Ícones de confirmação:
Testa se o ícone correspondente (CircleCheck ou CircleDashed) é exibido de acordo com o valor de is_confirmed.
*/

describe("Participant Component", () => {
  const participantData = {
    id: "1",
    name: "John Doe",
    email: "johndoe@example.com",
    is_confirmed: true,
  };

  it("should render the participant's name correctly", () => {
    const { getByText } = render(<Participant data={participantData} />);

    const name = getByText("John Doe");

    // Verifica se o nome foi renderizado corretamente
    expect(name).toBeTruthy();
  });

  it("should display 'Pendente' if no name is provided", () => {
    const { getByText } = render(
      <Participant data={{ ...participantData, name: undefined }} />
    );

    const pendingText = getByText("Pendente");

    // Verifica se "Pendente" foi renderizado
    expect(pendingText).toBeTruthy();
  });

  it("should render the participant's email correctly", () => {
    const { getByText } = render(<Participant data={participantData} />);

    const email = getByText("johndoe@example.com");

    // Verifica se o e-mail foi renderizado corretamente
    expect(email).toBeTruthy();
  });

  it("should render the confirmed icon if the participant is confirmed", () => {
    const { getByTestId } = render(
      <Participant data={{ ...participantData, is_confirmed: true }} />
    );

    const confirmedIcon = getByTestId("confirmed-icon");

    // Verifica se o ícone de confirmação foi renderizado
    expect(confirmedIcon).toBeTruthy();
  });

  it("should render the pending icon if the participant is not confirmed", () => {
    const { getByTestId } = render(
      <Participant data={{ ...participantData, is_confirmed: false }} />
    );

    const pendingIcon = getByTestId("pending-icon");

    // Verifica se o ícone de pendência foi renderizado
    expect(pendingIcon).toBeTruthy();
  });
});
