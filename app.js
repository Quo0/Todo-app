const express = require('express');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const app = express();
//my modules
const todoController = require('./controllers/todoController');
// running sass!
app.use(sassMiddleware({
	src: path.join(__dirname,"sass"),
	dest: path.join(__dirname,"public/assets"),
}));
//static files
app.use(express.static('public/assets'))

app.set("view engine", "ejs");
//fire controllers
todoController(app);

app.listen(3000,()=>{
	console.log("server running on a port: 3000");
});