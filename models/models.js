const mongoose = require('mongoose');
mongoose.connect('mongodb://admin1:admin1@ds263740.mlab.com:63740/node_todo_app');
// Schemas
const todoSchema = new mongoose.Schema({
	item: String,
	description: String,
	date: String
},{collection: "Todo-list"});

const doneSchema = new mongoose.Schema({
	item: String,
	description: String,
	date: String,
},{collection: "Done-list"});

//Models
const Todo = mongoose.model('Todo-list',todoSchema);
const Done = mongoose.model('Done-list',doneSchema);

module.exports = {
	Todo: Todo,
	Done: Done
}