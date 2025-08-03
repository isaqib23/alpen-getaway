import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "Comment ça marche",
    DESCRIPTION:
      "Flotte écologique pour les voyageurs soucieux de l'environnement",
    STREAMLINED:
      "Nous proposons non seulement luxe et confort, mais aussi des véhicules hybrides écologiques. Notre objectif est de construire un avenir plus vert et de réduire notre empreinte carbone.",
    BROWSE: "parcourir et sélectionner",
    BROWSE_DESCRIPTION:
      "Explorez notre sélection diversifiée de véhicules haut de gamme, choisissez vos dates de prise en charge et de retour préférées et sélectionnez l'emplacement qui correspond le mieux à vos besoins.",
    CONFIRM: "réserver et confirmer",
    CONFIRM_DESCRIPTION:
      "Confirmez les détails de votre réservation, y compris les heures et lieux de prise en charge et de retour. Assurez-vous que toutes les informations sont exactes avant de finaliser votre réservation.",
    ENJOY: "réservez et profitez",
    ENJOY_DESCRIPTION:
      "Récupérez votre véhicule et profitez de votre trajet. Découvrez la simplicité de notre processus de location et profitez au maximum de votre voyage.",
    TRUSTED: "m+ Clients internationaux de confiance",
  },
  en: {
    HEADING: "how it works",
    DESCRIPTION: "Eco-Friendly Fleet for environmental concerned Travellers",
    STREAMLINED:
      "We offer not only luxury and comfort but we also offer Eco-Friendly, hybrid vehicles. Our aim is to produce greener future and reduce carbon footprint.",
    BROWSE: "browse and select",
    BROWSE_DESCRIPTION:
      "Explore our diverse selection of high-end vehicles, choose your preferred pickup and return dates, and select a location that best fits your needs.",
    CONFIRM: "book and confirm",
    CONFIRM_DESCRIPTION:
      "Confirm your booking details, including pickup and drop-off times and locations. Ensure all information is accurate before finalizing your reservation.",
    ENJOY: "book and enjoy",
    ENJOY_DESCRIPTION:
      "Pick up your vehicle and enjoy your ride. Experience the ease of our rental process and make the most out of your journey.",
    TRUSTED: "m+ Trusted worldwide global clients",
  },
});

langHelper.setLanguage(strings);
export { strings };
