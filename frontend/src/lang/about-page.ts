import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    PARTNERS_HEADING:
      "Flexibilité et facilité dans notre système de réservation",
    PARTNERS_DESCRIPTION: "Approuvé par les plus grandes marques",
    VIDEO_HEADING: "Regardez notre vidéo",
    VIDEO_DESCRIPTION:
      "Découvrez ce qui nous distingue dans le secteur de la location de voitures",
    SATISFIED_CUSTOMERS: "clients satisfaits",
    DRIVERS_HEADING: "nos chauffeurs expérimentés",
    DRIVERS_DESCRIPTION:
      "Personnel de chauffeurs professionnels, compétents et bien élevés",
    SPECIALIST: "spécialiste de voyages",
    DISTANCE: "conducteur à distance",
    GUIDE: "guide touristique de la ville",
    SENIOR: "chauffeur principal",
    FLEXIBILITY:
      "Nous offrons à nos chers clients un système de gestion des réservations où ils peuvent modifier/changer leurs trajets déjà réservés, en cliquant sur le bouton (Gérer ma réservation).",
    FREE_CANCELLATION:
      "Nous sommes l'entreprise du marché qui propose l'annulation gratuite de ses trajets/transferts en cas d'incidents imprévus ou de changements de plans. Ils recevront leur remboursement s'ils ont payé leurs trajets/transferts réservés.",
  },
  en: {
    PARTNERS_HEADING: "Flexibility & Ease in our Booking System",
    PARTNERS_DESCRIPTION: "Trusted by leading brands",
    VIDEO_HEADING: "watch our video",
    VIDEO_DESCRIPTION: "Discover what sets us apart in the car rental industry",
    SATISFIED_CUSTOMERS: "satisfied customers",
    DRIVERS_HEADING: "our experienced drivers",
    DRIVERS_DESCRIPTION:
      "Professional, well versed & well mannered Chauffeurs staff",
    SPECIALIST: "travel specialist",
    DISTANCE: "distance driver",
    GUIDE: "city tour guide",
    SENIOR: "senior chauffeur",
    FLEXIBILITY:
      "We are offenng our honored costumers a booking management system where they can Edit/Change their already booked rides, by clicking (Mange My Booking) button.",
    FREE_CANCELLATION:
      "We are the company in the market that are offering free cancellation on their rides/transfers due to some unexpected incidents and change of plans. They will receive their refund in case they have paid for their booked rides/transters.",
  },
});

langHelper.setLanguage(strings);
export { strings };
