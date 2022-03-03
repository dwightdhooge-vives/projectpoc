import { getBranches, getLatestCommits } from '../controllers/gitController.js'

const gitRoutes = (app) => {
    app.route('/git/branches')
        .get(getBranches);

    app.route('/git/commits')
        .get(getLatestCommits);
}

export default gitRoutes;