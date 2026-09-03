interface SmtpDetailsResult {
  from: string;
  smtpConfig:
    | {
        host: string;
        port: number | string;
        user: string;
        pass: string;
      }
    | undefined;
}

export const getSiteSmtpDetails = (site: any): SmtpDetailsResult => {
  const smtpConfig = site?.smtpConfig;

  const isCustomSmtpActive =
    site?.customSmtp &&
    smtpConfig?.host &&
    smtpConfig?.port &&
    smtpConfig?.user &&
    smtpConfig?.pass;

  const from = isCustomSmtpActive
    ? `"${site.name}" <${smtpConfig.user}>`
    : `"Servitec Perú" <notificaciones@servitecperu.com>`;

  return {
    from,
    smtpConfig: isCustomSmtpActive
      ? {
          host: smtpConfig.host,
          port: smtpConfig.port,
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        }
      : undefined,
  };
};
