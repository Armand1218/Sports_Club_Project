const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(express.json(), express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

require("./config/mongoose.config");
require("./routes/userLogin.routes")(app);
require("./routes/post.routes")(app);
require("./routes/like.routes")(app);
require("./routes/comment.routes")(app);

app.listen(8000, () => {
    console.log('Currently listening to port 8000');
})