import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { GuestEmail } from "@/components/email"; 
import { colors } from "@/styles/colors";
import { render } from "../test-utils/test-utils";

/*
Renderização do E-mail:
Verifica se o e-mail recebido pela prop email é renderizado corretamente no componente.

Ação do Botão de Remoção:
Confirma que a função onRemove é chamada corretamente quando o botão de remoção é pressionado.

Ícone de Remoção:
Certifica-se de que o ícone de remoção (<X />) é renderizado com as cores e tamanhos apropriados.


*/

describe("GuestEmail Component", () => {
  it("should render the email correctly", () => {
    const email = "test@example.com";
    const onRemoveMock = jest.fn();

    const { getByText } = render(
      <GuestEmail email={email} onRemove={onRemoveMock} />
    );

    // Verifica se o e-mail está renderizado
    const emailText = getByText(email);
    expect(emailText).toBeTruthy();
    expect(emailText.props.children).toBe(email);
  });

  it("should trigger onRemove when the remove button is pressed", () => {
    const email = "test@example.com";
    const onRemoveMock = jest.fn();

    const { getByRole } = render(
      <GuestEmail email={email} onRemove={onRemoveMock} />
    );

    // Busca o botão pelo papel de "button"
    const removeButton = getByRole("button");

    // Simula o clique no botão
    fireEvent.press(removeButton);

    // Verifica se a função onRemove foi chamada
    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });

  it("should render the remove button with the correct icon", () => {
    const email = "test@example.com";
    const onRemoveMock = jest.fn();

    const { getByTestId } = render(
      <GuestEmail email={email} onRemove={onRemoveMock} />
    );

    // Verifica se o ícone de remoção está presente
    const removeIcon = getByTestId("remove-icon");
    expect(removeIcon.props.color).toBe(colors.zinc[400]);
    expect(removeIcon.props.size).toBe(16);
  });
});
