import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "nos flottes",
    DESCRIPTION:
      "Découvrez nos véhicules luxueux, fiables, accessibles et écologiques",
    LUXURY: "voiture de luxe",
    PASSENGER: "passagères",
    DOORS: "portes",
    YES: "Oui",
    MANUAL: "Manuel",
    AUTOMATIC: "Automatique",
    DAY: "jour",
    LUXURY_CAR: "Voiture de luxe",
    SEDAN: "Voiture berline",
    SPORTS: "Voiture de sport",
    CONVERTIBLE: "Voiture décapotable",
    AUTUMN: "Automne",
    SUMMER: "Été",
    WINTER: "Hiver",
    SPRING: "Printemps",
  },
  en: {
    HEADING: "our fleets",
    DESCRIPTION:
      "Meetup our luxurious, reliable, accessible & Eco-Friendly vehicles",
    LUXURY: "luxury car",
    PASSENGER: "passengers",
    DOORS: "doors",
    YES: "Yes",
    MANUAL: "Manual",
    AUTOMATIC: "Automatic",
    DAY: "day",
    LUXURY_CAR: "Luxury Car",
    SEDAN: "Sedan Car",
    SPORTS: "Sports Car",
    CONVERTIBLE: "Convertible Car",
    AUTUMN: "Autumn",
    SUMMER: "Summer",
    WINTER: "Winter",
    SPRING: "Spring",
  },
});

langHelper.setLanguage(strings);
export { strings };
