import React from "react";
import { render } from "../test-utils/test-utils";
import { Activity, ActivityProps } from "@/components/activity";

/*
Renderização de textos: Testamos se os textos title e hour aparecem conforme as props passadas.
Testes condicionais dos ícones: Checamos se o ícone correto é exibido dependendo do valor de isBefore.
Estilização condicional: Garantimos que a opacidade é aplicada corretamente ao componente quando isBefore é true.
*/

describe("Activity Component", () => {
  const mockData: ActivityProps = {
    id: "1",
    title: "Morning Walk",
    hour: "07:00 AM",
    isBefore: false,
  };

  it("should render the activity title and hour", () => {
    const { getByText } = render(<Activity data={mockData} />);
    expect(getByText("Morning Walk")).toBeTruthy();
    expect(getByText("07:00 AM")).toBeTruthy();
  });

  it("should render the CircleDashed icon when isBefore is false", () => {
    const { getByTestId } = render(<Activity data={mockData} />);
    expect(getByTestId("circle-dashed-icon")).toBeTruthy();
  });

  it("should render the CircleCheck icon when isBefore is true", () => {
    const updatedData = { ...mockData, isBefore: true };
    const { getByTestId } = render(<Activity data={updatedData} />);
    expect(getByTestId("circle-check-icon")).toBeTruthy();
  });

  it("should apply opacity when isBefore is true", () => {
    const updatedData = { ...mockData, isBefore: true };
    const { getByTestId } = render(<Activity data={updatedData} />);
    const view = getByTestId("activity-container");
    expect(view.props.style.opacity).toBe(0.5);
  });
});
