import React from "react";
import { render } from "../test-utils/test-utils";
import { Input } from "@/components/input";

/*
Renderização do Input com variantes:
Cada variante (primary, secondary, tertiary) é testada para garantir que a classe correspondente seja aplicada corretamente.

Renderização do Input.Field:
Verifica se o subcomponente Field renderiza corretamente com as props passadas, como placeholder.

Passagem de props para Input.Field:
Garante que as props, como value, sejam aplicadas corretamente ao subcomponente Field.

*/

describe("Input Component", () => {
  it("should render with primary variant by default", () => {
    const { getByTestId } = render(
      <Input testID="input-primary">
        <Input.Field placeholder="Type here" />
      </Input>
    );

    const input = getByTestId("input-primary");

    // Verifica se a classe padrão do variant 'primary' está aplicada
    expect(input.props.className).toContain("min-h-16 max-h-16 flex-row");
  });

  it("should render with secondary variant", () => {
    const { getByTestId } = render(
      <Input variant="secondary" testID="input-secondary">
        <Input.Field placeholder="Type here" />
      </Input>
    );

    const input = getByTestId("input-secondary");

    // Verifica se a classe de 'secondary' está aplicada
    expect(input.props.className).toContain("bg-zinc-950");
  });

  it("should render with tertiary variant", () => {
    const { getByTestId } = render(
      <Input variant="tertiary" testID="input-tertiary">
        <Input.Field placeholder="Type here" />
      </Input>
    );

    const input = getByTestId("input-tertiary");

    // Verifica se a classe de 'tertiary' está aplicada
    expect(input.props.className).toContain("bg-zinc-900");
  });

  it("should render Input.Field correctly", () => {
    const placeholderText = "Type your name";

    const { getByPlaceholderText } = render(
      <Input>
        <Input.Field placeholder={placeholderText} />
      </Input>
    );

    const field = getByPlaceholderText(placeholderText);

    // Verifica se o placeholder do campo está correto
    expect(field).toBeTruthy();
  });

  it("should pass props correctly to Input.Field", () => {
    const placeholderText = "Type your email";
    const testValue = "example@example.com";

    const { getByPlaceholderText } = render(
      <Input>
        <Input.Field placeholder={placeholderText} value={testValue} />
      </Input>
    );

    const field = getByPlaceholderText(placeholderText);

    // Verifica se a prop value está correta
    expect(field.props.value).toBe(testValue);
  });
});
