$(function InitScoreArea(){
	console.log("Setting score event");  
    AddClick();
});;

function AddClick(){
    var icons = $('li i');
    $.each(icons, function (index, item){
           $(item).click(function(){
              IconClick(item);
       })
    });
}

function IconClick(item){
    console.log($(item));
    var listitem = $(item).parent()
    console.log(listitem);
    var parentId = $(listitem).attr('id');
    console.log(parentId);
    var count = parentId.substring(1);
    var list = listitem.parent().children();
    console.log(list);
    $(list).each(function(index,li){
        var icon = $(li).children();
        if (index < count) //  dots before the clicked one
        { if (count<5){
            $(li).html("<i class='icon icon-circle' style='color:red'></i>");            
            }
          else{
            $(li).html("<i class='icon icon-circle' style='color:limegreen'></i>");
        }
        }else{// dots after the clicked one
            $(li).html("<i class='icon icon-circle-o'></i>");
        } 
    });
    AddClick();
}