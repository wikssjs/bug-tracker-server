import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { existsSync } from 'fs';

let promesseConnexion = open({
  filename: process.env.DB_FILE,
  driver: sqlite3.Database
});

if (!existsSync(process.env.DB_FILE)) {
  promesseConnexion = promesseConnexion.then((connexion) => {
    connexion.exec(
      `CREATE TABLE IF NOT EXISTS todo (
            id_todo INTEGER PRIMARY KEY,
            texte TEXT NOT NULL,
            est_coche INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS utilisateur (
            id_utilisateur INTEGER PRIMARY KEY,
            nom_utilisateur TEXT NOT NULL UNIQUE,
            mot_de_passe TEXT NOT NULL,
            acces INTEGER NOT NULL
        );
        
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            is_admin INTEGER NOT NULL
          );

          CREATE TABLE projects (
            id INTEGER PRIMARY KEY ,
            name TEXT NOT NULL,
            description TEXT
          );
          
          Create table project_user (
            id INTEGER PRIMARY KEY,
            project_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (project_id) REFERENCES projects (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
          );
          
          CREATE TABLE tickets (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL,
            priority TEXT NOT NULL,
            project_id INTEGER NOT NULL,
            reported_by INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id),
            FOREIGN KEY (reported_by) REFERENCES users (id)
          );

          CREATE TABLE ticket_user (
            id INTEGER PRIMARY KEY,
            ticket_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (ticket_id) REFERENCES tickets (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
          );

          CREATE TABLE comments (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            ticket_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticket_id) REFERENCES tickets (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
          );

          INSERT INTO projects (name, description) VALUES ('React', 'A JavaScript library for building user interfaces');
          INSERT INTO projects (name, description) VALUES ('Django', 'A high-level Python web framework');
          INSERT INTO projects (name, description) VALUES ('TensorFlow', 'An open-source machine learning library');
          INSERT INTO projects (name, description) VALUES ('Vue.js', 'A progressive JavaScript framework for building user interfaces');
          INSERT INTO projects (name, description) VALUES ('Spring Boot', 'An open-source Java-based framework for building web applications and microservices');
          

          INSERT INTO users (nom,prenom,username, email, password, is_admin) VALUES ('John','Doe','johndoe', 'johndoe@example.com', 'password123', 0);
          INSERT INTO users (nom,prenom,username, email, password, is_admin) VALUES ('Jane','Doe','janedoe', 'janedoe@example.com', 'password456', 0);
          INSERT INTO users (nom,prenom,username, email, password, is_admin) VALUES ('Admin','Admin','admin', 'admin@example.com', 'adminpassword', 1);
          INSERT INTO users (nom,prenom,username, email, password, is_admin) VALUES ('Bob','Smith','bobsmith', 'bobsmith@example.com', 'password789', 0);
          INSERT INTO users (nom,prenom,username, email, password, is_admin) VALUES ('Sarah','Jones','sarahjones', 'sarahjones@example.com', 'password321', 0);

          INSERT INTO project_user (project_id, user_id)
          VALUES (1, 1),
          (2, 2),
          (3, 3),
          (3, 4),
          (4, 4),
          (4, 5),
          (5, 5);

          INSERT INTO tickets (title, description, status, priority, project_id, reported_by)
VALUES
    ('Fix login button', 'The login button on the homepage is not working properly', 'Open', 'High', 1, 3),
    ('Update pricing page', 'The pricing page needs to be updated with new plans', 'Open', 'Medium', 2, 4),
    ('Add search feature', 'Add search functionality to the website', 'Closed', 'Low', 1, 2),
    ('Fix broken links', 'Several links on the website are broken', 'Open', 'High', 3, 1),
    ('Update logo', 'Replace the old logo with a new one', 'Open', 'Low', 2, 3),
    ('Add payment gateway', 'Integrate a payment gateway for online transactions', 'Open', 'High', 1, 2),
    ('Improve performance', 'Optimize the website for faster loading times', 'In Progress', 'High', 3, 1),
    ('Fix formatting issues', 'Fix formatting issues on the about page', 'Open', 'Medium', 2, 4),
    ('Add social media links', 'Add links to social media profiles on the homepage', 'Open', 'Low', 1, 3),
    ('Fix broken images', 'Several images on the website are not loading', 'In Progress', 'Medium', 3, 5);

    INSERT INTO ticket_user (ticket_id, user_id)
    VALUES
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 1),
        (7, 2),
        (8, 3),
        (9, 4),
        (10, 5);

        INSERT INTO ticket_user (ticket_id, user_id)
        VALUES
            (1, 2),
            (2, 3),
            (3, 4),
            (4, 5),
            (5, 1),
            (6, 2),
            (7, 3),
            (8, 4),
            (9, 5),
            (10, 1);
            
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('This is a great feature!', 1, 2);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('I am having trouble with this', 2, 3);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('Thank you for your help!', 3, 1);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('I think there is a bug', 4, 5);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('This is not working as expected', 5, 4);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('Can you please provide more information?', 6, 2);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('I have a similar issue', 7, 3);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('The solution worked for me', 8, 4);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('Is there any update on this?', 9, 5);
            INSERT INTO comments (text, ticket_id, user_id) VALUES ('Thank you for your prompt response', 10, 1);

        `


    )

    return connexion;
  });
}

export { promesseConnexion };
