function reset()
{
document.cookie='listOrder=null; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
}
u=1;
$.post("imagesizes.php", function(data){
    imgobj0 = $.parseJSON(data);
}); 
function imageupdate(){
    var imagearray = document.getElementsByClassName('image');
    $.post("imagesizes.php", function(data){
        if(u==1){
            imgobj1 = $.parseJSON(data);
            u=0;
        }else if(u==0){
            imgobj0 = $.parseJSON(data);
            u=1;
        }
    for(var i=0;i<imagearray.length;i++){
        var id=imagearray[i].id;
        var isrc=imagearray[i].src;
        var isrc=isrc.split("?");
         document.getElementById(id).src=(isrc[0]+"?"+Math.floor((Math.random()*100000000000)));
         
         var isrc2=isrc[0].split("/mosaic/");
         var isrc2=isrc2[1];
         if(imgobj1[isrc2]!=imgobj0[isrc2]){
            var imgid=isrc2.split(".");
            var imgid=imgid[0];
            $("#div-"+imgid+" .updated").css("display","block");
         }
        }    
        setTimeout('$(".updated").fadeOut("slow");',750);  
    });
}
var imgupd=setInterval("imageupdate()",20000);

var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-4783643-4']);
  _gaq.push(['_trackPageview']);

// (function() {
//    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
//  })();

