import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "Témoignages",
    DESCRIPTION: "Ce que nos clients disent de nous",
    TEXT: "Louer une voiture chez Nova Ride a été une excellente décision. Non seulement j'ai eu un véhicule fiable et confortable, mais les prix étaient également très compétitifs.",
    MANAGER: "chef de projet",
  },
  en: {
    HEADING: "testimonials",
    DESCRIPTION: "What our customers are saying about us",
    TEXT: "Renting a car from nova ride was a great decision. Not only did I get a reliable and comfortable vehicle, but the prices were also very competitive.",
    MANAGER: "project manager",
  },
});

langHelper.setLanguage(strings);
export { strings };
