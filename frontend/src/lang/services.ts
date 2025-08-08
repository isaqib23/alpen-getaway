import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "nos services",
    DESCRIPTION:
      "Découvrez notre large gamme de services de luxe, fiables, rapides et professionnels",
    FOOTER:
      "Découvrez notre gamme de services opérationnels conçus pour répondre à tous vos besoins de voyage. D'une flotte de véhicules diversifiée à des formules de réservation flexibles.",
    BUTTON: "voir tous les services",
    DRIVER: "Client professionnel",
    DRIVER_DESCRIPTION:
      "Notre flotte de luxe et nos chauffeurs professionnels assureront votre confort lors de votre trajet",
    RENTAL:
      "Des options de paiement fiables, sûres et multiples. En ligne, espèces et carte à bord.",
    AIRPORT: "Transfert rapide vers l'aéroport",
    AIRPORT_DESCRIPTION:
      "Nous suivons votre vol pour vous faire gagner du temps",
    CHAUFFEUR: "services de chauffeur",
    CHAUFFEUR_DESCRIPTION:
      "Nous avons une liste de chauffeurs professionnels expérimentés et bien élevés dans notre équipe",
  },
  en: {
    HEADING: "our services",
    DESCRIPTION:
      "Explore our wide range of luxury, reliable, Quick & Professional services",
    FOOTER:
      "Discover our range of operational services designed to meet all your travel needs. From a diverse fleet of vehicles to flexible booking plans.Discover our range of operational services designed to meet all your travel needs. From a diverse fleet of vehicles to flexible booking plans.",
    BUTTON: "view all service",
    DRIVER: "Business Customer",
    DRIVER_DESCRIPTION:
      "Our Luxury Fleet & Professional Drivers will comfort your ride",
    RENTAL: "Payment Methods",
    RENTAL_DESCRIPTION:
      "Reliable, safest & multiple payment options.  Online, Cash & card on board.",
    AIRPORT: "Airport Quick Transfer",
    AIRPORT_DESCRIPTION: "We are tracking your Flight to save your time",
    CHAUFFEUR: "chauffeur services",
    CHAUFFEUR_DESCRIPTION:
      "We have a list of well versed, well mannered professional Chauffer in our team",
  },
});

langHelper.setLanguage(strings);
export { strings };
