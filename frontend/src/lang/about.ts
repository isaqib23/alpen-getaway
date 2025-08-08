import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    ABOUT: "Des services simples et fiables dans le secteur des réservations",
    ABOUT_MAIN:
      "Si vous voulez en savoir plus sur nous, alors explorez-nous !!",
    HEADING:
      "Votre partenaire de confiance en matière de location de voiture fiable",

    DESCRIPTION:
      "Bienvenue chez notre service de transport aéroportuaire haut de gamme, spécialisé dans les transferts fluides vers la magnifique région des Alpes (Autriche, Italie, Allemagne et Suisse). Avec notre engagement envers un service client exceptionnel et notre souci du confort,",
    SIMPLE:
      "Nous avons un système de réservation de transfert très simple, confortable et accessible sur le marché",
    EASE: "interface conviviale",
    OPTIMIZED:
      "Nous avons optimisé le système de réservation pour mobile, tablette et PC afin que nos clients puissent en faire l'expérience de la manière la plus simple et la plus sûre.",
    CONVENIENT: "processus pratique de ramassage et de retour",
    SIMPLIFIED:
      "Nous avons simplifié le processus de réservation afin que nos clients puissent choisir facilement leurs destinations préférées",
    ACCOMODATION: "Hébergement gratuit",
    FREE: "Nous proposons des sièges enfants gratuits, des équipements spéciaux pour personnes, des équipements de SKI, des annulations gratuites, des services de gestion de réservation gratuits et bien plus encore....",
    CONTACT: "Contactez-nous",
    PARA1:
      "Nous comprenons l'importance de voyager en toute sérénité, c'est pourquoi nous privilégions la ponctualité et le confort à chaque trajet. Notre plateforme offre un large choix de transferts, depuis les principaux aéroports comme Innsbruck, Munich, Zurich et Salzbourg jusqu'aux stations de ski et hôtels de renommée mondiale des Alpes.",
    PARA2:
      "Nous sommes fiers de notre compréhension approfondie des besoins uniques des passionnés de voyages. Nous sommes la seule entreprise à offrir des services VVIP à nos prestigieux clients d'affaires du monde entier qui se rendent dans la région d'Alpen. Ces services comprennent un accueil personnalisé à l'arrivée dans les aéroports, avec un accueil professionnel assuré par nos représentants de l'entreprise, munis du tableau d'affichage et des directives Alpen Getaway Flex.",
  },
  en: {
    ABOUT: "Easy & Reliable Services in the Booking Industry",
    ABOUT_MAIN: "If you want to learn about us, then Explore us!!",
    HEADING: "Your trusted partner in reliable car rental",
    DESCRIPTION:
      "Welcome to our premier airport transportation service, specializing in seamless transfers to the stunning region of Alps (Austria, Italy, Germany & Switzerland). With a commitment to exceptional customer service and a focus on convenience,",
    SIMPLE:
      "We have very simple, comfortable & accessible Transfer Booking system in the Market",
    EASE: "user friendly interface",
    OPTIMIZED:
      "We have optimized the booking system to mobile, tablet and PCs so that our clients can experience the easiest and safest way.",
    CONVENIENT: "convenient pick-up & return process",
    SIMPLIFIED:
      "We have simplified the booking process so that our client can pick their chosen destinations easily",
    ACCOMODATION: "Free Accommodation",
    FREE: "We offer free child seats, Special person Equipments, SKI Equipments, free cancellations, free booking management services and much more....",
    CONTACT: "contact us",
    PARA1:
      "We understand the importance of hassle-free travel, which is why we prioritize punctuality and comfort in every ride. Our platform offers a wide range of transfer options, from major airports such as Innsbruck, Munich, Zurich and Salzburg to world-renowned ski destinations & Hotels across Mountainous Alps Region.",
    PARA2:
      "We pride ourselves on our deep understanding of the unique needs of Travel enthusiasts. We are the sole company that will provide VVIP services to our prestigious Business Customers around the world coming to Alpen region. These services include Airports special receiving on arrivals with professional manner of welcoming through our Company representatives with Alpen Getaway Flex Board and directives.",
  },
});

langHelper.setLanguage(strings);
export { strings };
