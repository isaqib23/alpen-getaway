import LocalizedStrings from "react-localization";
import * as langHelper from "../common/langHelper";

const strings = new LocalizedStrings({
  fr: {
    DESCRIPTION: "Entrez vos coordonnées pour vous connecter.",
    SIGN_IN: "Se connecter",
    NO_ACCOUNT: "Vous n’avez pas encore de compte ?",
    SIGN_UP: "S'inscrire",
    ERROR_IN_SIGN_IN: "E-mail ou mot de passe incorrect.",
    IS_BLACKLISTED: "Votre compte est suspendu.",
    RESET_PASSWORD: "Mot de passe oublié?",
    STAY_CONNECTED: "Rester connecté",
    EMAIL: "E-mail",
    EMAIL_PLACEHOLDER: "Entrez votre email",
    PASSWORD: "Mot de passe",
    PASSWORD_PLACEHOLDER: "Entrez votre mot de passe",
  },
  en: {
    DESCRIPTION: "Enter your details to sign in.",
    SIGN_IN: "Sign In",
    NO_ACCOUNT: "Don’t have an account yet?",
    SIGN_UP: "Sign Up",
    ERROR_IN_SIGN_IN: "Incorrect email or password.",
    IS_BLACKLISTED: "Your account is suspended.",
    RESET_PASSWORD: "Forgot Password?",
    STAY_CONNECTED: "Stay signed in",
    EMAIL: "Email",
    EMAIL_PLACEHOLDER: "Enter Your Email",
    PASSWORD: "Password",
    PASSWORD_PLACEHOLDER: "Enter Your Password",
  },
});

langHelper.setLanguage(strings);
export { strings };
