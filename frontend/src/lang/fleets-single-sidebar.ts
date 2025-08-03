import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    PASSENGERS: "Passagers",
    AIRCON: "Climatisation",
    DOORS: "Doors",
    TRANSMISSION: "Portes",
    AGE: "Âge (années)",
    YES: "Oui",
    NO: "Non",
    MANUAL: "Manuel",
    AUTOMATIC: "Automatique",
    PER: "/par",
    DAY: "jour",
    BOOK: "réservez maintenant",
    MODAL_HEADING: "Réservez votre véhicule dès aujourd'hui !",
    MODAL_DESCRIPTION:
      "Remplissez le formulaire ci-dessous pour réserver votre véhicule. Complétez les informations nécessaires pour garantir une expérience de location agréable.",
    BOOKING_DETAILS: "Détails de la réservation",
    FULL_NAME_PLACEHOLDER: "Nom et prénom",
    EMAIL_PLACEHOLDER: "E-mail",
    EMAIL_UNVALID: "Email non valide",
    EMAIL_REGISTERED: "Email déjà enregistré",
    PHONE_PLACEHOLDER: "Téléphone",
    PHONE_UNVALID: "Téléphone non valide",
    BIRTH_DATE: "Date de naissance",
    RECAPTCHA_ERROR: "Erreur Recaptcha",
    TOS_ERROR: "Erreur dans les conditions d'utilisation",
    AGREE: "J'ai lu et je suis d'accord avec ",
    TERMS: "conditions d'utilisation",
    RENT: "louer maintenant",
    ADDITIONAL: "Informations supplémentaires sur le conducteur",
    ADDITIONAL_FULL_NAME_PLACEHOLDER:
      "Nom complet du conducteur supplémentaire",
    ADDITIONAL_EMAIL_PLACEHOLDER:
      "Entrez l'adresse e-mail du conducteur supplémentaire",
    ADDITIONAL_PHONE_PLACEHOLDER:
      "Entrez le numéro de téléphone du conducteur supplémentaire",
  },
  en: {
    PASSENGERS: "Passengers",
    AIRCON: "Air Condition",
    DOORS: "Doors",
    TRANSMISSION: "Transmission",
    AGE: "Age (years)",
    YES: "Yes",
    NO: "No",
    MANUAL: "Manual",
    AUTOMATIC: "Automatic",
    PER: "/per",
    DAY: "day",
    BOOK: "book now",
    MODAL_HEADING: "Reserve your vehicle today!",
    MODAL_DESCRIPTION:
      "Fill out the form below to reserve your vehicle. Complete the necessary details to ensure a smooth rental experience.",
    BOOKING_DETAILS: "Booking Details",
    FULL_NAME_PLACEHOLDER: "Full Name",
    EMAIL_PLACEHOLDER: "Email",
    EMAIL_UNVALID: "Email not valid",
    EMAIL_REGISTERED: "Email already registered",
    PHONE_PLACEHOLDER: "Phone",
    PHONE_UNVALID: "Phone not valid",
    BIRTH_DATE: "Birth Date",
    RECAPTCHA_ERROR: "Recaptcha error",
    TOS_ERROR: "Terms of use error",
    AGREE: "I read and agree with ",
    TERMS: "terms of use",
    RENT: "rent now",
    ADDITIONAL: "Additional Driver Details",
    ADDITIONAL_FULL_NAME_PLACEHOLDER: "Additional Driver Full Name",
    ADDITIONAL_EMAIL_PLACEHOLDER: "Enter Additional Driver Email",
    ADDITIONAL_PHONE_PLACEHOLDER: "Enter Additional Driver Phone",
  },
});

langHelper.setLanguage(strings);
export { strings };
