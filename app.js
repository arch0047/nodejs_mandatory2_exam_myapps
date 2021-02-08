require('dotenv').config();
const nodemon = require("nodemon");
const database = require("./database");
const routes = require("./routes");
const socket = require("./chat/chat");
