$('document').ready(()=>{
  //drop-down description
  $('#todo-table').on('click',(event)=>{
    if(event.target.className == "item-block"){
      const descrDiv = event.target.querySelector('.item-description');
      descrDiv.classList.toggle('visible');
    }
    if(event.target.className == "item-name"){
      const descrDiv = event.target.parentNode.querySelector('.item-description');
      descrDiv.classList.toggle('visible');
    }
  });

  // GET all todo's
  $('#showData').on("click", ()=>{
    //upload Todo data
    $.ajax({
      type:"GET",
      url:"/upload_todo_list",
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
                          <span class="done">Done!</span>
                          <span class="edit">Edit</span>
                          <span class="delete">Remove</span>
                        </div>
                    </li>
            `);
        });
      }
    });
    //upload Done data
    $.ajax({
      type: "GET",
      url:"/upload_done_list",
      contentType:"application/JSON",
      success: function(serverData){
        let serverArray = serverData.dataArr;
        serverArray.sort((a,b)=>{
          if(a.item > b.item){return 1};
          if(a.item < b.item){return -1};
        });
        const doneList = $("#done-list");
        doneList.html("");
        serverArray.forEach((dataItem)=>{
          doneList.append(`<li class="item-block">
                              <p class="item-name">${dataItem.item}</p>
                              <div class="item-description">
                                <p>${dataItem.description}</p>
                                <span class="date">24/04/18</span>
                                <span class="delete">Remove 4ever</span>
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
      url: "/new_todo_item",
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
        url: `/edit_todo_item/${todoName.replace(/ /,"-")}`,
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
        url: `/delete_todo_item/${todoNameId}`,
        contentType:"application/JSON",
        data: JSON.stringify({id:todoNameId}),
        success: function(){
          $('#showData').click();
        }
      });
    }
  });

  // MOVE item from Todo to Done
   $('#todo-list').on('click',(event)=>{
    if(event.target.className == "done"){
      const itemBlock = event.target.parentNode.parentNode;
      const todoNameId = itemBlock.querySelector('.item-name').innerHTML.replace(/ /g,"-");

      $.ajax({
        type:"GET",
        url:`/find_to_delete/${todoNameId}`,
        contentType:"application/JSON",
        success: function(itemToDelete){
          const doneItem = Object.assign({}, itemToDelete.dataArr);
          $.ajax({
            type:"POST",
            url:`/new_done_item`,
            contentType: 'application/JSON',
            data: JSON.stringify(doneItem),
            success: function(data){
              $('#showData').click();              
            }
          });

        }
      });
    }
  });

  // Remove Done item
  $('#done-list').on('click',(event)=>{
    if(event.target.className == "delete"){
      const itemBlock = event.target.parentNode.parentNode;
      const doneItemName = itemBlock.querySelector(".item-name").innerHTML.replace(/ /g,"-");

      $.ajax({
        type:"DELETE",
        url:`/delete_done_item/${doneItemName}`,
        contentType:"application/JSON",
        success: function(){
          $('#showData').click();
        }
      });
    }
  })
  //uploading current data
  $('#showData').click();
});
