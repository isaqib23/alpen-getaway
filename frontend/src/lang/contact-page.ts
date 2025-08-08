import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "Coordonnées",
    DESCRIPTION: "Dites quelque chose pour démarrer une discussion en direct !",
    FIRST_NAME: "prénom",
    FIRST_NAME_PLACEHOLDER: "Entrez votre nom",
    LAST_NAME: "nom de famille",
    LAST_NAME_PLACEHOLDER: "Entrez votre nom",
    MESSAGE: "message",
    MESSAGE_PLACEHOLDER: "Écrivez votre message",
    PHONE: "téléphone",
    PHONE_PLACEHOLDER: "Entrez votre numéro",
    EMAIL: "E-mail",
    EMAIL_PLACEHOLDER: "Entrez votre email",
    SEND: "envoyer un message",
    MAP_HEADING: "emplacement",
    MAP_DESCRIPTION: "Comment atteindre notre emplacement exact",
  },
  en: {
    HEADING: "Contact information",
    DESCRIPTION: "Say something to start a live chat!",
    FIRST_NAME: "first name",
    FIRST_NAME_PLACEHOLDER: "Enter Your Name",
    LAST_NAME: "last name",
    LAST_NAME_PLACEHOLDER: "Enter Your Name",
    MESSAGE: "message",
    MESSAGE_PLACEHOLDER: "Write Your Message",
    PHONE: "phone",
    PHONE_PLACEHOLDER: "Enter Your Number",
    EMAIL: "email",
    EMAIL_PLACEHOLDER: "Enter Your Email",
    SEND: "send message",
    MAP_HEADING: "location",
    MAP_DESCRIPTION: "How to reach our exact location",
  },
});

langHelper.setLanguage(strings);
export { strings };
