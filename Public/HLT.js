
function mediaType(){
  var type = ["movie"] //, "tv"] adding TV soon
  var random = Math.floor(Math.random()*type.length);
  window.media_type = type[random]
}

function mediaId(){
  if(media_type === "movie"){
    window.ids = [501, 2, 3, 5, 6, 8, 9, 388, 280]
  } else {
    //var ids = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
  var random = Math.floor(Math.random()*ids.length);
  // window.media_id = ids[random]
  window.media_id = Math.floor(Math.random()*10) + 1
}

function howLongTill(){
  var diff = Math.abs(new Date() - new Date('2016/12/25 12:00'));
  window.timeTill = diff / 1000 / 60 
}

function getData() {
  mediaType();
  mediaId();
  howLongTill();
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.themoviedb.org/3/" + media_type + "/" + media_id + "?api_key=e8a58e66432e51a990d0ade02a4e6362", true);

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      json = JSON.parse(xhttp.responseText);
      if(media_type === "movie"){
        window.runtime = json['runtime']
        window.tagline = json['tagline']
        window.title = json['title']
        document.getElementById("id").innerHTML = "TMDb id: " + media_id
        document.getElementById("runtime").innerHTML = "Runtime: " + runtime + " mins"
        document.getElementById("title").innerHTML = "Title of film: " + title
        document.getElementById("time").innerHTML = "Watch " + title + " about " + Math.round(Math.round(timeTill) / runtime) + " times till christmas."
        document.getElementById("tagline").innerHTML = "'" + tagline + '"' || "Filmed in " + json['spoken_languages'][0]['name'] || "What the shit: " + xhttp.responseText
      } else {
        //TV Parsing
      } 
    } else if(xhttp.status == 404) {
        document.getElementById("id").innerHTML = ""
        document.getElementById("runtime").innerHTML = ""
        document.getElementById("title").innerHTML = ""
        document.getElementById("time").innerHTML = ""
        document.getElementById("tagline").innerHTML = ""

      swal({   
        title: "Congratulations!",   
        text: "You have won an arbitrary lottery.",   
        type: "input",
        imageUrl: "http://weknowyourdreamz.com/images/surprise/surprise-05.jpg",   
        showCancelButton: false,   
        closeOnConfirm: false,   
        animation: "slide-from-top",   
        inputPlaceholder: "What's your name?" }, 
      function(inputValue){   
        if (inputValue === false) return false;      
        if (inputValue === "") {     
          swal.showInputError("You need to write something!");     
          return false   }      
          swal("Nice!", 
            "You're a winner, " + inputValue, "success"); 
      });
    }
  };
  xhttp.send();
}

//firebase for Duds, "leaderboard" style retire bad Id's.