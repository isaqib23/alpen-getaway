import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING:
      "Prêt à prendre la route ? Réservez votre voiture dès aujourd'hui!",
    DESCRIPTION:
      "Notre équipe de service client est là pour vous aider. Contactez-nous à tout moment pour obtenir de l'aide et des renseignements.",
    CONTACT: "Contactez-nous",
    BOOK_NOW: "Réserver maintenant",
  },
  en: {
    HEADING: "Ready to hit the road? Book your car today!",
    DESCRIPTION:
      "Our friendly customer service team is here to help. Contact us anytime for support and inquiries.",
    CONTACT: "contact us",
    BOOK_NOW: "Book Now",
  },
  de: {
    HEADING: "Bereit für die Straße? Buchen Sie Ihr Auto noch heute!",
    DESCRIPTION:
      "Unser freundliches Kundenservice-Team ist da, um zu helfen. Kontaktieren Sie uns jederzeit für Unterstützung und Anfragen.",
    CONTACT: "Kontaktieren Sie uns",
    BOOK_NOW: "Jetzt buchen",
  },
  it: {
    HEADING: "Pronti per mettersi in strada? Prenota la tua auto oggi!",
    DESCRIPTION:
      "Il nostro team di assistenza clienti è qui per aiutare. Contattaci in qualsiasi momento per supporto e informazioni.",
    CONTACT: "Contattaci",
    BOOK_NOW: "Prenota ora",
  },
});

langHelper.setLanguage(strings);
export { strings };
