import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    SIGN_IN: "Se connecter",
    ACCOUNT: "Compte",
    HOME: "Accueil",
    BLOG: "Blog",
    DRIVERS: "Conductrices",
    BOOKINGS: "Réservations",
    ABOUT: "À propos de nous",
    TOS: "Termes",
    CONTACT: "Contactez-nous",
    LANGUAGE: "Langue",
    SETTINGS: "Paramètres",
    SIGN_OUT: "Se déconnecter",
    SUPPLIERS: "Fournisseurs",
    LOCATIONS: "Lieux",
    NOTIFICATIONS: "Notifications",
    BUTTON: "devenir partenaire",
    OUR_SERVICES: "Nos Services",
  },
  en: {
    SIGN_IN: "Sign In",
    ACCOUNT: "Account",
    HOME: "Home",
    BLOG: "Blog",
    DRIVERS: "Drivers",
    BOOKINGS: "Bookings",
    ABOUT: "About Us",
    TOS: "Terms",
    CONTACT: "Contact Us",
    LANGUAGE: "Language",
    SETTINGS: "Settings",
    SIGN_OUT: "Sign Out",
    SUPPLIERS: "Suppliers",
    LOCATIONS: "Locations",
    NOTIFICATIONS: "Notifications",
    BUTTON: "become a partner",
    OUR_SERVICES: "Our Services",
  },
});

langHelper.setLanguage(strings);
export { strings };
