const showDataBtn = document.querySelector("#showData");
const todoList = document.querySelector('#todo-list');
const doneList = document.querySelector("#done-list");

let formatDate = function (date){
  let day = date.getDate();
  if(day<10){day = "0" + date.getDate()};
  let month = date.getMonth()+1;
  if(month<10){month = "0" + (date.getMonth()+1)};
  const year = date.getFullYear() % 2000;
  return `${day}:${month}:${year}`
 }

let sortType = "date"; // initial sort type;
let sortTodoItems = function (a,b){
  let property;
  if(sortType == "name"){
    property = "item"
  }
  if(sortType == "date"){
    property = "date"
  };
  
  if(a[property] > b[property]) return 1;
  if(a[property] < b[property]) return -1;     
}

document.addEventListener('DOMContentLoaded', ()=>{
  //drop-down description
  document.querySelector("#todo-table").addEventListener("click",(event)=>{
    if(event.target.className == "item-block"){
      const descrDiv = event.target.querySelector('.item-description');
      descrDiv.classList.toggle('visible');
    }
    if(event.target.className == "item-name"){
      const descrDiv = event.target.parentNode.querySelector('.item-description');
      descrDiv.classList.toggle('visible');
    }
  });

  //custom sort
  const allRadio = document.forms["todo-sort-form"].querySelectorAll('input');
  allRadio.forEach((radioBtn)=>{
    radioBtn.addEventListener('change', (e)=>{
      if(e.target.id == "sort-name"){
        sortType = "name";
      } else { sortType = "date"};
      showDataBtn.click(); //reload data on a page
    })
  });
  
  // AJAX calls

  // GET all todo's
  showDataBtn.addEventListener("click", ()=>{
    (uploadTodoData =()=>{
      const ROUT = '/upload_todo_list';
      const headers = new Headers({"Content-Type":"application/JSON"});
      const options = {
        method: "GET",
        headers: headers,
      }

      const req = new Request( ROUT, options);

      fetch(req)
        .then(serverResponse=>{
          return serverResponse.json();
        })
        .then(serverData=>{
          const serverArray = serverData.dataArr;
          serverArray.sort(sortTodoItems);

          todoList.innerHTML = "";
          serverArray.forEach((dataObj)=>{
            todoList.innerHTML += `<li class="item-block" data-id="${dataObj._id}">
                                      <p class="item-name">${dataObj.item}</p>
                                      <div class="item-description">
                                        <p>${dataObj.description}</p>
                                        <span class="done">Done!</span>
                                        <span class="edit">Edit</span>
                                        <span class="delete">Remove</span>
                                      </div>
                                  </li>`;
          });
        })
        .catch(err=>{
          console.log(err);
        });
    })();

    //upload Done data
    (uploadDoneData=()=>{
      const ROUT = "/upload_done_list";
      const headers = new Headers({"Content-Type":"application/JSON"});
      const options = {
        method: "GET",
        headers: headers,
      }

      const req = new Request(ROUT, options)

      fetch(req)
        .then(serverResponse=>{
          return serverResponse.json()
        })
        .then(serverData=>{
          const serverArray = serverData.dataArr;
          serverArray.sort((a,b)=>{
            if(a.date > b.date){return 1};
            if(a.date < b.date){return -1};
          });
          
          doneList.innerHTML = "";
          serverArray.forEach((dataItem)=>{
            doneList.innerHTML += `<li class="item-block" data-id="${dataItem._id}">
                                    <p class="item-name">${dataItem.item}</p>
                                    <div class="item-description">
                                      <p>${dataItem.description}</p>
                                      <span class="date">${dataItem.date}</span>
                                      <span class="delete">Remove 4ever</span>
                                    </div>
                                  </li>`;
          });
        })
        .catch(err=>{
          console.log(err);
        });
    })();
  }); // end of GET all todo's

  // POST new todo
  document.forms["newItemForm"].addEventListener('submit',(event)=>{
    event.preventDefault();
    const newItemInput = document.forms["newItemForm"].querySelector('#newItem');
    const newTodo = newItemInput.value;
    if(newTodo == false){
      alert("Please, enter the name!")
      newItemInput.focus();
      return;
    };
    const newTodoDescr = (function(){
      let answer = prompt("Any description?","");
      if(answer == null || answer == false){
        return "without description";
      } else {
        return answer;
      };
    })();

    const ROUT = "/new_todo_item";
    const headers = new Headers({"Content-Type":"application/JSON"});
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        clientData:{
          item:newTodo,
          description: newTodoDescr,
          date: +new Date()
        }
      }),
    }

    const req = new Request(ROUT, options);

    fetch(req)
      .then(serverResponse=>{
        showDataBtn.click(); //reload data on a page
        return serverResponse.json()
      })
      .catch(err=>{
        console.log(err);
      });
    newItemInput.value = "";
  }); // end of POST new todo

  // PUT update todo
  todoList.addEventListener('click',(event)=>{
    if(event.target.className == "edit"){
      const itemBlock = event.target.parentNode.parentNode;
      const todoName = itemBlock.querySelector('.item-name').innerHTML
      const prevDescr = itemBlock.querySelector('.item-description p').innerHTML

      const clientDataPromise = new Promise((resolve,reject)=>{
        const clientData = {};

        const newName = prompt("Enter new todo name",todoName);
        if(newName == false){
          reject("Please enter the new name!");
          return;
        } else if(newName == null){
          reject("You didn't change anything");
          return;
        } else {
          clientData.name = newName;
        }
        const newDescr = prompt("Enter item description", prevDescr);
        if(newDescr == null || newDescr == false){
          clientData.description = "without description";
        } else{
          clientData.description = newDescr;
        }
        resolve(clientData);
      });

      clientDataPromise.then(
        (resolve)=>{
          const ID = itemBlock.dataset.id;
          const clientData = {
            item: resolve.name,
            description: resolve.description
          };

          // ajax call
          const ROUT = `/edit_todo_item/${ID}`
          const headers = new Headers({"Content-Type":"application/JSON"});
          const options = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(clientData)
          }

          const req = new Request(ROUT, options);

          fetch(req)
            .then(()=>{
              showDataBtn.click(); //reload data on a page
            })
            .catch(err=>{
              console.log(err);
            });

        },
        (reject)=>{
          alert(reject);
      }); // end of clientDataPromise
    }
  });

  // DELETE todo
   todoList.addEventListener('click',(event)=>{
    if(event.target.className == "delete"){
      const confirmed = confirm("Are you sure you want to delete this task?");
      if(confirmed){
        const itemBlock = event.target.parentNode.parentNode;
        const itemId = itemBlock.dataset.id

        //ajax call
        const ROUT = `/delete_todo_item/${itemId}`;
        const headers = new Headers({"Content-Type":"application/JSON"});
        const options = {
          method: "DELETE",
          headers: headers,
        }

        const req = new Request(ROUT, options);

        fetch(req)
          .then(()=>{
            showDataBtn.click();
          })
          .catch(err=>{
            console.log(err);
          });
      }
    }
  });

  // MOVE item from Todo to Done
   todoList.addEventListener('click',(event)=>{
    if(event.target.className == "done"){
      const confirmed = confirm("Mark this task as done?");
      if(confirmed){
        const itemBlock = event.target.parentNode.parentNode;
        const todoId = itemBlock.dataset.id;

        //ajax call
        const ROUT = `/find_to_delete/${todoId}`
        const headers = new Headers({"Content-Type":"application/JSON"});
        const options = {
          method: "GET",
          headers: headers,
        }

        const req = new Request(ROUT, options);

        fetch(req)
          .then(serverResponse=>{
            return serverResponse.json();
          })
          .then(serverData=>{
            const doneItem = Object.assign({}, serverData.data);
            const date = formatDate(new Date());
            doneItem.date = date;

            //next ajax call
            const ROUT = "/new_done_item";
            const headers = new Headers({"Content-Type":"application/JSON"});
            const options = {
              method: "POST",
              headers: headers,
              body: JSON.stringify(doneItem),
            }

            const req = new Request(ROUT, options);

            fetch(req)
              .then(()=>{
                showDataBtn.click()
              })
              .catch(err=>{
                console.log(err);
              })
          })
          .catch(err=>{
            console.log(err);
          })
      };      
    };
  });

  // Remove Done item
  doneList.addEventListener('click',(event)=>{
    if(event.target.className == "delete"){
      const confirmed = confirm("Are you sure you want to delete this task?");
      if(confirmed){
        const itemBlock = event.target.parentNode.parentNode;
        const doneItemId = itemBlock.dataset.id;

        //ajax call
        const ROUT = `/delete_done_item/${doneItemId}`;
        const headers = new Headers({"Content-Type":"application/JSON"});
        const options = {
          method: "DELETE",
          headers: headers,
        }

        const req = new Request(ROUT, options);

        fetch(req)
          .then(serverResponse=>{
            showDataBtn.click()
          })
      };
    };
  });

  //uploading current data
  showDataBtn.click();
});
