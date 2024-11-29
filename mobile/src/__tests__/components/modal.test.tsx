import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { Modal } from "@/components/modal"; 
import { Text } from "react-native-svg";
import { render } from "../test-utils/test-utils";

/*
Renderização do título:
Verifica se o título passado via props é exibido corretamente.

Renderização do subtítulo:
Confirma se o subtítulo é exibido apenas quando fornecido. Também testa o comportamento quando o subtítulo não é passado.

Renderização de conteúdo filho:
Certifica que o conteúdo passado dentro do children é renderizado corretamente dentro do modal.

Funcionalidade do botão de fechar:
Simula o clique no botão de fechar e verifica se a função onClose é chamada.

Botão de fechar condicional:
Garante que o botão de fechar só aparece quando a função onClose é fornecida.



*/

describe("Modal Component", () => {
  it("should render the title correctly", () => {
    const { getByText } = render(<Modal visible={true} title="Test Title" />);

    const title = getByText("Test Title");

    // Verifica se o título foi renderizado
    expect(title).toBeTruthy();
  });

  it("should render the subtitle if provided", () => {
    const { getByText } = render(
      <Modal visible={true} title="Test Title" subtitle="Test Subtitle" />
    );

    const subtitle = getByText("Test Subtitle");

    // Verifica se o subtítulo foi renderizado
    expect(subtitle).toBeTruthy();
  });

  it("should not render the subtitle if not provided", () => {
    const { queryByText } = render(<Modal visible={true} title="Test Title" />);

    const subtitle = queryByText("Test Subtitle");

    // Verifica se o subtítulo não é exibido
    expect(subtitle).toBeNull();
  });

  it("should render children correctly", () => {
    const { getByText } = render(
      <Modal visible={true} title="Test Title">
        <Text>Child Content</Text>
      </Modal>
    );

    const childContent = getByText("Child Content");

    // Verifica se o conteúdo filho foi renderizado
    expect(childContent).toBeTruthy();
  });

  it("should call onClose when the close button is pressed", () => {
    const onCloseMock = jest.fn();

    const { getByRole } = render(
      <Modal visible={true} title="Test Title" onClose={onCloseMock} />
    );

    const closeButton = getByRole("button");

    // Simula o clique no botão de fechar
    fireEvent.press(closeButton);

    // Verifica se a função onClose foi chamada
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should not render the close button if onClose is not provided", () => {
    const { queryByRole } = render(<Modal visible={true} title="Test Title" />);

    const closeButton = queryByRole("button");

    // Verifica se o botão de fechar não é exibido
    expect(closeButton).toBeNull();
  });
});