f=0;
sLoop = '';
sFrames = '';
$(".feedback-button").click(function(){
    if(f==0){
       f=1;
       $("#feedback").animate({right:'+=300'},400) 
    }
    else if(f==1){
        f=0;
        $("#feedback").animate({right:"-300"},400)
    }
})
$("#submit-feedback").click(function(){
    $.post('feedback.php',{name:$("#name").val(),feedback:$("#message").val()},function(){
        if(f==1){
            f=0;
            $("#feedback").animate({right:"-300"},400)
        }
    })
})
$("img[rel]").overlay({
onBeforeLoad: function() {
        document.getElementById('fullimage').src='';
        cam=this.getTrigger().attr("id")
        var url = 'http://www.camviewing.com/mosaic/'+cam+'_640.jpg'+"?"+Math.floor((Math.random()*100000000000));
        document.getElementById('fullimage').src=url;
		}
});
$(".imagediv").hover(
    function(){
        $(this).find(".controls").stop(true, true).delay(400).fadeIn("slow");
    },
    function(){
        $(this).find(".controls").stop(true, true).fadeOut("slow");
    }
);
$(".controls div.loop[rel]").overlay({
onBeforeLoad: function() {
        var frames=this.getTrigger().html();
        sLoop=frames;
        var cam=this.getTrigger().parent().siblings("img").attr("id");
        sCam=cam;
        var url='http://www.camviewing.com/mosaic/loop_popup.php?cam='+cam+'&frames='+frames;
        document.getElementById('loopframe').src=url;
		},
  onClose: function(){
    document.getElementById('loopframe').src='';
    if(frames<121){
        $("#savebox").html('<button id="saveloop">Save to Video</button><button id="savegif">Save to Video</button>');
    }else{
        
    }
    $("#savebox").html('<button id="saveloop">Save to Video</button>');
    
  }
});
$(".controls div.archive[rel]").overlay({
onBeforeLoad: function() {
        var cam=this.getTrigger().parent().siblings("img").attr("id");
        var name=this.getTrigger().parent().siblings("span").html();
        $('#cam').val(cam);
        $('#aloopname').html(name);
		},
  onClose: function(){
    $('#dayselect').html('<option value="" selected="selected" class="remove">Select Day</option>');
    $('#startselect').css('visibility','hidden');
    $('#startselect').empty();
    $('#durationselect').css('visibility','hidden');
    $('#durationselect').empty();
    $('#asubmit').css('visibility','hidden');
    $('#loopframe2').attr('src','');
    $('#aloopname').html('');
  }
});
function degToDir(deg){
    if(348.75<deg || deg<11.25)
        return "N";
    if(11.25<deg && deg<33.75)
        return "NNE";
    if(33.75<deg && deg<56.25)
        return "NE";
    if(56.25<deg && deg<78.75)
        return "ENE";
    if(78.75<deg && deg<101.25)
        return "E";
    if(101.25<deg && deg<123.75)
        return "ESE";
    if(123.75<deg && deg<146.25)
        return "SE";
    if(146.25<deg && deg<168.75)
        return "SSE";
    if(168.75<deg && deg<191.25)
        return "S";
    if(191.25<deg && deg<213.75)
        return "SSW";
    if(213.75<deg && deg<236.25)
        return "SW";
    if(236.25<deg && deg<258.75)
        return "WSW";
    if(258.75<deg && deg<281.25)
        return "W";
    if(281.25<deg && deg<303.75)
        return "WNW";
    if(303.75<deg && deg<326.25)
        return "NW";
    if(326.25<deg && deg<348.75)
        return "NNW";
}
$(".controls div.info[rel]").overlay({
onBeforeLoad: function() {
        
        var cam=this.getTrigger().parent().siblings("img").attr("id");
        $.post('info.php',{'cam':cam},function(data){
            var info = $.parseJSON(data);
          
            var html = '<div class="info">'+
                        '<span class="title">Current Conditions (Station: '+info['location']+')</span>'+
                        '<span class="items">Temp: '+info['temperature'][0]+' F</span>'+
                        '<span class="items">Wind: '+info['windspeed'][0]+' mph '+degToDir(info['winddirection'][0])+'</span>'+
                        '<span class="items">Pressure: '+info['pressure'][0]+' in </span>'+
                        '<span class="items">Visibility: '+info['visibility'][0]+' mi </span>'+
                        '<span class="items">Humidity: '+info['humidity'][0]+'% </span>'+
                        '<span class="items" style="padding:4px"><input id="radarbutton" name="button" type="button" style="height:18px;font-size:9px;background-color:#ff9999" onclick="toggleRadar();" value="RADAR off" /></span>'+
                        '<span class="items" style="padding:4px"><input id="satbutton" name="button" type="button" style="height:18px;font-size:9px;background-color:#ff9999" onclick="toggleSat();" value="SAT off" /></span>'+
                        '</div>';
                        
            $("#overlay3").prepend(html);
            var center = new google.maps.LatLng(info['lat'],info['lon']);
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
            marker = new google.maps.Marker({
                position: center,
                map:map
            });
            marker.setMap(map);
            
        });
		},
  onClose: function(){
    $("#overlay3 .info").remove();
    marker.setMap(null);
    if(stoggle == 1 || rtoggle == 1) {
        map.overlayMapTypes.clear();
        stoggle = 0;
        rtoggle = 0;
    }
  }
});
$(".imagediv span").hover(
    function(){
        $(this).stop(true, true).delay(600).animate({opacity:1.0});
    },
    function(){
        $(this).stop(true, true).animate({opacity:0.4});
    }
);
$(".controls").hover(
    function(){
        $(this).animate({opacity:1.0});
    },
    function(){
        $(this).animate({opacity:0.5});
    }
);
map = '';
    function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(37.4419, -122.1419),
          zoom: 7
        };
        map = new google.maps.Map(document.getElementById("map"),mapOptions);
        
        
    }
    
     
    var rtoggle=0;
    var stoggle=0;
 
    function toggleRadar() {
      if(rtoggle == 1) {
        map.overlayMapTypes.removeAt("2");
        $('#radarbutton').val('RADAR off');
        $('#radarbutton').css('background-color','#ff9999');
        rtoggle = 0;
      } else {
        //map.overlayMapTypes.push(null);
        map.overlayMapTypes.setAt("2",tileNEX);
        rtoggle = 1;
        $('#radarbutton').val('RADAR ON');
        $('#radarbutton').css('background-color','#66ff66');
      }
    }
    function toggleSat() {
      if(stoggle == 1) {
        map.overlayMapTypes.removeAt("1");
        $('#satbutton').val('SAT off');
        $('#satbutton').css('background-color','#ff9999');
        stoggle = 0;
      } else {
        //map.overlayMapTypes.push(null);
        map.overlayMapTypes.setAt("1",tileSAT);
        stoggle = 1;
        $('#satbutton').val('SAT ON');
        $('#satbutton').css('background-color','#66ff66');
      }
    }
    
    tileNEX = new google.maps.ImageMapType({
            getTileUrl: function(tile, zoom) {
                return "http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/" + zoom + "/" + tile.x + "/" + tile.y +".png?"+ (new Date()).getTime(); 
            },
            tileSize: new google.maps.Size(256, 256),
            opacity:0.60,
            name : 'NEXRAD',
            isPng: true
        });
        
    tileSAT = new google.maps.ImageMapType({
        getTileUrl: function(tile, zoom) {
            return "http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-ir-4km-900913/" + zoom + "/" + tile.x + "/" + tile.y +".png?"+ (new Date()).getTime(); 
        },
        tileSize: new google.maps.Size(256, 256),
        opacity:0.8,
        name : 'GOES ir',
        isPng: true
    });
      
    function refreshRadar() {
        if (toggle == 1) {
    	   map.overlayMapTypes.clear();
    	   map.overlayMapTypes.push(null); // create empty overlay entry
            map.overlayMapTypes.setAt("1",tileNEX);
        }
    }
    //setInterval ( "refreshRadar()", 60000 );
        
