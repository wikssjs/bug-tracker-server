import { getProjects,getContributors,addProjectModel,editProjectModel,getProjectByIdModel,getTeamByProjectIdModel, getOpenBugs,getInProgressBugs,getClosedBugs} from '../model/bug.js';

export const getDonnees = async (request, response) => {
    response.status(200).json({
        titre: 'Todo',
        projects: await getProjects(),
        contributors: await getContributors(),
        openBugs:await getOpenBugs(),
        inProgressBugs:await getInProgressBugs(),
        closedBugs:await getClosedBugs(),
    });
}


console.log(await getProjects())
export const getAllProjects = async (request, response) => {
    console.log("get all projects")
    response.status(200).json({
        projects: await getProjects(),
    });
}
export const addProject = async (request, response) => {
    console.log(request.body.name.toString())
    await addProjectModel(request.body.name, request.body.description, request.body.contributors);
    response.status(201).end();
}

export const editProject = async (request, response) => {
    await editProjectModel(request.body.id,request.body.name, request.body.description, request.body.contributors);
    response.status(201).end();
}


export const getProjectById = async (request, response) => {
    response.status(200).json({
        project: await getProjectByIdModel(request.params.id),
        team:await getTeamByProjectIdModel(request.params.id)
    });
}

