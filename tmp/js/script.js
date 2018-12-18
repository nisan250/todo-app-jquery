$(function(){

  var todoData ;

  function removeTodo (todoID) {
    var theTodo = _.find(todoData, function(item) {
      return item.id == todoID;
    })
    todoData = _.without(todoData, theTodo);
  }
  $('.todo-addheading').on('click', function() {
    $('.card-body').toggle(300);
  });
  
  $.ajax({
    url: 'js/data.json',
    method: 'GET',
    data: {}
  }).done(function(data) {
    todoData = data;
    $('#todoList').loadTemplate('todo-list.html', data, {
      complete: function() {
        $('.todo-delete').on('click', function() {
          $(this).parents('.todo-item').hide(300, function() {
            var theItem = $(this).attr('id');
            // data.splice(Number(theItem), 1);
            removeTodo(theItem);
            console.log(todoData);
            $(this).remove();
          });
        });
      }
    });
  });




})

