import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING:
      "Nous permettons à d'autres entreprises et agences d'utiliser notre plateforme",
    SUBTITLE:
      "Alpen Getaway est une passerelle vers les destinations pittoresques des Alpes pour les voyageurs du monde entier.",
    AFFILIATE_TITLE: "Système de réservation d'affiliation",
    AFFILIATE_CONTENT:
      "Entreprises et agences de voyages du monde entier souhaitant réserver un transport pour leurs clients, nous sommes là pour vous. Bénéficiez d'une réduction spéciale sur votre première réservation. Pour bénéficier de réductions supplémentaires sur d'autres trajets, n'hésitez pas à nous contacter pour une collaboration plus poussée. Nous offrons des réductions spéciales à toutes les entreprises souhaitant réserver un transfert pour des événements spéciaux, des festivals, des séminaires et autres occasions en Europe.",
    B2B_TITLE: "Partenariat B2B",
    B2B_CONTENT:
      "Toute entreprise de transport souhaitant utiliser notre plateforme doit s'inscrire pour accéder à notre CRM. Cette inscription nécessite quelques étapes, conformément à nos critères d'éligibilité, tels que les véhicules, les conducteurs et l'historique de l'entreprise.",
    BUTTON: "Apprendre encore plus",
  },
  en: {
    HEADING: "We are letting other companies and agencies to use our platform",
    SUBTITLE:
      "Alpen Getaway is a Gateway to Alpen Scenic Destinations for Travelers across the world.",
    AFFILIATE_TITLE: "Affiliate Booking System",
    AFFILIATE_CONTENT:
      "Here businesses & travel agencies from all over the world, that would like to book a ride for their customers on behalf of their company. They can get a special discount on their first booking. If they want further discounts on more rides, then they can contact us for further cooperation. We will offer a special discount to all the Businesses and travel agencies, that want to book a transfer with us for the special events, fests, seminars and other occasions across Europe. If you are interested then fill the form on your right.",
    B2B_TITLE: "B2B Partnership",
    B2B_CONTENT:
      "Every transport company that would like to use our platform needs to regieter with us to gain access to our website CRM. This registration process needs some steps to be completed according to our agreement requirements eligibility criteria such as Cars, Drivers and Company History.",
    BUTTON: "Learn More",
  },
});

langHelper.setLanguage(strings);
export { strings };
