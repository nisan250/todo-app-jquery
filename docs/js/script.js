$(function(){

  var todoData, sortBy, sortDir, displayData ;

  // Initial State
  sortBy = 'todoTitle';
  sortDir = 'asc';

  $('#sort-' + sortBy).addClass('active');
  $('#sort-' + sortDir).addClass('active');

  function removeTodo (todoID) {
    var theTodo = _.find(todoData, function(item) {
      return item.id == todoID;
    })
    todoData = _.without(todoData, theTodo);
    displayData = _.without(displayData, theTodo);
  }

  function listTodo(info) {
    if(sortDir === 'asc') {
      info = _.sortBy(info, sortBy);
    } else {
      info = _.sortBy(info, sortBy).reverse();
    }

    $.addTemplateFormatter('formatDate', function(value) {
      return $.format.date(new Date(value), 'MM/dd hh:mm p');
    })

    $('#todoList').loadTemplate('todo-list.html', info, {
      complete: function() {
        $('.todo-delete').on('click', function() {
          $(this).parents('.todo-item').hide(300, function() {
            var theItem = $(this).attr('id');
            removeTodo(theItem);
            console.log(todoData);
            $(this).remove();
          });
        }); // delete

        $('[contenteditable]').on('blur', function() {
            var fieldData, fieldName, whichID;
            whichID = Number($(this).parents('.todo-item').attr('id'));
            console.log(whichID);
            fieldName = $(this).data('field');
            console.log(fieldName);
            fieldData = $(this).text();
            console.log(fieldData);
            todoData[whichID][fieldName] = fieldData;
        }); // edit

      }
    });// load template
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
    displayData = data;
    listTodo(displayData);
  });
  // drop-down click event
  $('.sort-menu .dropdown-item').on('click', function() {
    console.log($(this));
    var sortDropDown = $(this).attr('id');

    switch(sortDropDown) {
      case 'sort-todoTitle':
      $('.sort-by').removeClass('active');
      sortBy = 'todoTitle';
      break;
      case 'sort-todoOwner':
      $('.sort-by').removeClass('active');
      sortBy = 'todoOwner';  
      break;
      case 'sort-todoDate':
      $('.sort-by').removeClass('active');
      sortBy = 'todoDate';
      break;
      case 'sort-asc':
      $('.sort-dir').removeClass('active');
      sortDir = 'asc';
      break;
      case 'sort-desc':
      $('.sort-dir').removeClass('active');
      sortDir = 'desc';
      break;
    }

    $(this).addClass('active');
    listTodo(displayData);

  });

  $('#SearchTodos').keyup(function() {
    var searchText = $(this).val();

    displayData = _.filter(todoData, function(item) {
      console.log('todoTitle: ' + item.todoTitle.toLowerCase().match(searchText.toLowerCase()));
      console.log('todoOwner: ' + item.todoOwner.toLowerCase().match(searchText.toLowerCase()));
      console.log('todoNote: ' +  item.todoNote.toLowerCase().match(searchText.toLowerCase()));
      return (
        item.todoTitle.toLowerCase().match(searchText.toLowerCase()) ||
        item.todoOwner.toLowerCase().match(searchText.toLowerCase()) ||
        item.todoNote.toLowerCase().match(searchText.toLowerCase())
        ) 
        
    });
    console.log('todoData', todoData);
    listTodo(displayData);
  });

  $('#todoForm').submit(function(e) {
    e.preventDefault();
    newItem = {};

    newItem.todoTitle = $('#todoTitle').val();
    newItem.todoOwner = $('#todoOwner').val();
    newItem.todoDate = $('#todoDate').val();
    newItem.todoNote = $('#todoDescription').val();

    todoData.push(newItem);
    listTodo(displayData);
    $('#todoForm')[0].reset();
    $('.card-body').hide(300);
    

  });
}); // document ready

