import express from "express";
import bodyParser from "body-parser";
import projectRoutes from "./src/routes/projectRoutes.js"
import authRoutes from "./src/routes/authRoutes.js";
import gitRoutes from "./src/routes/gitRoutes.js";
import fileRoutes from "./src/routes/fileRoutes.js";
import cors from "cors"

const app = express();
const PORT = 6000;

//bodyparser 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

projectRoutes(app);
authRoutes(app);
gitRoutes(app);
fileRoutes(app)

// serving static files 
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.send(`Node and express server running on port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT}`)
);