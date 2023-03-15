import {promesseConnexion} from './connexion.js';

export const getTodos = async () => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all('SELECT * FROM todo');

    return resultat;
}

export const addTodo = async (texte) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.run(
        `INSERT INTO todo (texte, est_coche)
        VALUES (?, 0)`,
        [texte]
    );

    return resultat.lastID;
}

export const checkTodo = async (id) => {
    let connexion = await promesseConnexion;

    await connexion.run(
        `UPDATE todo
        SET est_coche = NOT est_coche
        WHERE id_todo = ?`,
        [id]
    )
}