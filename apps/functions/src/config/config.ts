export const config: Config = {
  common: {
    "node-mailer": {
      port: 465,
      host: "smtp.gmail.com",
      from: "Notificaciones Servitec Perú",
      user: "notificacionesservitecperu@gmail.com",
      pass: "fckt uien lude hkgi",
    },
  },
  development: {
    version: "0.0.1",
    hosting: {
      domain: "https://gob-regional-callao.web.app",
      apiUrl: "https://api-gob-regional-callao.web.app",
    },
    mailer: {
      sendMailNotifyKorekenkeError: {
        to: "galafloresangelemilio@gmail.com",
        bcc: "",
      },
      sendMailerNotifyDasRequest: {
        to: "galafloresangelemilio@gmail.com",
        bcc: "",
      },
    },
    "api-peru-devs": {
      apiUrl: "https://api.perudevs.com/api/v1",
      token:
        "cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjcwMDVlOTI5ZmE0MTczZjYxMzIwM2M3",
    },
  },
  production: {
    version: "0.0.1",
    hosting: {
      domain: "https://gob-regional-callao.web.app",
      apiUrl: "https://api-gob-regional-callao.web.app",
    },
    mailer: {
      sendMailNotifyKorekenkeError: {
        to: "galafloresangelemilio@gmail.com",
        bcc: "",
      },
      sendMailerNotifyDasRequest: {
        to: "galafloresangelemilio@gmail.com",
        bcc: "",
      },
    },
    "api-peru-devs": {
      apiUrl: "https://api.perudevs.com/api/v1",
      token:
        "cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjcwMDVlOTI5ZmE0MTczZjYxMzIwM2M3",
    },
  },
};
