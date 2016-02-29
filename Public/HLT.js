
window.myFirebaseRef = new Firebase("https://hlt.firebaseio.com/");

myFirebaseRef.child("api_key").on("value", function(snapshot) {
  document.getElementById('normal_button').style.display = "inline";
  window.api_key = snapshot.val()
});

function mediaType(){
  var type = ["movie"] //, "tv"] adding TV soon
  var random = Math.floor(Math.random()*type.length);
  window.media_type = type[random]
}

function mediaId(){
  window.media_id = Math.floor(Math.random()*100000) + 1
  }
      
function howLongTill(){
  var diff = Math.abs(new Date() - new Date('2016/12/25 12:00'));
  window.timeTill = diff / 1000 / 60 
}

function makeRequest() {
  console.log(media_id + " making request")
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.themoviedb.org/3/" + media_type + "/" + media_id + "?api_key=" + api_key, true);

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
        pushDud();
        document.getElementById("id").innerHTML = ""
        document.getElementById("runtime").innerHTML = ""
        document.getElementById("title").innerHTML = ""
        document.getElementById("time").innerHTML = ""
        document.getElementById("tagline").innerHTML = ""

       
      };
    }
  xhttp.send();
}

function getMovieData(){
  var ref = new Firebase("https://hlt.firebaseio.com/duds/");
  ref.orderByChild("bad_id").equalTo(media_id).on("value", function(snapshot) {
    if (snapshot.val() === null || undefined || ""){
      makeRequest();
      howLongTill();
    } else {
      mediaId();
      getMovieData();
    }
  });
}

function pushDud() {
  swal({   
        title: "Congratulations!",   
        text: "You have won an arbitrary lottery.",   
        type: "input",
        imageUrl: "http://weknowyourdreamz.com/images/surprise/surprise-05.jpg",   
        showCancelButton: true,   
        closeOnConfirm: false,   
        animation: "slide-from-top",   
        inputPlaceholder: "What's your name?" }, 
      function(inputValue){   
        if (inputValue === false) return false;      
        if (inputValue === "") {     
          swal.showInputError("You need to write something!");     
          return false   }      
          swal({title:"Spectacular Effort," + inputValue,
                text:"If you want to know what just happened. <a href='http://www.google.com' target='_blank'>Click Here.</a>",
                html: true}); 

          var dudsRef = myFirebaseRef.child("duds");
          var newFinder = dudsRef.push();
          newFinder.set({
            bad_id: media_id,
            nickname: inputValue
          });
        }
)}

function getData(){
  mediaType();
  mediaId();
  getMovieData() 
}
