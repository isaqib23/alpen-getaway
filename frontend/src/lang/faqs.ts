import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "Questions fréquemment posées",
    DESCRIPTION: "Tout ce que vous devez savoir sur nos services",
    WHAT: "Comment réserver une voiture ?",
    WHAT_DESCRIPTION:
      "Pour réserver une voiture, vous devez vous rendre dans notre section de réservation, sélectionnez simplement votre lieu de prise en charge, votre lieu de restitution, votre date de prise en charge et continuez.",
    AGE: "Quel âge dois-je avoir pour réserver une voiture ?",
    AGE_DESCRIPTION:
      "Normalement, les adultes peuvent réserver un trajet, mais les mineurs peuvent réserver un trajet sur la base des informations d'identification de leurs tuteurs/parents (si leurs parents l'autorisent).",
    CARD: "Puis-je réserver un trajet avec une carte de crédit/débit ?",
    CARD_DESCRIPTION:
      "Oui, vous pouvez réserver un trajet avec une carte de débit, une carte de crédit, payable en ligne et à bord.",
  },
  en: {
    HEADING: "frequently asked questions",
    DESCRIPTION: "Everything you need to know about our services",
    WHAT: "How to book a car?",
    WHAT_DESCRIPTION:
      "To book a car you need to go to our booking section, just select your pickup location, dropoff location, Pickup Date and continue.",
    AGE: "How old do I need to be to book a car?",
    AGE_DESCRIPTION:
      "Normally adults can book a ride, but under age can book a ride on the guardians/parents credentials (if their parents allow it).",
    CARD: "Can I book a ride with a credit/debit card?",
    CARD_DESCRIPTION:
      "Yes you can book a ride with Debit card, Credit Card, both online and on board payable.",
  },
});

langHelper.setLanguage(strings);
export { strings };
