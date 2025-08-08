import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";
import env from "../config/env.config";
import * as UserService from "../services/UserService";

const language = UserService.getLanguage();
const isUS = language === "en" && env.CURRENCY === "$";

const strings = new LocalizedStrings({
  fr: {
    INCLUDED: "(Compris)",
    MILEAGE: "Kilométrage",
    MILEAGE_DESCRIPTION: "Des kilomètres illimités sans frais supplémentaires",
    FUEL_POLICY: "Politique sur le carburant",
    LIKE_FOR_LIKE: "Comme pour comme",
    FREE_TANK: "Réservoir gratuit",
    INFO_HEADING: "Informations générales",
    INFO_DESCRIPTION: "Découvrez notre service de voiture",
    INFO_PARAGRAPH:
      "Lorem pretium fermentum quam, sit amet cursus ante sollicitudin velen morbi consesua the miss sustion consation porttitor orci sit amet iaculis nisan. Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttiton.",
    ASSISTANCE: "Assistance routière 24h/24 et 7j/7",
    CANCELLATION: "Annulation et retour gratuits",
    RENT: "Louez maintenant, payez à votre arrivée",
    AMENITIES_HEADING: "Équipements",
    AMENITIES_DESCRIPTION: "Équipements et fonctionnalités haut de gamme",
    RENTAL_CONDITIONS: "Conditions de location",
    POLICIES: "Politiques et accords",
    LICENSE: "Exigences relatives au permis de conduire",
    INSURANCE: "Politique d'assurance et de couverture",
    METHODS: "Méthodes de paiement disponibles",
    MODIFICATION: "Politique d'annulation et de modification",
    SMOKING: "Politiques concernant le tabagisme et les animaux de compagnie",
    AGE: "Âge minimum requis",
    CONTENT:
      "C’est un fait établi depuis longtemps qu’un lecteur sera distrait par le contenu lisible d’une page lorsqu’il examinera sa mise en page.",
  },
  en: {
    INCLUDED: "(Included)",
    MILEAGE: "Mileage",
    MILEAGE_DESCRIPTION: "Endless Km with no extra charge",
    FUEL_POLICY: "Fuel Policy",
    LIKE_FOR_LIKE: "Like For Like",
    FREE_TANK: "Free Tank",
    INFO_HEADING: "General Information",
    INFO_DESCRIPTION: "Know about our car service",
    INFO_PARAGRAPH:
      "Lorem pretium fermentum quam, sit amet cursus ante sollicitudin velen morbi consesua the miss sustion consation porttitor orci sit amet iaculis nisan. Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttiton.",
    ASSISTANCE: "24/7 Roadside Assistance",
    CANCELLATION: "Free Cancellation & Return",
    RENT: "Rent Now Pay When You Arrive",
    AMENITIES_HEADING: "Amenities",
    AMENITIES_DESCRIPTION: "Premium amenities and features",
    RENTAL_CONDITIONS: "Rental Conditions",
    POLICIES: "Policies and agreement",
    LICENSE: "Driver's License Requirements",
    INSURANCE: "Insurance and Coverage policy",
    METHODS: "Available payment Methods",
    MODIFICATION: "Cancellation and Modification policy",
    SMOKING: "Smoking and Pet Policies",
    AGE: "The minimum age Requirements",
    CONTENT:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
});

langHelper.setLanguage(strings);
export { strings };