google.maps.event.addDomListener(window, 'load', initialize);

$('#dayselect').focus(function(){
var t = $(this);
t.empty();
var cam=$('#cam').val();
$.post('ajax.php',{'action':'getdays','cam':cam},function(data){
    t.append(data);
    $('.remove').remove();
    }); 
});
    
 $('#dayselect').change(function(){
    var date = $(this).val();
    $('#startselect').css('visibility','visible');
    $('#startselect').empty();
    $('.remove').remove();
    $.post('ajax.php',{'action':'getstart','cam':$('#cam').val(),'date':date},function(data){
        $('#startselect').append(data);
    }); 
});
$('#startselect').focus(function(){
    $('.remove').remove();
});
$('#startselect').change(function(){
    var date = $('#dayselect').val();
    var start = $(this).val();
    $('#start').val($('#startselect option:selected').attr('num'));
    $('#durationselect').css('visibility','visible');
    $('#durationselect').empty();
    $.post('ajax.php',{'action':'getduration','start':start,'cam':$('#cam').val(),'date':date},function(data){
        $('#durationselect').append(data);
    }); 
});
$('#durationselect').focus(function(){
    $('.remove').remove();
});
$('#durationselect').change(function(){
    var cam = $('#cam').val();
    var date = $('#dayselect').val();
    var start = $('#start').val();
    var duration = $(this).val();
    var url='http://www.camviewing.com/mosaic/loop_archive.php?cam='+cam+'&frames='+duration+'&start='+start+'&date='+date;
    $('#asubmit').css('visibility','visible');
    $('#asaveloop').css('visibility','visible');
    if(duration<121){
    $('#asavegif').css('visibility','visible');
    }else{
    $('#asavegif').css('visibility','hidden');    
    }
    $('#aurl').val(url);
});
$('#asubmit').click(function(){
    $('#loopframe2').attr('src',decodeURIComponent($('#aurl').val()));
});
$('#saveloop').live('click',function(){
    $(this).replaceWith('<img src="../archive/loading.gif" id="loading">');
    $.post('ajax.php',{'action':'tovideo','cam':sCam,'frames':sLoop},function(data){
        $("#loading").replaceWith('<a href="'+data+'">Download mp4 video</a>');
        
    });
    return false;
});
$('#savegif').live('click',function(){
    $(this).replaceWith('<img src="../archive/loading.gif" id="loading">');
    $.post('ajax.php',{'action':'togif','cam':sCam,'frames':sLoop},function(data){
        $("#loading").replaceWith('<a href="'+data+'">Download GIF</a>');
        
    });
    return false;
});
$('#asaveloop').live('click',function(){
    var cam = $('#cam').val();
    var date = $('#dayselect').val();
    var start = $('#start').val();
    var duration = $('#durationselect').val();
    $(this).replaceWith('<img src="../archive/loading.gif" id="aloading">');
    $.post('ajax.php',{'action':'atovideo','cam':cam,'frames':duration,'date':date,'start':start},function(data){
        $("#aloading").replaceWith('<a href="'+data+'">Download mp4 video</a>');
    });
    return false;
})
$('#asavegif').live('click',function(){
    var cam = $('#cam').val();
    var date = $('#dayselect').val();
    var start = $('#start').val();
    var duration = $('#durationselect').val();
    $(this).replaceWith('<img src="../archive/loading.gif" id="aloading">');
    $.post('ajax.php',{'action':'atogif','cam':cam,'frames':duration,'date':date,'start':start},function(data){
        $("#aloading").replaceWith('<a href="'+data+'">Download animated gif</a>');
    });
    return false;
})
//$('.nav ul li a').mouseover(function(){
  // $(this).animate() 
//});


