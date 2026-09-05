import mustache from "mustache";
import { createTransport, Transporter } from "nodemailer";
import { environmentConfig } from "../config";
import Mail from "nodemailer/lib/mailer";

const { host, from, pass, user, port } = environmentConfig["node-mailer"];

const defaultTransporter = createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

interface CustomSmtpConfig {
  host?: string;
  port?: number | string;
  user?: string;
  pass?: string;
}

export const sendMail = async (
  mailOptions: Mail.Options,
  customSmtp?: CustomSmtpConfig
): Promise<void> => {
  const hasCustomSmtp =
    customSmtp?.user &&
    customSmtp?.pass &&
    customSmtp?.host &&
    customSmtp?.port;

  let currentTransporter: Transporter = defaultTransporter;
  let senderEmail = `${from} <${user}>`;

  if (hasCustomSmtp) {
    try {
      const smtpPort = Number(customSmtp.port);

      currentTransporter = createTransport({
        host: customSmtp.host,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: customSmtp.user,
          pass: customSmtp.pass,
        },
      });

      senderEmail = customSmtp.user!;
    } catch (smtpError) {
      console.error(
        "[Mailer] Error al inicializar Custom SMTP por Host/Port, usando fallback predeterminado:",
        smtpError
      );
      currentTransporter = defaultTransporter;
      senderEmail = `${from} <${user}>`;
    }
  }

  const options: Mail.Options = {
    ...mailOptions,
    from: mailOptions.from || senderEmail,
  };

  try {
    await currentTransporter.sendMail(options);
  } catch (error) {
    console.error("Error en sendMail [Nodemailer]:", error);
    throw error;
  }
};

export const renderHtmlTemplate = (
  template: string,
  view: Record<string, any>
): string => mustache.render(template, view);
