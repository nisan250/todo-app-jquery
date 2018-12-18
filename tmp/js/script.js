console.log('script.js');
// $( document ).ready(function() {
//   console.log( "ready!" );
// });

$('.todo-addheading').on('click', function() {
  $('.card-body').toggle(300);
});

$.ajax({
  url: 'js/data.json'
}).done(function(data) {
  $('#field-todoTitle').text(data[0].todoTitle);
  $('#field-todoOwner').text(data[0].todoOwner);
  $('#field-todoDescription').text(data[0].todoNote);
});