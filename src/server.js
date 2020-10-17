require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';

const app = express();

//config view Engine
viewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//init web routes.
initWebRoutes(app);

//config PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT);