import pkg from "bcryptjs";
import passport from 'passport';
import { Strategy } from "passport-local";
import { getUserByEmail } from "./model/utilisateur.js";

const { compare } = pkg;

let config = {
    usernameField: 'email',
    passwordField: 'password'
}

passport.use(new Strategy(config, async (email, password, done) => {
    try {
        let utilisateur = await getUserByEmail(email);

        if(!utilisateur) {
            return done(null, false, { erreur: 'erreur_nom_utilisateur' });
        }

        let valide = await compare(password, utilisateur.password);

        if(!valide) {
            return done(null, false, { erreur: 'erreur_mot_de_passe' });
        }

        return done(null, utilisateur);
    }
    catch(error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.email);
});

passport.deserializeUser(async (email, done) => {
    try {
        let utilisateur = await getUserByEmail(email);
        done(null, utilisateur);
    }
    catch(error) {
        done(error);
    }
});
