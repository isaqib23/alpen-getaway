import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    WELCOME: "bienvenue à la location de voiture",
    HEADING: "Confort de luxe et facilité",
    PARAGRAPH:
      "Joignez-vous à nous pour offrir à nos prestigieux clients un voyage luxueux, plein de confort et de divertissement avec une remise spéciale",
    BOOK: "réserver une location",
    LEARN: "apprendre encore plus",
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
    ABOUT: "réservation d'affiliation",
    HEADING_BODY:
      "Votre partenaire de confiance en matière de location de voiture fiable",
    CONTACT: "Contactez-nous",
    PARA_1:
      "Ici, les entreprises et agences de voyages du monde entier souhaitent réserver des courses pour leurs clients. Elles peuvent bénéficier d'une réduction spéciale sur leur première réservation. Si elles souhaitent bénéficier de réductions supplémentaires sur d'autres courses, elles peuvent nous contacter pour une collaboration plus poussée.",
    PARA_2:
      "Nous offrirons une remise spéciale à toutes les entreprises et agences de voyages qui souhaitent réserver un transfert avec nous pour des événements spéciaux, des festivals, des séminaires et d'autres occasions à travers l'Europe. Si vous êtes intéressé, remplissez le formulaire sur votre droite.",
    JOIN: "Formulaire d'inscription de société affiliée",
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
    WELCOME: "welcome to car rent",
    HEADING: "Luxury comfort & Ease",
    PARAGRAPH:
      "Join hands with us to offer our prestigious customers a luxurious ride, full of comfort & entertainment with special discount",
    BOOK: "book a rental",
    LEARN: "learn more",
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
    ABOUT: "affiliate booking",
    HEADING_BODY:
      "We invite you to get in through the gateway of Alpen getaway and expand your business",
    CONTACT: "contact us",
    PARA_1:
      "Here businesses & travel agencies from all over the world, that would like to book a ride for their customers on behalf of their company. They can get a special discount on their first booking. If they want further discounts on more rides, then they can contact us for further cooperation. ",
    PARA_2:
      "We will offer a special discount to all the Businesses and travel agencies, that want to book a transfer with us for the special events, fests, seminars and other occasions across Europe. if you are interested then fill the form on your right.",
    JOIN: "Affiliate Company Registration Form",
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
