import { renderHtmlTemplate, sendMail } from "../sendMail";
import { template } from "./templates";
import { fetchSiteByHostname } from "../../_firebase/collections";

interface VerificationMailData {
  email: string;
  fullName: string;
  verificationCode: string;
  logoUrl: string;
  siteName: string;
  primaryColor: string;
}

interface SendVerificationCodeArgs {
  email: string;
  fullName: string;
  verificationCode: string;
  logoUrl: string;
  hostname?: string;
}

export const sendMailVerificationCode = async (
  args: SendVerificationCodeArgs
): Promise<void> => {
  const { email, fullName, verificationCode, logoUrl, hostname } = args;

  if (!email) {
    console.warn(
      "[Mailer OTP] No se pudo despachar el correo. Falta el email de destino."
    );
    return;
  }

  try {
    let site: any = null;
    if (hostname) {
      site = await fetchSiteByHostname(hostname);
    }

    const primaryColor = site?.branding?.primaryColor || "#FFC107";

    const htmlResult = renderHtmlTemplate(
      template.verificationCodeEmailTemplate,
      {
        email,
        fullName,
        verificationCode,
        logoUrl,
        primaryColor,
      } as VerificationMailData
    );

    let smtpConfig = undefined;

    await sendMail(
      {
        to: email,
        from: `"Seguridad Servitec Perú System" <no-reply@servitec.com>`,
        subject: `${verificationCode} es tu código de verificación de inicio de sesión`,
        html: htmlResult,
      },
      smtpConfig
    );

    console.log(`[Mailer OTP] Código despachado exitosamente hacia: ${email}`);
  } catch (error) {
    console.error(
      `[Mailer OTP Error] Falla al procesar sendMailVerificationCode para: ${email}`,
      error
    );
  }
};
