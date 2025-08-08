import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    WELCOME: "bienvenue à la location de voiture",
    HEADING: "Confort de luxe et facilité",
    PARAGRAPH:
      "Que vous planifiez une escapade d'un week-end, un voyage d'affaires ou que vous ayez simplement besoin d'un moyen de transport fiable pour la journée, nous proposons une large gamme de véhicules adaptés à vos besoins.",
    BOOK: "gérer mes réservations",
    LEARN: "réservation d'affiliation",
    PICKUP: "D'où vient",
    DROP_OFF: "Où aller",
    PICKUP_DATE: "date de ramassage",
    RETURN_DATE: "Ajouter un retour (facultatif)",
    SELECT: "Sélectionnez l'emplacement",
    ADULTS: "Adultes",
    KIDS: "Siège d'appoint pour enfants (5 à 12 ans)",
    CHILD: "Siège enfant (1 à 5 ans)",
    INFANT: "Siège de sécurité pour bébé (0-1 an)",
    SKI: "Équipement de ski",
    SPECIAL:
      "Équipements spéciaux pour personnes (fauteuil roulant, déambulateurs pliants, aide à la mobilité, etc.)",
    FREE: "Tous les types de sièges pour enfants sont inclus gratuitement, ainsi que tous les équipements de ski et de personnes spéciales sont également inclus gratuitement dans votre trajet.",
    DONE: "Fait",
  },
  en: {
    WELCOME: "welcome to car rent",
    HEADING: "Luxury comfort & Ease",
    PARAGRAPH:
      "Whether you're planning a weekend getaway, a business trip, or just need a reliable ride for the day, we offer a wide range of vehicles to suit your needs.",
    BOOK: "manage my bookings",
    LEARN: "affiliate booking",
    PICKUP: "Where From",
    DROP_OFF: "Where To",
    PICKUP_DATE: "pickup date",
    RETURN_DATE: "Add Return (Optional)",
    SELECT: "Select Location",
    ADULTS: "Adults",
    KIDS: "Kids (5-12 years Booster seat)",
    CHILD: "Child (1-5 years Toddler seat)",
    INFANT: "Infant (0-1 years Infant safety seat)",
    SKI: "Ski Equipment",
    SPECIAL:
      "Special Person Equipment (Wheelchair, Folding Walkers, Mobility Aid, etc.)",
    FREE: "All kind of children seats are inclusively free of cost, plus all ski and special person equipments are also inclusively free of cost in your ride.",
    DONE: "Done",
  },
});

langHelper.setLanguage(strings);
export { strings };
