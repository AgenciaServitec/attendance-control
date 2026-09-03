type EnvironmentConfig = ConfigCommon & ConfigEnvironment;

interface Config {
  common: ConfigCommon;
  development: ConfigEnvironment;
  production: ConfigEnvironment;
}

interface ConfigCommon {
  "node-mailer": NodeMailerConfig;
}

interface ConfigEnvironment {
  version: string;
  hosting: {
    domain: string;
    apiUrl: string;
  };
  mailer: MailerConfig;
  "api-peru-devs": ApiPeruDevsConfig;
}

interface NodeMailerConfig {
  port: number;
  host: string;
  from: string;
  user: string;
  pass: string;
}

interface MailerConfig {
  sendMailNotifyKorekenkeError: {
    to: string;
    bcc: string;
  };
  sendMailerNotifyDasRequest: {
    to: string;
    bcc: string;
  };
}

interface ApiPeruDevsConfig {
  apiUrl: string;
  token: string;
}
