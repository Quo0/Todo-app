$('document').ready(()=>{
  //drop-down description
  $('#todo-list').on('click',(event)=>{
    if(event.target.className == "item-block"){
      const descrDiv = event.target.querySelector('.item-description');
      descrDiv.classList.toggle('visible');
    }
    if(event.target.className == "item-name"){
      const descrDiv = event.target.parentNode.querySelector('.item-description');
      descrDiv.classList.toggle('visible');
    }
  })
  // GET all todo's
  $('#showData').on("click", ()=>{
    $.ajax({
      type:"GET",
      url:"/get_products",
      contentType: "application/JSON",
      success: function(serverResponse){
        let serverArray = serverResponse.dataArr;
        serverArray.sort((a,b)=>{
          if(a.item > b.item) return 1;
          if(a.item < b.item) return -1;          
        })
        const ul = $('#todo-list');
        ul.html('');
        serverArray.forEach((dataObj)=>{
          ul.append(`<li class="item-block">
                        <p class="item-name">${dataObj.item}</p>
                        <div class="item-description">
                          <p>${dataObj.description}</p>
                          <span class="edit">Edit</span>
                          <span class="delete">Remove</span>
                        </div>
                    </li>
            `);
        });
      }
    });
  });
  // POST new todo
  $('form').on('submit',(event)=>{
    event.preventDefault();
    const newItemInput = $('#newItem');
    const newTodo = newItemInput.val();
    const newTodoDescr = prompt("Any description?","");
    newItemInput.val("");
    $.ajax({
      type: "POST",
      url: "/post_new_product",
      contentType: "application/JSON",
      data: JSON.stringify({
        clientData:{
          item:newTodo,
          description: newTodoDescr
        }
      }),
      success: function(serverData){
        $('#showData').click();
      }
    })
  })
  // PUT update todo
  $('#todo-list').on('click',(event)=>{
    if(event.target.className == "edit"){
      const itemBlock = event.target.parentNode.parentNode;
      const todoName = itemBlock.querySelector('.item-name').innerHTML

      const newName = prompt("Enter new todo name",todoName);
      const newDescr = prompt("Enter item description", "");

      const clientData = {
        item: newName,
        description: newDescr
      };

      $.ajax({
        type: "PUT",
        url: `/edit_product/${todoName.replace(/ /,"-").toLowerCase()}`,
        contentType:"application/JSON",
        data: JSON.stringify(clientData),
        success: function(){
          $('#showData').click();
        }
      });
    }
  });
  // DELETE todo
   $('#todo-list').on('click',(event)=>{
    if(event.target.className == "delete"){
      const itemBlock = event.target.parentNode.parentNode;
      const todoNameId = itemBlock.querySelector('.item-name').innerHTML.replace(/ /,"-");

      $.ajax({
        type: "DELETE",
        url: `/delete_product/${todoNameId}`,
        contentType:"application/JSON",
        data: JSON.stringify({id:todoNameId}),
        success: function(){
          $('#showData').click();
        }
      });
    }
  });

  //uploading current data
  $('#showData').click();
});
