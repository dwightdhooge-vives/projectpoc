import {files, folders } from '../controllers/fileController.js'

const fileRoutes = (app) => {
    app.route('/projects/:projectID/dmsf/folders')
        .get(folders);

    app.route('/projects/:projectID/dmsf/files')
        .get(files);
}

export default fileRoutes;