
import express from 'express';

import expressLayouts from 'express-ejs-layouts';

import session from 'express-session';

import mongoose from 'mongoose';

import cookieParser from 'cookie-parser';

const app = express();
import * as dotenv from 'dotenv';
dotenv.config();

import web from './routes/web.js';

app.use(expressLayouts);
app.set("view engine", ".ejs");
app.set("views", "./src/views");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser())

var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

app.use("/assets", express.static("./src/public/assets/"));

mongoose.connect(process.env.URL_MONGO)
  .then(() => console.log('Connected!'));

web.initWebRoute(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Sever is running!`);
});
