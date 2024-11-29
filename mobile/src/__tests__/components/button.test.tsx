import React from "react";
import { render } from "../test-utils/test-utils";
import { Button } from "@/components/button";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

/*

Renderização padrão: Verifica se o botão usa o estilo primary por padrão.
Alteração de estilo com variant: Testa se o estilo muda corretamente ao passar variant="secondary".
Exibição de ActivityIndicator: Garante que o indicador de carregamento substitui o conteúdo do botão quando isLoading é true.
Texto no Button.Title: Verifica se o subtítulo (Button.Title) respeita o contexto e estiliza conforme o variant.

*/

describe("Button Component", () => {
  it("should render with primary variant by default", () => {
    const { getByTestId } = render(
      <Button testID="button">Primary Button</Button>
    );
    const button = getByTestId("button");

    expect(button.props.className).toContain("bg-lime-300");
  });

  it("should render with secondary variant when specified", () => {
    const { getByTestId } = render(
      <Button testID="button" variant="secondary">
        Secondary Button
      </Button>
    );
    const button = getByTestId("button");

    expect(button.props.className).toContain("bg-zinc-800");
  });

  it("should render children text inside the button", () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText("Click Me")).toBeTruthy();
  });

  it("should render ActivityIndicator when isLoading is true", () => {
    const { getByTestId, queryByText } = render(
      <Button isLoading testID="button">
        Loading Button
      </Button>
    );

    expect(getByTestId("activity-indicator")).toBeTruthy();
    expect(queryByText("Loading Button")).toBeNull();
  });

  it("should disable the button when isLoading is true", () => {
    const { getByTestId } = render(
      <Button isLoading testID="button">
        Loading Button
      </Button>
    );
    const button = getByTestId("button");

    expect(button.props.disabled).toBe(true);
  });

  it("should allow passing custom className", () => {
    const { getByTestId } = render(
      <Button testID="button" className="custom-class">
        Custom Button
      </Button>
    );
    const button = getByTestId("button");

    expect(button.props.className).toContain("custom-class");
  });
});

describe("Button.Title Component", () => {
  it("should render with primary variant by default", () => {
    const { getByText } = render(
      <Button>
        <Button.Title>Primary Title</Button.Title>
      </Button>
    );
    const title = getByText("Primary Title");

    expect(title.props.className).toContain("text-lime-950");
  });

  it("should render with secondary variant when specified", () => {
    const { getByText } = render(
      <Button variant="secondary">
        <Button.Title>Secondary Title</Button.Title>
      </Button>
    );
    const title = getByText("Secondary Title");

    expect(title.props.className).toContain("text-zinc-200");
  });
});