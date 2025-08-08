import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    HEADING: "regarder la vidéo complète",
    DESCRIPTION:
      "Découvrez la facilité et la commodité d'explorer la région alpine de l'Europe avec nous",
  },
  en: {
    HEADING: "watch full video",
    DESCRIPTION:
      "Discover the ease and convenience of exploring the alpen region of Europe with Us",
  },
});

langHelper.setLanguage(strings);
export { strings };
