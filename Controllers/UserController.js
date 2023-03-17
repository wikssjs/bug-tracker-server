import { getAllUsers,editUserModel,addUserModel, getUserByEmail } from '../model/utilisateur.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';


export const getUsers = async (req, res) => {
    res.status(200).json({
        users: await getAllUsers(),
    });
}


export const EditUser = async (req, res) => {
    await editUserModel(req.body.id,req.body.nom, req.body.prenom,req.body.username, req.body.email, req.body.role);
    res.status(201).end();
}

export const getCurrentUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
  try {
    const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
    const userEmail = decodedToken.email;
    const currentUser = await getUserByEmail(userEmail); // This is a hypothetical function to retrieve the user from a database
    console.log(currentUser);
    res.json(currentUser);
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export const createUser = async (request, response,next) => {
       // Valider les données reçu du client
       if(true) {
        try {
            await addUserModel(request.body.firstname,request.body.lastname,request.body.email, request.body.username, request.body.password);
            response.status(201).end();
        }
        catch(error) {
            if(error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
}


export const logUser = async (request, response,next) => {
   // Valider les données reçu du client
   if(true) {
    passport.authenticate('local', (error, utilisateur, info) => {
        if(error) {
            next(error);
        }
        else if(!utilisateur) {
            response.status(401).json(info);
        }
        else {
            request.logIn(utilisateur, (error) => {
                if(error) {
                    next(error);
                }
                else {
                    const token = jwt.sign({email:utilisateur.email}, process.env.SESSION_SECRET, {expiresIn: '1h'});
                    response.status(200).json({token});
                }
            });
        }
    })(request, response, next);
}
else {
    response.status(400).end();
}}


export const logOutUser = async (request, response,next) => {
    request.logOut((error) => {
        if(error) {
            next(error);
        }
        else {
            response.status(200).end();
     }
    });
}