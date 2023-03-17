import 'dotenv/config';
import express, { json } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import middlewareSse from './middleware-sse.js';
import { getTodos, addTodo, checkTodo } from './model/todo.js';
import { validateContact } from './validation.js';
import './authentification.js';
import {createUser,logUser,logOutUser, EditUser, getUsers,getCurrentUser } from './Controllers/UserController.js';
import { addProject, editProject, getDonnees, getProjectById, getAllProjects} from './Controllers/DataController.js';
import { getTickets, addTicket,addMember,deleteMember,getTicketById,editTicket, 
        getCommentsByTicketId,deleteComment,addComment} from './Controllers/TicketController.js';
// Création du serveur web
let app = express();


const validateApiKey = (req, res, next) => {
    console.log(req.get('authorization'));

    if(req.get('authorization')) {
    const apiKey = req.get('authorization').split(' ')[0];
    if (!apiKey || apiKey !== 'ksklkweiowekdl908w03iladkl') {
      return res.status(401).json({ message: 'Invalid API key' });
    }
    }
    next();
  };


// Créer le constructeur de base de données
const MemoryStore = memorystore(session);

// Ajout de middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(compression());
app.use(json());
app.use(validateApiKey);
app.use(session({
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie:{secure:true, maxAge: 86400000},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());

// // Define a middleware function to protect routes
// function withAuth(req, res, next) {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         res.redirect('/connexion');
//     } else {
//       try {
//         const decodedToken = jwt.verify(token, process.env.SESSION_SECRET); // Verify the token
//         req.user = decodedToken; // Store the user object in the request object
//         next(); // Call the next middleware or route handler
//       } catch (error) {
//         res.redirect('/connexion');
//       }
//     }
//   }

// Programmation de routes
app.get('/', getDonnees);
app.get('projects',getAllProjects);

app.get("/users",getUsers);
app.put('/edit-user',EditUser);

app.post('/add-project', addProject);

app.put('/edit-project', editProject);

app.post('/project/add-members',addMember);

app.delete('/project/delete-member',deleteMember);


app.get('/project/:id', getProjectById);

app.get('/tickets',getTickets);
app.post('/add-ticket',addTicket);
app.get('/ticket',getTicketById);
app.put('/edit-ticket',editTicket);

app.get('/ticket/comments',getCommentsByTicketId);
app.post('/ticket/comment/',addComment);
app.delete('/ticket/comment/delete',deleteComment);

app.get('/user',getCurrentUser);
app.post('/user/register', createUser);
app.post('/user/login', logUser);
app.post('/user/logout', logOutUser);


app.get('/apropos', (request, response) => {
    if(request.session.countAPropos === undefined) {
        request.session.countAPropos = 0;
    }

    request.session.countAPropos++;

    response.render('apropos', {
        titre: 'À propos',
        user: request.user,
        accept: request.session.accept,
        count: request.session.countAPropos
    });
})

app.get('/contact', (request, response) => {
    if(request.session.countContact === undefined) {
        request.session.countContact = 0;
    }

    request.session.countContact++;

    response.render('contact', {
        titre: 'Contact',
        styles: ['/css/contact.css'],
        scripts: ['/js/contact.js'],
        user: request.user,
        accept: request.session.accept,
        count: request.session.countContact
    });
});

app.get('/inscription', (request, response) => {
    response.render('authentification', {
        titre: 'Inscription',
        scripts: ['/js/inscription.js'],
        user: request.user,
        accept: request.session.accept
    });
});

app.get('/connexion', (request, response) => {
    response.render('authentification', {
        titre: 'Connexion',
        scripts: ['/js/connexion.js'],
        user: request.user,
        accept: request.session.accept
    });
});

app.post('/api/todo', async (request, response) =>{
    if(!request.user){
        response.status(401).end();
    }
    else if(request.user.acces <= 0){
        response.status(403).end();
    }
    else {
        let id = await addTodo(request.body.texte);
        response.status(201).json({id: id});
        response.pushJson({
            id: id,
            texte: request.body.texte
        }, 'add-todo');
    }
});

app.patch('/api/todo', async (request, response) => {
    if(!request.user){
        response.status(401).end();
    }
    else {
        await checkTodo(request.body.id);
        response.status(200).end();
        response.pushJson({
            id: request.body.id
        }, 'check-todo');
    }
});

app.post('/api/contact', (request, response) => {
    if(validateContact(request.body)){
        console.log(request.body);
        response.status(200).end();
    }
    else {
        console.log(request.body);
        response.status(400).end();
    }
});

app.get('/stream', (request, response) => {
    if(request.user) {
        response.initStream();
    }
    else {
        response.status(401).end();
    }
});

app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
});

app.post('/connexion',logUser);

app.post('/deconnexion', logOutUser);

// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré: http://localhost:' + process.env.PORT);
