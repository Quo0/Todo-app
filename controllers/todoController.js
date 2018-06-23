const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//connect to DB
mongoose.connect('mongodb://admin1:admin1@ds263740.mlab.com:63740/node_todo_app');
//schema(data blueprint)
const todoSchema = new mongoose.Schema({
	item: String,
	description: String
});
//Model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = function(app){
	app.use(bodyParser.json());
	app.get('/', (req,resp)=>{
		resp.render("index");
	});
	app.get('/get_products',(req,resp)=>{
		Todo.find({},(err,data)=>{
			if(err){throw err};
			resp.send({dataArr:data});
		});
	});
	app.post('/post_new_product',(req,resp)=>{
		const newTodo = Todo(req.body.clientData).save((err,data)=>{
			if(err){throw err};
			resp.send(data);
		});
	});
	app.put('/edit_product/:id',(req,resp)=>{
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
	app.delete('/delete_product/:id', (req,resp)=>{
		Todo.find({item: req.params.id.replace(/\-/g, " ")}).remove((err,data)=>{
			if(err)throw err;
			resp.send();
		});
	});
};
