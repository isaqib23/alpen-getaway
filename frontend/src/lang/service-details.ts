import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HELP: "Besoin d'aide?",
    EVERYTIME: "Nous sommes là pour vous 24h/24 et 7j/7",
    CONTACT: "Contactez-nous maintenant",
    AIRPORT_LINK: "transfert aéroport",
    AIRPORT_TITLE: "Transfert aéroport rapide et fluide",
    AIRPORT_PARAGRAPHS: [
      "Alpen Getaway dispose d'un système de transfert aéroport performant. Nos propres représentants sont présents dans les aéroports pour accueillir nos clients à leur arrivée.",
      "En tant que voyageur, votre priorité après votre arrivée à l'aéroport est d'atteindre votre destination sans problème. C'est pourquoi nous avons créé un système de transfert intelligent et rapide, qui suit les vols de nos clients grâce à leur numéro de vol. Ainsi, nous contrôlons entièrement leur arrivée afin d'éviter tout retard lors de leur prise en charge par les chauffeurs à l'aéroport et inversement lors de leur départ.",
      "Nous avons une méthode unique pour accueillir nos clients réguliers, nos clients professionnels et nos clients VIP (stars, influenceurs, vlogueurs, joueurs). En collaboration avec les autorités aéroportuaires, nous pouvons organiser la prise en charge des VIP depuis leurs ascenseurs de jets privés ou affrétés.",
    ],
    ECONOMY_LINK: "services économiques",
    ECONOMY_TITLE: "Des transferts de qualité à des prix abordables",
    ECONOMY_PARAGRAPHS: [
      "Alpen Getaway offre non seulement des services de qualité à nos précieux clients, mais prend également en compte en profondeur votre budget de vacances et propose des prix compétitifs sur le marché, afin que vous ne vous souciez pas du budget de transfert.",
      "Notre mission est de proposer à nos clients des vacances abordables et à petit budget. Nous pensons que chacun mérite les meilleures vacances et qu'il est important de ne pas les manquer ou de les annuler à cause des coûts de transport élevés.",
    ],
    BUSINESS_LINK: "transferts d'entreprise",
    BUSINESS_TITLE: "Transferts confortables et fiables vers les entreprises",
    BUSINESS_PARAGRAPHS: [
      "Si vous recherchez des services de classe affaires, vous êtes au bon endroit. Nous proposons des véhicules de classe affaires avec chauffeurs professionnels. Nous vous offrons une collation légère pendant le trajet pour que vous arriviez à destination l'esprit tranquille. Nous vous accompagnons à l'heure depuis l'aéroport pour ne manquer aucun rendez-vous d'affaires important.",
    ],
    VIP_LINK: "transfert VIP",
    VIP_TITLE: "Aplen Getaway valorise vos standards",
    VIP_PARAGRAPHS: [
      "Vous amener à vos destinations avec protocole, luxe et confort ultime est notre priorité absolue.",
      "Un trajet agréable, rafraîchissant et divertissant jusqu'à votre destination, avec nos véhicules luxueux et de haute technologie, nous offrons des services de prise en charge et de dépôt prioritaires.",
    ],
    PRIVATE_LINK: "transfert privé",
    PRIVATE_TITLE:
      "Laissez-nous vous emmener à vos réunions et séminaires à l'heure.",
    PRIVATE_PARAGRAPHS: [
      "Alpen Getaway ne limite pas ses services au transport aéroportuaire mais propose également ses services pour vos événements spéciaux, tels que les réunions d'affaires, les mariages, les visites familiales et les visites d'entreprise.",
      "Faites appel à nos services dès maintenant et confiez le reste de votre transport pour vos événements spéciaux à notre équipe professionnelle. Votre confiance vous permettra d'atteindre vos objectifs.",
    ],
    FLEXIBLE_LINK: "options de paiement flexibles",
    FLEXIBLE_TITLE: "Payez comme vous le souhaitez",
    FLEXIBLE_PARAGRAPHS: [
      "Afin de répondre aux besoins de notre clientèle internationale, nous proposons plusieurs options de paiement hautement sécurisées, notamment les paiements en ligne via la section réservation de notre site web, dans différentes devises.",
      "Nous proposons également des options de paiement à bord : cartes de crédit/débit et espèces. Quel que soit votre moyen de paiement, vous recevrez votre facture au format numérique et physique.",
      "Nous croyons qu’il est important d’apporter de la facilité à nos précieux clients de toutes les manières possibles.",
    ],
    LIVE_LINK: "Suivi des trajets en direct (GPS)",
    LIVE_TITLE:
      "Gardez votre sécurité et atteignez votre destination en toute transparence",
    LIVE_PARAGRAPHS: [
      "Nous suivons votre trajet pour que vous arriviez à destination en toute sécurité et en toute sérénité. Nous surveillons la vitesse des véhicules en temps réel et proposons des alternatives en cas de forte affluence.",
      "Si vous êtes une entreprise ou une organisation et que vous réservez des courses pour vos clients via notre plateforme, nous pouvons, sur demande et selon les disponibilités, partager les détails de suivi en direct du parcours de votre client.",
    ],
    ROADSIE_LINK: "Assistance routière",
    ROADSIE_TITLE: "Assistance en voyage pour gagner du temps",
    ROADSIE_PARAGRAPHS: [
      "En cas d'incidents inattendus survenant pendant votre voyage, nous avons le plan de secours avec nous pour organiser votre trajet.",
      "Avant le début de chaque trajet, nous laissons nos véhicules passer par un protocole de contrôle Ready2ride et après cela, les systèmes permettent à ce véhicule de partir en balade.",
      "Alors, atteindre votre destination en toute sécurité et avec confort est notre priorité !",
    ],
    CHAUFFEUR_LINK: "services de chauffeur",
    CHAUFFEUR_TITLE: "Luxe avec professionnalisme",
    CHAUFFEUR_PARAGRAPHS: [
      "Alpen Getaway croit en l'offre d'un service de chauffeur professionnel à ses précieux clients.",
      "Nous avons mis en place un système de prise en charge simple et intelligent pour nos chauffeurs, afin que nos clients n'aient pas à attendre à leur arrivée. Nos chauffeurs sont bien formés, expérimentés, bien élevés et bilingues pour une communication fluide.",
    ],
  },
  en: {
    HELP: "Need Help?",
    EVERYTIME: "We are here for you 24/7",
    CONTACT: "Contact Now",
    AIRPORT_LINK: "airport transfer",
    AIRPORT_TITLE: "Quick & Seamless Airport Transfer",
    AIRPORT_PARAGRAPHS: [
      "Alpen Getaway have a proper Airport Transfer system, we have our own representatives in airports to welcome and receive our honorable customers on their arrivals.",
      "As a traveler your priority after arrival on airport is that you have to reach your destination seamlessly, so keeping this understanding in mind, we have created a smart and quick transfer system, where we track the Flights of customers through their given flight number. As a result, we completely control their arrival so that our customers avoid delays in their picking at the airport by the drivers and vice versa upon departure.",
      "We have a unique way of receiving our normal customers, Business customers & VIP Customers (Stars, Influencers, Vloggers, Players), with the proper cooperation with the airport's authorities, we can arrange to pick the VIP´s from their private Jet/chartered Jets elevators.",
    ],
    ECONOMY_LINK: "economy services",
    ECONOMY_TITLE: "Quality transfers at affordable prices",
    ECONOMY_PARAGRAPHS: [
      "Alpen Getaway not only offer quality services to our valued customers but also deeply considers your holidays budget and offer market competitive prices, so that you do not stress about transfer budget.",
      "With minimum budget and affordable holidays to our customers is our mission. We think everyone deserves the best holidays trips and they should not miss out or cancel their trips due to high transportations costs.",
    ],
    BUSINESS_LINK: "business transfers",
    BUSINESS_TITLE:
      "Comfortable and reliable transfers to the Business Enterprises",
    BUSINESS_PARAGRAPHS: [
      "If you are looking for Business Class Services, then you are on the right Platform. We offer Business Class Vehicles with professional Chauffeurs. We offer light refreshment during your ride, so you can arrive with peace of mind to your destination. On time pick & drop from airports so you don't miss out any of your important Business meetings.",
    ],
    VIP_LINK: "vip transfer",
    VIP_TITLE: "Aplen Getaway values your standards",
    VIP_PARAGRAPHS: [
      "Getting you to your destinations with protocol, Luxury and ultimate comfort is our utmost priority.",
      "Enjoyable, refreshing and entertaining ride across the way until you reach your destination, with our high-tech, Luxurious vehicles, we offer priority pick & drop services.",
    ],
    PRIVATE_LINK: "private transfer",
    PRIVATE_TITLE: "Let us take you to your meetings and seminars at the time.",
    PRIVATE_PARAGRAPHS: [
      "Alpen Getaway not restricting its services to airport transportation but also offering its services for your special events, such as going to the Business meetings, wedding occasions, family tours & corporate tours.",
      "Avail our services now and let our professional team handle the rest of your special events transportation. Your trust in us in this regard will give you feelings of achieving your event's goal.",
    ],
    FLEXIBLE_LINK: "flexible payment options",
    FLEXIBLE_TITLE: "Pay the way you want",
    FLEXIBLE_PARAGRAPHS: [
      "Keeping our international clients in view, we are introducing multiple payment options through very secure ways. It includes payments online on our website booking section with different currencies.",
      "Besides this we offer on-board payment options, that are through Credit/Debit cards and Cash. If you pay us by any means, at the end you will receive the invoice both in digital and physical form.",
      "We believe in providing ease to our valued customers in every possible way.",
    ],
    LIVE_LINK: "Live Rides (GPS) Tracking",
    LIVE_TITLE: "Keep you safe and reach your destination seamlessly",
    LIVE_PARAGRAPHS: [
      "We track your journey so that you reach your destination safely and secure as smoothly as possible. We monitor live vehicles speed and alternative ways in case of busy roads.",
      "If you are a company or organization and you are booking ride for your customers through our platform, then upon request & allowance, we can share the live tracking details of your customer´s journey",
    ],
    ROADSIE_LINK: "Roadside Assistance",
    ROADSIE_TITLE: "In-Travel assistance to save your time",
    ROADSIE_PARAGRAPHS: [
      "In case of unexpected incidents occurring during your journey then we have the backup plan with us to accommodate your ride.",
      "Before every ride starts, we let our vehicles go through a ready2ride check protocol & after that systems allow that vehicle to go for a ride.",
      "So, reaching your destinations safely & with comfort is our priority!",
    ],
    CHAUFFEUR_LINK: "chauffeur services",
    CHAUFFEUR_TITLE: "Luxury with Professionalism",
    CHAUFFEUR_PARAGRAPHS: [
      "Alpen Getaway believes in offering a professional chauffeur service to their valued customers.",
      "We have created a smart & easy pick & drop system for our chauffeurs, so that customers do not wait at their arrival points. Our chauffeurs are well trained, well versed, well mannered & bilingual for smooth communication.",
    ],
  },
});

langHelper.setLanguage(strings);
export { strings };
