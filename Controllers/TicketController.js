import jwt from 'jsonwebtoken';
import { getAllTickets,addTicketModel,addMemberModel,deleteMemberModel,
        getTicketByIdModel,getAssignersModel,editTicketModel,getCommentsByTicketIdModel,deleteCommentModel,addCommentModel } from "../model/ticket.js";
import { getUserByEmail } from '../model/utilisateur.js';


const getCurrentUserUsername = async (request,response) => {
    const token = request.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    try {
        const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
        const userEmail = decodedToken.email;
        const currentUser = await getUserByEmail(userEmail); // This is a hypothetical function to retrieve the user from a database
        return currentUser.username;
    } catch (error) {
        response.status(401).json({ message: 'Invalid or expired token' });
    }
}



export const getTickets = async (request, response) => {
    response.status(200).json({
        tickets: await getAllTickets(),
    });
}


export const addTicket = async (request, response) => {
    const token = request.headers.authorization.split(' ')[1]; // Extract token from Authorization header
      const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
      const userId = decodedToken.id;

     await addTicketModel(request.body.title, request.body.description, request.body.status, request.body.priority, request.body.project_id,userId, request.body.assignees_users,await getCurrentUserUsername(request,response));
    response.status(201).end();
}

export const addMember = async (request, response) => {
    await addMemberModel(request.body.project_id,request.body.users);
    response.status(201).end();
}

export const deleteMember = async (request, response) => {
    await deleteMemberModel(request.body.project_id,request.body.user_id);
    response.status(201).end();
}

export const getTicketById = async (request, response) => {
    const idTicket =request.query.ticket_id;
    response.status(200).json({
        ticket: await getTicketByIdModel(idTicket),
        assigners: await getAssignersModel(idTicket)
    });
}

export const editTicket = async (request, response) => {
   await editTicketModel(request.body.id,request.body.title, request.body.description, request.body.status, request.body.priority, request.body.project_id,4, request.body.assignees_users,await getCurrentUserUsername(request,response));
   response.status(201).end();
}

export const getCommentsByTicketId = async (request, response) => {
    const idTicket =request.query.ticket_id;
    response.status(200).json({
        comments: await getCommentsByTicketIdModel(idTicket)
    });
}

export const deleteComment = async (request, response) => {
    await deleteCommentModel(request.body.id,request.body.ticket_id);
    response.status(201).end();
}

export const addComment = async (request, response) => {
    const token = request.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
        const userId = decodedToken.id;
    await addCommentModel(request.body.text,request.body.ticket_id,userId);
    response.status(201).end();
}