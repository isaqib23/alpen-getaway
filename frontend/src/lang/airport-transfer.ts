import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
    fr: {
        SECTION_TITLE: "Transferts Aéroport",
        SECTION_SUBTITLE: "Des transferts aéroport fiables vers les principales destinations",
        SECTION_DESCRIPTION: "Profitez de nos services de transfert premium vers et depuis les principaux aéroports. Nos chauffeurs professionnels vous garantissent un voyage confortable et ponctuel.",
        SALZBURG_TITLE: "Aéroport de Salzburg",
        SALZBURG_DESCRIPTION: "Transferts directs vers le centre historique de Salzburg et les stations de ski alpines.",
        MUNICH_TITLE: "Aéroport de Munich",
        MUNICH_DESCRIPTION: "Connexions rapides vers la Bavière et les destinations autrichiennes.",
        INNSBRUCK_TITLE: "Aéroport d'Innsbruck",
        INNSBRUCK_DESCRIPTION: "Accès direct aux stations de ski du Tyrol et aux Alpes autrichiennes.",
        ZURICH_TITLE: "Aéroport de Zurich",
        ZURICH_DESCRIPTION: "Transferts de luxe vers la Suisse et l'Autriche occidentale.",
        BOOK_NOW: "Réserver maintenant",
        VIEW_DETAILS: "Voir les détails"
    },
    en: {
        SECTION_TITLE: "Airport Transfers",
        SECTION_SUBTITLE: "Reliable airport transfers to major destinations",
        SECTION_DESCRIPTION: "Experience our premium transfer services to and from major airports. Our professional drivers ensure a comfortable and punctual journey every time.",
        SALZBURG_TITLE: "Salzburg Airport",
        SALZBURG_DESCRIPTION: "Direct transfers to Salzburg's historic center and alpine ski resorts.",
        MUNICH_TITLE: "Munich Airport",
        MUNICH_DESCRIPTION: "Fast connections to Bavaria and Austrian destinations.",
        INNSBRUCK_TITLE: "Innsbruck Airport",
        INNSBRUCK_DESCRIPTION: "Direct access to Tyrolean ski resorts and Austrian Alps.",
        ZURICH_TITLE: "Zurich Airport",
        ZURICH_DESCRIPTION: "Luxury transfers to Switzerland and Western Austria.",
        BOOK_NOW: "Book now",
        VIEW_DETAILS: "View details"
    },
    de: {
        SECTION_TITLE: "Flughafentransfers",
        SECTION_SUBTITLE: "Zuverlässige Flughafentransfers zu wichtigen Zielen",
        SECTION_DESCRIPTION: "Erleben Sie unsere Premium-Transferdienste zu und von wichtigen Flughäfen. Unsere professionellen Fahrer sorgen jedes Mal für eine komfortable und pünktliche Fahrt.",
        SALZBURG_TITLE: "Flughafen Salzburg",
        SALZBURG_DESCRIPTION: "Direkte Transfers zum historischen Zentrum von Salzburg und alpinen Skigebieten.",
        MUNICH_TITLE: "Flughafen München",
        MUNICH_DESCRIPTION: "Schnelle Verbindungen nach Bayern und österreichischen Zielen.",
        INNSBRUCK_TITLE: "Flughafen Innsbruck",
        INNSBRUCK_DESCRIPTION: "Direkter Zugang zu Tiroler Skigebieten und den österreichischen Alpen.",
        ZURICH_TITLE: "Flughafen Zürich",
        ZURICH_DESCRIPTION: "Luxustransfers in die Schweiz und nach Westösterreich.",
        BOOK_NOW: "Jetzt buchen",
        VIEW_DETAILS: "Details anzeigen"
    },
    it: {
        SECTION_TITLE: "Trasferimenti Aeroportuali",
        SECTION_SUBTITLE: "Trasferimenti aeroportuali affidabili verso le principali destinazioni",
        SECTION_DESCRIPTION: "Vivi i nostri servizi di trasferimento premium da e verso i principali aeroporti. I nostri autisti professionali garantiscono un viaggio confortevole e puntuale ogni volta.",
        SALZBURG_TITLE: "Aeroporto di Salisburgo",
        SALZBURG_DESCRIPTION: "Trasferimenti diretti al centro storico di Salisburgo e alle stazioni sciistiche alpine.",
        MUNICH_TITLE: "Aeroporto di Monaco",
        MUNICH_DESCRIPTION: "Collegamenti veloci verso la Baviera e le destinazioni austriache.",
        INNSBRUCK_TITLE: "Aeroporto di Innsbruck",
        INNSBRUCK_DESCRIPTION: "Accesso diretto alle stazioni sciistiche tirolesi e alle Alpi austriache.",
        ZURICH_TITLE: "Aeroporto di Zurigo",
        ZURICH_DESCRIPTION: "Trasferimenti di lusso verso la Svizzera e l'Austria occidentale.",
        BOOK_NOW: "Prenota ora",
        VIEW_DETAILS: "Vedi dettagli"
    },
});

langHelper.setLanguage(strings);
export { strings };
