const bodyParser = require('body-parser');

let data = [
	{
		item:"feed Pluta",
		description: "You cat loves you more when her stomac is full!",
	},
	{
		item:"learn AJAX",
		description: "awdawd",
	},
	{
		item:"get some water",
		description: "dont die!"
	}
]

module.exports = function(app){
	app.use(bodyParser.json());
	app.get('/', (req,resp)=>{
		resp.render("index",{todo:data});
	});
	app.get('/get_products',(req,resp)=>{
		resp.send({dataArr:data});
	});
	app.post('/post_new_product',(req,resp)=>{
		data.push(req.body.clientData)
		resp.send(req.body.clientData)
	});
	app.put('/edit_product/:id',(req,resp)=>{
		const urlId = req.params.id;
		data.forEach((dataObj,index)=>{
			if(urlId == dataObj.item.replace(/ /,"-").toLowerCase()){
				dataObj.item = req.body.item;
				dataObj.description = req.body.description;
			}
			resp.send();
		});
	});
	app.delete('/delete_product/:id', (req,resp)=>{
		const urlId = req.params.id;
		data.forEach((dataObj,index)=>{
			if(urlId == dataObj.item.replace(/ /,"-").toLowerCase()){
				data.splice(index,1);
			}
			resp.send();
		});
	});
}
