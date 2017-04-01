$(function InitScoreArea(){
	console.log("Setting score event");  
    var icons = $('li i');
    $.each(icons, function (index, item){
           console.log(index + item);
           $(item).click(function(){
              if ($(item).hasClass('icon-circle')){
                 $(item).removeClass('icon-circle');
                 $(item).addClass('icon-circle-o');
              }
              else if ($(item).hasClass('icon-circle-o')){
                 $(item).removeClass('icon-circle-o');
                 $(item).addClass('icon-circle');
              };
       })
    });
});;

function IconClick(){
    console.log($(this));
}