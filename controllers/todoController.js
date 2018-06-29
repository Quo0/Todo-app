const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//connect to DB
mongoose.connect('mongodb://admin1:admin1@ds263740.mlab.com:63740/node_todo_app');
//schemas(data blueprint)
const todoSchema = new mongoose.Schema({
	item: String,
	description: String
},{collection: "Todo-list"});

const doneSchema = new mongoose.Schema({
	item: String,
	description: String,
	date: String,
},{collection: "Done-list"});
//Models
const Todo = mongoose.model('Todo-list', todoSchema);
const Done = mongoose.model('Done-list', doneSchema);

module.exports = function(app){
	app.use(bodyParser.json());
	app.get('/', (req,resp)=>{
		resp.render("index");
	});
	app.get('/upload_todo_list',(req,resp)=>{
		Todo.find({},(err,data)=>{
			if(err){throw err};
			resp.send({dataArr:data});
		});
	});
	app.get('/upload_done_list',(req,resp)=>{
		Done.find({},(err,data)=>{
			if(err){throw err};
			resp.send({dataArr:data});
		});
	});
	app.post('/new_todo_item',(req,resp)=>{
		const newTodo = Todo(req.body.clientData).save((err,data)=>{
			if(err){throw err};
			resp.send(data);
		});
	});
	app.put('/edit_todo_item/:id',(req,resp)=>{
		console.log(req.body);
		console.log(req.params.id.replace(/\-/g, " "));
		Todo.find({item: req.params.id.replace(/\-/g, " ")}).remove((err,data)=>{
			if(err)throw err;
			
			const replacedItem = Todo(req.body).save((err,data)=>{
				if(err){throw err};
				resp.send();
			});
		});
	});
	app.delete('/delete_todo_item/:id', (req,resp)=>{
		Todo.find({item: req.params.id.replace(/\-/g, " ")}).remove((err,data)=>{
			if(err)throw err;
			resp.send();
		});
	});
	app.get('/find_to_delete/:id',(req,resp)=>{
		Todo.find({item: req.params.id.replace(/-/g," ")}, (err,data)=>{
			if(err){throw err};
			resp.send({dataArr: data[0]});
		});
	});
	app.post('/new_done_item',(req,resp)=>{
		Todo.find({item: req.body.item}).remove((err)=>{
			if(err){throw err};
		})
		Done(req.body).save((err,data)=>{
			if(err){throw err};
			resp.send(data);
		});
	});
	app.delete('/delete_done_item/:id',(req,resp)=>{
		Done.find({item: req.params.id.replace(/-/g," ")}).remove((err)=>{
			if(err){throw err};
			resp.send();
		})
	});
};
