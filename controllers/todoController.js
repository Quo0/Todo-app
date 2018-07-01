const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const models = require('../models/models');
//Models
const Todo = models.Todo;
const Done = models.Done;

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
		const id = req.params.id
		Todo.findById(id,(err,data)=>{
			const date = data.date;

			Todo.findById(req.params.id).remove((err,data)=>{
				if(err)throw err;
				const newItem = Todo(req.body);
				newItem.date = date;
				newItem.save((err,data)=>{
					if(err){throw err};
					resp.send();
				});
			});

		});
	});
	app.delete('/delete_todo_item/:id', (req,resp)=>{
		Todo.findById(req.params.id).remove((err,data)=>{
			if(err)throw err;
			resp.send();
		});
	});
	app.get('/find_to_delete/:id',(req,resp)=>{
		Todo.findById(req.params.id, (err,data)=>{
			if(err){throw err};
			resp.send({data: data});
		});
	});
	app.post('/new_done_item',(req,resp)=>{
		Todo.findById(req.body._id).remove((err)=>{
			if(err){throw err};
		})
		Done(req.body).save((err,data)=>{
			if(err){throw err};
			resp.send(data);
		});
	});
	app.delete('/delete_done_item/:id',(req,resp)=>{
		Done.findById(req.params.id).remove((err)=>{
			if(err){throw err};
			resp.send();
		})
	});
};
