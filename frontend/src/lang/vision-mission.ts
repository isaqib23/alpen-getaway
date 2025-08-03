import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "vision mission",
    DESCRIPTION:
      "La sécurité, le confort, le luxe et la satisfaction de nos clients sont nos principales priorités.",
    VISION_TITLE: "Notre vision",
    SUBTITLE:
      "Pionnier de l'excellence dans les services de transfert de voitures",
    SUBTITLE_MISSION: "Là où le luxe rencontre l'excellence",
    SUBTITLE_Approach: "Understanding Your Needs, Continuous Improvement",
    INNOVATE:
      "Alpen Getaway vise à devenir le premier fournisseur de services de transfert luxueux et respectueux de l'environnement dans toute la région des Alpes, en mettant l'accent sur la durabilité, le confort, le luxe et la commodité. Établir de nouvelles normes pour les voyages durables tout en offrant un niveau de confort et de commodité inégalé.",
    INNOVATE_MISSION:
      "Notre mission est de fournir à nos clients des solutions de transfert aéroport luxueuses et respectueuses de l'environnement, combinant des véhicules à la pointe de la technologie avec un service client exceptionnel pour garantir une expérience de voyage fluide de l'aéroport à la destination. une flotte de chauffeurs professionnels, compétents et bien élevés.",
    INNOVATE_APPROACH:
      "Notre équipe de chauffeurs professionnels, compétents et courtois, comprend les exigences spécifiques des voyages en Alpes et assure des transferts agréables, ponctuels et fluides du début à la fin, même dans les conditions hivernales les plus difficiles. Nous vous assurons un accès facile à votre destination enneigée. Que vous voyagiez seul, en famille, en groupe, pour le plaisir ou pour les affaires, nous sommes là pour rendre votre transfert aussi agréable et serein que possible, vous permettant de vous concentrer sur l'aventure qui vous attend dans les montagnes alpines à couper le souffle.",
    PRIORITY: "Nos clients sont notre priorité absolue",
    PRIORITY_MISSION:
      "Fournir des services haut de gamme à des prix très abordables",
    PRIORITY_APPROACH: "sécurité et confort",
    QUALITY: "La qualité est au cœur de tout ce que nous faisons",
    QUALITY_MISSION:
      "Présentation de véhicules de haute technologie et respectueux de l'environnement",
    QUALITY_APPROACH: "Suivi des disponibilités des circuits",
    BEST: "Chaque véhicule quitte le service d'entretien dans son plus bel état",
    BEST_MISSION:
      "Prise en charge et dépôt professionnels et transferts fluides vers la destination",
    BEST_APPROACH: "Une balade flexible et divertissante",
  },
  en: {
    HEADING: "vision mission",
    DESCRIPTION:
      "Our customer's safety, comfort, Luxury and satisfaction are our top priorities.",
    VISION_TITLE: "our vision",
    SUBTITLE: "Pioneering excellence in car transfer services",
    SUBTITLE_MISSION: "Where Luxury meets Excellence",
    SUBTITLE_Approach: "Understanding Your Needs, Continuous Improvement",
    INNOVATE:
      "Alpen Getaway aims to become the leading provider of luxurious and eco-friendly transfer services across the Alpen region, emphasizing sustainability, comfort, luxurious and convenience. Setting new standards for sustainable travel while offering an unmatched level of comfort and convenience.",
    PRIORITY: "Our customers are our top priority",
    QUALITY: "Quality is at the heart of everything we do",
    BEST: "Every vehicle leaves care looking its absolute best",
    INNOVATE_MISSION:
      "Our mission is to provide our customers with luxurious and eco friendly airport transfer solutions, combining state-of-the-art vehicles with exceptional customer service to ensure a seamless travel experience from airport to destination. a fleet of professional Chauffeur's, well versed & mannered.",
    PRIORITY_MISSION:
      "To provide high class services at very affordable prices",
    QUALITY_MISSION: "Introducing high tech and Eco-Friendly vehicles",
    BEST_MISSION:
      "Professional pick & drop and smooth transfers to destination",
    INNOVATE_APPROACH:
      "Our team of professional Chauffeurs, knowledgeable and courteous about the unique demands of alpen travel, ensure pleasant, timely and seamless transfers from start to finish, even in the toughest winter conditions. We are ensuring you reach your snowy getaway with ease. Whether you're traveling solo, with family, or in a group for pleasure or for business, we are here to make your transfer experience as enjoyable and stress-free as possible, allowing you to focus on the adventure that awaits in the breathtaking Alpine mountains.",
    PRIORITY_APPROACH: "safety and comfort",
    QUALITY_APPROACH: "Tours Tracking availability",
    BEST_APPROACH: "Flexible and entertaining ride",
  },
});

langHelper.setLanguage(strings);
export { strings };
