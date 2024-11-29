import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { TripLink } from "@/components/tripLink";
import { Linking } from "react-native";
import { render } from "../test-utils/test-utils";

/*
Renderização do título:
Verifica se o título fornecido nos dados é exibido corretamente no componente.

Renderização do URL:
Garante que o URL seja exibido corretamente e truncado, se necessário (usando a propriedade numberOfLines).

Abrir URL no clique:
Usa um mock de Linking.openURL para simular e verificar se o método é chamado com o URL correto quando o botão é pressionado.
*/

jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(),
}));

describe("TripLink Component", () => {
  const tripLinkData = {
    id: "1",
    title: "My Trip Link",
    url: "https://example.com",
  };

  it("should render the title correctly", () => {
    const { getByText } = render(<TripLink data={tripLinkData} />);

    const title = getByText("My Trip Link");

    // Verifica se o título foi renderizado corretamente
    expect(title).toBeTruthy();
  });

  it("should render the URL correctly", () => {
    const { getByText } = render(<TripLink data={tripLinkData} />);

    const url = getByText("https://example.com");

    // Verifica se o URL foi renderizado corretamente
    expect(url).toBeTruthy();
  });

  it("should call Linking.openURL with the correct URL when the button is pressed", () => {
    const { getByRole } = render(<TripLink data={tripLinkData} />);

    const button = getByRole("button");

    // Simula o clique no botão
    fireEvent.press(button);

    // Verifica se Linking.openURL foi chamado com o URL correto
    expect(Linking.openURL).toHaveBeenCalledWith("https://example.com");
  });
});
