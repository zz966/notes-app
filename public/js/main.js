$(document).ready(function(){
    $('.delete-article').on('click', function(e){
      $target = $(e.target);
      const id = $target.attr('data-id');
      $.ajax({
        type:'DELETE',
        url: '/article/'+id,
        success: function(response){
          alert('Deleting Article');
          window.location.href='/';
        },
        error: function(err){
          console.log(err);
        }
      });
    });

    $('#submitBtn').click(function (e) { //未使用

      $.ajax({
        url: '/articles/add',
        type: 'POST',
        cache: false,
        data: {
          author: $('#author').val(),
          title: $('#title').val(),
          body: $('#body').val(),
        },
        success: function () {
          // $('#error-group').css('display', 'none');
          //  alert('Your submission was successful');
           window.location.href='/';
        },
        error: function (err) {
          // $('#error-group').css('display', 'block');
          // var errors = JSON.parse(data.responseText);
          // var errorsContainer = $('#errors');
          // errorsContainer.innerHTML = '';
          // var errorsList = '';
    
          // for (var i = 0; i < errors.length; i++) {
          //   errorsList += '<li>' + errors[i].msg + '</li>';
          // }
          // errorsContainer.html(errorsList);
          console.log(err);
        }
      });
    });




  });
  