import jwt from 'jsonwebtoken';
import { getProjects,getContributors,addProjectModel,editProjectModel,getProjectByIdModel,
    getTeamByProjectIdModel, getOpenBugs,getInProgressBugs,getClosedBugs,getActivities} from '../model/bug.js';
import { getUserByEmail } from '../model/utilisateur.js';

const getCurrentUserUsername = async (request,response) => {
    const token = request.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    try {
        const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
        const userEmail = decodedToken.email;
        const currentUser = await getUserByEmail(userEmail); // This is a hypothetical function to retrieve the user from a database
        console.log(currentUser);
        return currentUser.username;
    } catch (error) {
        response.status(401).json({ message: 'Invalid or expired token' });
    }
}




export const getDonnees = async (request, response) => {
       response.status(200).json({
        titre: 'Todo',
        projects: await getProjects(),
        contributors: await getContributors(),
        activities:await getActivities(),
        openBugs:await getOpenBugs(),
        inProgressBugs:await getInProgressBugs(),
        closedBugs:await getClosedBugs(),
    });
}



export const getAllProjects = async (request, response) => {
    response.status(200).json({
        projects: await getProjects(),
    });
}
export const addProject = async (request, response) => {
    const {name, description, contributors} = request.body;
    await addProjectModel(name, description, contributors, await getCurrentUserUsername(request,response));
    response.status(201).end();
}

export const editProject = async (request, response) => {
    await editProjectModel(request.body.id,request.body.name, request.body.description, request.body.contributors, await getCurrentUserUsername(request,response));
    response.status(201).end();
}


export const getProjectById = async (request, response) => {
    response.status(200).json({
        project: await getProjectByIdModel(request.params.id),
        team:await getTeamByProjectIdModel(request.params.id)
    });
}

