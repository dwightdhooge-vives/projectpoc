import { getProjects, getProjectWithID, getProjectMembers } from '../controllers/projectController.js'

const projectRoutes = (app) => {
    app.route('/projects')
        .get(getProjects);

    app.route('/projects/:projectID')
    .get(getProjectWithID);

    app.route('/projects/:projectID/members')
    .get(getProjectMembers);

}

export default projectRoutes;