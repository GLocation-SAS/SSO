import { renderNotasOTPEmailTemplate } from "../templates/notas-otp-email";

describe("Notas OTP Email Template", () => {
  it("should render the OTP code prominently in the template", () => {
    const code = "492817";
    const html = renderNotasOTPEmailTemplate(code);

    expect(html).toContain("492817");
  });

  it("should contain the institutional branding 'Sistema de Notas - Conecta MINEDUC'", () => {
    const html = renderNotasOTPEmailTemplate("123456");

    expect(html).toContain("Sistema de Notas - Conecta MINEDUC");
    expect(html).toContain("Conecta MINEDUC");
  });

  it("should indicate the 5-minute validity and single-use warning", () => {
    const html = renderNotasOTPEmailTemplate("123456");

    expect(html).toMatch(/5 minutos/i);
    expect(html).toMatch(/solo puede utilizarse una vez|único uso/i);
  });

  it("should include security guidance if user did not request the code", () => {
    const html = renderNotasOTPEmailTemplate("123456");

    expect(html).toMatch(/no intentaste/i);
    expect(html).toMatch(/soporte/i);
  });

  it("should render valid HTML document structure", () => {
    const html = renderNotasOTPEmailTemplate("654321");

    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
    expect(html).toContain("UTF-8");
  });
});
