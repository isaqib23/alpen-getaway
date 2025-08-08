import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    ABOUT: "devenir partenaire",
    HEADING:
      "Votre partenaire de confiance en matière de location de voiture fiable",
    CONTACT: "Contactez-nous",
    PARA_1:
      "Toute entreprise de transport souhaitant utiliser notre plateforme doit s'inscrire pour accéder au CRM de notre site web. Cette inscription nécessite quelques étapes, conformément aux critères d'éligibilité de notre accord, tels que les véhicules, les conducteurs et l'historique de l'entreprise. Veuillez remplir le formulaire d'inscription et le soumettre. Notre équipe vous contactera dans les plus brefs délais.",
    PARA_2: "Si vous avez d’autres questions, contactez-nous !",
    JOIN: "Rejoignez notre Carvan",
    COMPANY: "Nom de l'entreprise",
    EMAIL: "Adresse e-mail de l'entreprise",
    CONTACT_NO: "Numéro de contact de l'entreprise",
    COUNTRY: "Pays d'enregistrement",
    SERVICE: "Zone de service (province)",
    REGISTERATION: "Numéro d'enregistrement de la société",
    REP: "Représentant de l'entreprise",
    SUBMIT: "Soumettre",
  },
  en: {
    ABOUT: "become a partner",
    HEADING:
      "We invite you to get in through the gateway of Alpen getaway and expand your business",
    CONTACT: "contact us",
    PARA_1:
      "Every transport company that would like to use our platform, needs to register with us to gain access to our website CRM. This registration process needs some steps to be completed according to our agreement requirements eligibility criteria such as Cars, Drivers and Company History. Please fill in the registeration form and submit it then our concerned team member will shortly get in touch with you.",
    PARA_2: "If you have any further queries then contact us!",
    JOIN: "Join Our Carvan",
    COMPANY: "Company Name",
    EMAIL: "Company Email Address",
    CONTACT_NO: "Company Contact Number",
    COUNTRY: "Registration Country",
    SERVICE: "Service Area (Province)",
    REGISTERATION: "Company Registration Number",
    REP: "Company Representative",
    SUBMIT: "Submit",
  },
});

langHelper.setLanguage(strings);
export { strings };
