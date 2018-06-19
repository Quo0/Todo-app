$(document).ready(function(){

  $('#showData').on('click',()=>{
      const outUl = $('#out');
      $.ajax({
        type: 'GET',
        url: '/todogetitems',
        contentType: 'application/json',
        success: function(responseData){
          outUl.html('');
          responseData.data.forEach((data)=>{
            outUl.append(`
              <li>${data.item}</li>`)
          });          
        }
      });

      return false;

  });

  $('form').on('submit',(event)=>{
      event.preventDefault();
      const addInput = $('#newItem');

      $.ajax({
        type: "POST",
        url: "/todogetitems",
        contentType: "application/json",
        data: JSON.stringify({newItem:addInput.val()}),
        success: function(respData){
          addInput.val('');
          console.log(respData);
          $('#showData').click();
        }
      });
  });
});