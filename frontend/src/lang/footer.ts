import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    EASE: "Découvrez le luxe, le confort et la facilité avec Alpen Getaway.",
    LEGAL: "politique juridique",
    TERMS: "Termes et conditions",
    PRIVACY: "politique de confidentialité",
    LEGAL_NOTICE: "conditions générales",
    ACCESSIBILITY: "DSGVO (Politique de protection des données)",
    QUICK: "liens rapides",
    HOME: "Accueil",
    ABOUT: "à propos de nous",
    CARS: "flottes",
    SERVICES: "services",
    SUBSCRIBE: "Abonnez-vous aux newsletters",
    COPYRIGHT: "© 2025 Alpen Getaway GmbH. Tous droits réservés.",
  },
  en: {
    EASE: "Experience the luxury, comfort & ease with Alpen Getaway.",
    LEGAL: "legal policy",
    TERMS: "term & condition",
    PRIVACY: "privacy policy",
    LEGAL_NOTICE: "general terms",
    ACCESSIBILITY: "DSGVO (Data Protection Policy)",
    QUICK: "quick links",
    HOME: "home",
    ABOUT: "about us",
    CARS: "fleets",
    SERVICES: "services",
    SUBSCRIBE: "Subscribe to the Newsletters",
    COPYRIGHT: "© 2025 Alpen Getaway GmbH. All rights reserved.",
  },
});

langHelper.setLanguage(strings);
export { strings };
