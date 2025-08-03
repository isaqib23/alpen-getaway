import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING:
      "Prêt à prendre la route ? Réservez votre voiture dès aujourd'hui!",
    DESCRIPTION:
      "Notre équipe de service client est là pour vous aider. Contactez-nous à tout moment pour obtenir de l'aide et des renseignements.",
    CONTACT: "Contactez-nous",
  },
  en: {
    HEADING: "Ready to hit the road? Book your car today!",
    DESCRIPTION:
      "Our friendly customer service team is here to help. Contact us anytime for support and inquiries.",
    CONTACT: "contact us",
  },
});

langHelper.setLanguage(strings);
export { strings };
