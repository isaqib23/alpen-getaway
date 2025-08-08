import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "Pourquoi nous choisir",
    DESCRIPTION: "Une qualité et un service inégalés pour vos besoins",
    FLEET: "vastes options de flotte",
    FLEET_DESCRIPTION:
      "Offrant une large gamme de véhicules, répondant à vos besoins de la classe économique à la classe affaires et de la restauration pour les voyages d'affaires et familiaux",
    CUSTOMER_SERVICE: "service client exceptionnel",
    CUSTOMER_SERVICE_DESCRIPTION:
      "Ce qui nous différencie des autres, c'est le support client multilingue en ligne 24h/24 et 7j/7 et un représentant de l'entreprise à l'aéroport pour vous guider.",
    LOCATIONS: "Emplacements pratiques",
    LOCATIONS_DESCRIPTION:
      "Suivi en direct (GPS) à bord disponible pour accompagner nos clients pendant leur trajet sans tracas.",
    RELIALBILITY: "fiabilité et sécurité",
    RELIALBILITY_DESCRIPTION:
      "Ne vous inquiétez pas pour vos objets oubliés dans notre flotte, ils vous seront restitués en l'état. Nous contrôlons votre trajet en temps réel pour garantir votre sécurité et votre confort.",
  },
  en: {
    HEADING: "why choose us",
    DESCRIPTION: "Unmatched quality and service for your needs",
    FLEET: "extensive fleet options",
    FLEET_DESCRIPTION:
      "Offering wide range of vehicles, meeting your needs from economy class to business class & catering business & family trips",
    CUSTOMER_SERVICE: "exceptional customer service",
    CUSTOMER_SERVICE_DESCRIPTION:
      "What makes us different from others is 24/7 online multi-Lingual customer support and company representative at the airport for your guidance",
    LOCATIONS: "convenient locations",
    LOCATIONS_DESCRIPTION:
      "Live tracking(GPS) on board available to convene our customer during their hassle free ride.",
    RELIALBILITY: "reliability and safety",
    RELIALBILITY_DESCRIPTION:
      "No worries about your forgotten stuff in out fleet, you will have it back as it is. We control the ride activity live to ensure the safety & comfort of your ride.",
  },
});

langHelper.setLanguage(strings);
export { strings };
