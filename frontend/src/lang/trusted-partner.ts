import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
    fr: {
        SUBTITLE: "À propos de nous",
        TITLE: "Votre partenaire de confiance pour la",
        TITLE_HIGHLIGHT: "location de voiture fiable",
        EASY_BOOKING_TITLE: "Processus de réservation facile - Interface conviviale",
        EASY_BOOKING_DESC: "Nous avons optimisé le système de réservation pour mobile, tablette et PC afin que nos clients puissent vivre l'expérience la plus simple et la plus sûre",
        EASY_BOOKING_STATUS: "Nous avons un système de réservation de transfert très simple, confortable et accessible sur le marché",
        CONVENIENT_TITLE: "Processus de prise en charge et de retour pratique",
        CONVENIENT_DESC: "Nous avons simplifié le processus de réservation pour que notre client puisse choisir facilement ses destinations préférées",
        ADDITIONAL_SERVICES: "Nous offrons des sièges enfants gratuits, des équipements pour personnes spéciales, des équipements de ski, une annulation gratuite, des services gratuits de gestion des réservations et bien plus encore..."
    },
    en: {
        SUBTITLE: "About Us",
        TITLE: "Your trusted partner in",
        TITLE_HIGHLIGHT: "reliable car rental",
        EASY_BOOKING_TITLE: "Easy Booking Process - User Friendly Interface",
        EASY_BOOKING_DESC: "We have optimized the booking system to mobile, tablet & Pcs so that our clients can experience the easiest and the safest way",
        EASY_BOOKING_STATUS: "We have a very simple, comfortable & accessible Transfer Booking system in the Market",
        CONVENIENT_TITLE: "Convenient Pick-Up & Return Process",
        CONVENIENT_DESC: "We have simplified the booking process so that our client can pick their chosen destinations easily",
        ADDITIONAL_SERVICES: "We offer free child seats, Special person Equipments, Ski Equipments, free cancellation, free booking management services & much more..."
    },
    de: {
        SUBTITLE: "Über uns",
        TITLE: "Ihr vertrauensvoller Partner für",
        TITLE_HIGHLIGHT: "zuverlässige Autovermietung",
        EASY_BOOKING_TITLE: "Einfacher Buchungsvorgang - Benutzerfreundliche Oberfläche",
        EASY_BOOKING_DESC: "Wir haben das Buchungssystem für Mobile, Tablet und PCs optimiert, damit unsere Kunden den einfachsten und sichersten Weg erleben können",
        EASY_BOOKING_STATUS: "Wir haben ein sehr einfaches, komfortables und zugängliches Transfer-Buchungssystem auf dem Markt",
        CONVENIENT_TITLE: "Bequemer Abhol- und Rückgabeprozess",
        CONVENIENT_DESC: "Wir haben den Buchungsprozess vereinfacht, damit unser Kunde seine gewünschten Ziele einfach auswählen kann",
        ADDITIONAL_SERVICES: "Wir bieten kostenlose Kindersitze, Spezialausrüstung für besondere Personen, Skiausrüstung, kostenlose Stornierung, kostenlose Buchungsverwaltungsdienste und vieles mehr..."
    },
    it: {
        SUBTITLE: "Chi siamo",
        TITLE: "Il tuo partner affidabile per",
        TITLE_HIGHLIGHT: "noleggio auto affidabile",
        EASY_BOOKING_TITLE: "Processo di prenotazione facile - Interfaccia user-friendly",
        EASY_BOOKING_DESC: "Abbiamo ottimizzato il sistema di prenotazione per mobile, tablet e PC in modo che i nostri clienti possano vivere il modo più semplice e sicuro",
        EASY_BOOKING_STATUS: "Abbiamo un sistema di prenotazione trasferimenti molto semplice, comodo e accessibile sul mercato",
        CONVENIENT_TITLE: "Processo di ritiro e restituzione conveniente",
        CONVENIENT_DESC: "Abbiamo semplificato il processo di prenotazione in modo che il nostro cliente possa scegliere facilmente le destinazioni preferite",
        ADDITIONAL_SERVICES: "Offriamo seggiolini per bambini gratuiti, attrezzature per persone speciali, attrezzature da sci, cancellazione gratuita, servizi gratuiti di gestione prenotazioni e molto altro..."
    },
});

langHelper.setLanguage(strings);
export { strings };
