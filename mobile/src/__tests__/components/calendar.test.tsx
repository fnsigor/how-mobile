import React from "react";
import { render } from "../test-utils/test-utils";
import { Calendar } from "@/components/calendar"; 
import { LocaleConfig } from "react-native-calendars";

/*
Renderização Padrão:
Verifica se o componente é renderizado corretamente usando testID.

Aplicação de Tema:
Confirma que o tema personalizado foi aplicado ao componente, verificando propriedades como textMonthFontSize, selectedDayBackgroundColor, e monthTextColor.

Configuração de Localidade:
Garante que a configuração de localidade para pt-br foi aplicada corretamente no LocaleConfig.

Propagação de Propriedades Adicionais:
Testa se as propriedades adicionais (CalendarProps), como onDayPress, são corretamente propagadas e funcionam.
*/

describe("Calendar Component", () => {
  it("should render the calendar with default configuration", () => {
    const { getByTestId } = render(<Calendar testID="calendar" />);

    // Verifica se o componente está renderizado corretamente
    const calendar = getByTestId("calendar");
    expect(calendar).toBeTruthy();
  });

  it("should apply the correct theme styles", () => {
    const { getByTestId } = render(<Calendar testID="calendar" />);

    const calendar = getByTestId("calendar");

    // Verifica se o estilo do tema está sendo aplicado corretamente
    expect(calendar.props.theme).toEqual(
      expect.objectContaining({
        textMonthFontSize: 18,
        selectedDayBackgroundColor: expect.any(String), // colors.lime[300]
        selectedDayTextColor: expect.any(String), // colors.zinc[900]
        textDayFontFamily: expect.any(String), // fontFamily.regular
        monthTextColor: expect.any(String), // colors.zinc[200]
      })
    );
  });

  it("should use 'pt-br' locale configuration", () => {
    // Verifica se o LocaleConfig foi definido para pt-br
    expect(LocaleConfig.defaultLocale).toBe("pt-br");
    expect(LocaleConfig.locales["pt-br"]).toBeTruthy();
  });

  it("should propagate additional props", () => {
    const onDayPressMock = jest.fn();

    const { getByTestId } = render(
      <Calendar testID="calendar" onDayPress={onDayPressMock} />
    );

    const calendar = getByTestId("calendar");

    // Simula a função onDayPress para verificar a propagação correta
    calendar.props.onDayPress({ dateString: "2024-11-01" });
    expect(onDayPressMock).toHaveBeenCalledWith({ dateString: "2024-11-01" });
  });
});
