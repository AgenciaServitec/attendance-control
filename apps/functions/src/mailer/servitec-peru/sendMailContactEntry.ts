import { renderHtmlTemplate, sendMail } from "../sendMail";
import { template } from "./templates";
import { ContactEntry } from "../../globalTypes";
import { fetchSite } from "../../_firebase/collections";
import { getSiteSmtpDetails } from "../../utils";

interface MailData {
  primaryColor: string;
  textColor: string;
  title: string;
  fullName: string;
  messageText: string;
  logoUrl: string;
  bannerUrl: string;
  siteName: string;
  hostname: string;
  isServitec: boolean;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
}

export const sendMailContactEntry = async (
  contactEntry: ContactEntry
): Promise<void> => {
  const targetEmail = contactEntry?.client.email;

  if (!targetEmail) {
    console.warn(
      `[Mailer] No se pudo enviar el correo. La entrada ID: ${contactEntry?.id} no cuenta con un email de destino.`
    );
    return;
  }

  try {
    const site = contactEntry.siteId
      ? ((await fetchSite(contactEntry.siteId)) as any)
      : null;

    if (!site) {
      console.warn(
        `[Mailer] No se encontró el sitio con ID: ${contactEntry.siteId}. Se cancela el envío.`
      );
      return;
    }

    const htmlResult = renderHtmlTemplate(
      template.contactEntryEmailTemplate,
      mapMailData(contactEntry, site)
    );

    const { from, smtpConfig } = getSiteSmtpDetails(site);

    await sendMail(
      {
        to: targetEmail,
        from,
        subject: `Hemos recibido tu consulta | ${site.name}`,
        html: htmlResult,
        replyTo: site?.businessInfo?.email,
      },
      smtpConfig
    );
  } catch (error) {
    console.error(
      `[Mailer Error] Falla al procesar sendMailContactEntry para ID: ${contactEntry?.id}`,
      error
    );
  }
};

const mapMailData = (contactEntry: ContactEntry, site: any): MailData => {
  const isServitec = site?.hostname === "servitec-peru.com";

  return {
    primaryColor: site?.branding?.primaryColor || "",
    textColor: site?.branding?.textColor || "",
    title: "¡Recibimos tu consulta!",
    fullName: contactEntry?.client.fullName || "",
    messageText: contactEntry?.message || "",
    logoUrl: site?.branding.logo.url || "",
    bannerUrl:
      "https://storage.googleapis.com/servitec-peru.firebasestorage.app/contact-entry.png",
    siteName: site?.name || "",
    isServitec,
    hostname: site?.hostname || "",
    companyAddress: site?.businessInfo?.address || "",
    companyEmail: site?.businessInfo?.email || "",
    companyPhone: site?.notifications?.phone?.number || "",
    facebookUrl: site?.businessInfo?.socialMedia?.facebook
      ? `https://www.facebook.com/${site?.businessInfo?.socialMedia?.facebook}`
      : "",
    instagramUrl: site?.businessInfo?.socialMedia?.instagram
      ? `https://www.instagram.com/${site?.businessInfo?.socialMedia?.instagram}`
      : "",
    linkedinUrl: site?.businessInfo?.socialMedia?.linkedin
      ? site.businessInfo.socialMedia.linkedinType === "personal"
        ? `https://www.linkedin.com/in/${site.businessInfo.socialMedia.linkedin}`
        : `https://www.linkedin.com/company/${site.businessInfo.socialMedia.linkedin}`
      : "",
    whatsappUrl: site?.businessInfo?.socialMedia?.whatsapp
      ? `https://wa.me/${site?.businessInfo?.socialMedia?.whatsapp}`
      : "",
  };
};
