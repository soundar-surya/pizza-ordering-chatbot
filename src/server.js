require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import './models/userSchema';
import './models/OrdersSchema';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';
import {MONGO_URI} from './models/config';


//database config
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


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