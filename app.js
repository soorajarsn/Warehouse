const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const upload = require('express-fileupload');
const routes = require('./backend/routes/mainRoutes');
const app = express();


app.use(compression());
app.use(cors());
app.use(upload());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/',routes);

app.listen('4000',()=>{console.log('Server started running on port 4000')});