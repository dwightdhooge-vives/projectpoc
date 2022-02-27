import { getUser} from '../controllers/authController.js'

const aroutes = (app) => {
    app.route('/login')
        .get(getUser);
}

export default aroutes;