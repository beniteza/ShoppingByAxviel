const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

//------- LOAD MODELS: START

//Load User Model
require('./models/User');

//Load Item Model
require('./models/Item');

//-------

//Passport Config
require('./config/passport')(passport);

const app = express();

//Load Keys
const keys = require('./config/keys');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose Connect
mongoose
  .connect(
    keys.mongoURI,
    {
      //useMongoClient: true //avoid deprocated error
      useNewUrlParser: true
    }
  )
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

//------- ADD MIDDLEWARE: START

//Body-Parser Middleware
//let's us access req.body, req.title, etc (which are the names of the form inputs)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method-Override Middleware
app.use(methodOverride('_method'));

//Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      // truncate: truncate,
      // stripTags: stripTags,
      // formatDate: formatDate,
      // select: select,
      // editIcon: editIcon
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//Session & Cookie-Parser Middleware
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session()); //needs express-session middleware

//-------

//Set Global Vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//------- LOAD ROUTES: START

const index = require('./routes/index');
const auth = require('./routes/auth');
const items = require('./routes/items');
const users = require('./routes/users');

//-------

//Set static folder
//join current directory with public dir to be able to use css
app.use(express.static(path.join(__dirname, 'public')));

//------- USE ROUTES: START

app.use('/', index);
app.use('/auth', auth);
app.use('/items', items);
app.use('/users', users);

//-------

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
