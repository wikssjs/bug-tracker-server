import { promesseConnexion } from './connexion.js';


export const getAllTickets = async () => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all(
        `SELECT t.title,t.status,t.priority,t.created_at,t.id,p.name,p.id as project_id,u.username, 
        CASE 
            WHEN created_at >= DATETIME('now', '-1 day') THEN 'Today'
            WHEN created_at >= DATETIME('now', '-2 day') THEN 'Yesterday'
            WHEN created_at >= DATETIME('now', '-7 day') THEN 'This Week'
            WHEN created_at >= DATETIME('now', '-14 day') THEN '2 Weeks Ago'
            WHEN created_at >= DATETIME('now', '-21 day') THEN '3 Weeks Ago'
            WHEN created_at >= DATETIME('now', '-28 day') THEN '4 Weeks Ago'
            WHEN created_at >= DATETIME('now', '-60 day') THEN '2 Months Ago'
            WHEN created_at >= DATETIME('now', '-90 day') THEN '3 Months Ago'
            WHEN created_at >= DATETIME('now', 'start of year', '-1 year') AND created_at < DATETIME('now', 'start of year') THEN 'Last Year'
            WHEN created_at >= DATETIME('now', 'start of month') AND created_at < DATETIME('now', 'start of day') THEN 'This Month'
            WHEN created_at >= DATETIME('now', '-365 day') AND created_at < DATETIME('now', 'start of year', '-1 year') THEN 'This Year'
            ELSE 'More Than 1 Year Ago'
        END AS date_range
        FROM tickets t
        INNER JOIN projects p ON p.id = t.project_id
        INNER JOIN users u ON u.id = t.reported_by
        `
    )
    return resultat;
}


export const addTicketModel = async (title, description, status, priority, project_id, reported_by, assignees_users) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.run(
        `INSERT INTO tickets (title, description, status, priority,project_id,reported_by)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, status, priority, project_id, reported_by]
    );

    for (let i = 0; i < assignees_users.length; i++) {

        let resultat2 = await connexion.run(
            `INSERT INTO ticket_user (ticket_id,user_id)
            VALUES (?, ?)`,
            [resultat.lastID, assignees_users[i]]
        );
    }
    return resultat.lastID;
}

export const addMemberModel = async (project_id, users) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.run(
        `delete from project_user where project_id = ?`,
        [project_id]

    );
    for (let i = 0; i < users.length; i++) {

        let resultat2 = await connexion.run(
            `INSERT INTO project_user (project_id,user_id)
        VALUES (?, ?)`,
            [project_id, users[i]]
        );
    }
}

export const deleteMemberModel = async (project_id, user_id) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.run(
        `delete from project_user where project_id = ? and user_id = ?`,
        [project_id, user_id]

    );
}


export const getTicketByIdModel = async (id) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.get(
        `SELECT t.title,t.id,t.status,t.priority,t.reported_by,t.created_at,t.description,
            p.name,t.updated_at,u.username ,
            CASE 
            WHEN status = 'Closed' THEN 'badge-danger'
            WHEN status = 'In Progress' THEN 'badge-warning'
            ELSE 'badge-success'
          END AS status_badge,
            CASE
            WHEN priority = 'High' THEN 'badge-danger'
            WHEN priority = 'Medium' THEN 'badge-warning'
            ELSE 'badge-success'
            END AS priority_badge
           FROM tickets t 
        Inner join projects p on p.id = t.project_id
        Inner join users u on u.id = t.reported_by
        WHERE t.id = ?`,
        [id]
    )
    return resultat;
}


export const getCommentsByTicketIdModel = async (id) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all(
        `SELECT c.id,c.text,u.username,
        CASE 
        WHEN created_at >= DATE('now', '-1 day') THEN 'Today'
        WHEN created_at >= DATE('now', '-2 day') THEN 'Yesterday'
        WHEN created_at >= DATE('now', '-7 day') THEN 'This Week'
        WHEN created_at >= DATE('now', '-14 day') THEN '2 Weeks Ago'
        WHEN created_at >= DATE('now', '-21 day') THEN '3 Weeks Ago'
        WHEN created_at >= DATE('now', '-28 day') THEN '4 Weeks Ago'
        WHEN created_at >= DATE('now', '-60 day') THEN '2 Months Ago'
        WHEN created_at >= DATE('now', '-90 day') THEN '3 Months Ago'
        WHEN created_at >= DATE('now', 'start of year', '-1 year') AND created_at < DATE('now', 'start of year') THEN 'Last Year'
        WHEN created_at >= DATE('now', 'start of month') AND created_at < DATE('now', 'start of day') THEN 'This Month'
        WHEN created_at >= DATE('now', '-365 day') AND created_at < DATE('now', 'start of year', '-1 year') THEN 'This Year'
        ELSE 'More Than 1 Year Ago'
      END AS date_range FROM comments c
        INNER JOIN users u ON u.id = c.user_id
        WHERE c.ticket_id = ?`,
        [id]
    )
    return resultat;
}

export const getAssignersModel = async (id) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.all(
        `Select u.username,u.id from users u
       Inner join ticket_user tu on tu.user_id = u.id
       inner join tickets t on t.id = tu.ticket_id
       where tu.ticket_id = ?`, [id]
    )
    return resultat;
}

export const editTicketModel = async (id, title, description, status, priority, project_id, reported_by, assignees_users) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.run(
        `UPDATE tickets SET title = ?, description = ?, status = ?, priority = ?,project_id = ?,reported_by = ?
        WHERE id = ?`,
        [title, description, status, priority, project_id, reported_by, id]

    );


    let resultat2 = await connexion.run(
        `delete from ticket_user where ticket_id = ?`,
        [id]

    );

    for (let i = 0; i < assignees_users.length; i++) {

        let resultat3 = await connexion.run(
            `INSERT INTO ticket_user (ticket_id,user_id)
        VALUES (?, ?)`,
            [id, assignees_users[i]]
        );
    }
    return resultat.lastID;
}


export const deleteCommentModel = async (id, ticketId) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.run(
        `delete from comments where id = ? and ticket_id = ?`,
        [id, ticketId]

    );
}

export const addCommentModel = async (text, ticket_id, user_id) => {
    let connexion = await promesseConnexion;

    let resultat = await connexion.run(
        `INSERT INTO comments (text,ticket_id,user_id)
        VALUES (?, ?, ?)`,
        [text, ticket_id, user_id]
    );
    return resultat.lastID;
}