window.myFirebaseRef = new Firebase("https://hlt.firebaseio.com/");

myFirebaseRef.child("api_key").on("value", function(snapshot) {
  document.getElementById('normal_button').style.display = "inline";
  window.api_key = snapshot.val()
});
myFirebaseRef.child("api_key").on("value", function(snapshot) {
  document.getElementById('random_button').style.display = "inline";
  window.api_key = snapshot.val()
});

var idRef = new Firebase("https://hlt.firebaseio.com/duds/");
idRef.orderByChild('bad_id').on("value", function(snapshot) {
  outerObject = snapshot.val()
  theKeys = Object.keys(snapshot.val())
  for (i = 0; i < theKeys.length - 1; i++){
    document.getElementById('leaderboard').innerHTML += "Bad Id: " + outerObject[theKeys[i]]['bad_id'] + " Nickname: " + outerObject[theKeys[i]]['nickname'] + "<br><br>"
  }
  
})

function mediaType(){
  var type = ["movie"] //, "tv"] adding TV soon
  var random = Math.floor(Math.random()*type.length);
  window.media_type = type[random]
}

function mediaId(){
  window.media_id = Math.floor(Math.random()*200000) + 1
}

function mediaName(){
  window.media_name = document.getElementById('titlepicker').value
}
      
function howLongTill(){
  window.pikADate = document.getElementById('datepicker').value || '2016/12/25'
  var diff = Math.abs(new Date() - new Date(pikADate));
  window.timeTill = diff / 1000 / 60 
}

function makeRequest() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.themoviedb.org/3/" + media_type + "/" + media_id + "?api_key=" + api_key, true);

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      json = JSON.parse(xhttp.responseText);
      if(media_type === "movie"){
        window.runtime = json['runtime']
        window.tagline = json['tagline']
        window.title = json['title']
        document.getElementById("id").innerHTML = "TMDb Id: " + media_id
        document.getElementById("runtime").innerHTML = "Runtime: " + runtime + " mins"
        document.getElementById("title").innerHTML = "You got: " + title
        document.getElementById("time").innerHTML = "You would need to watch ' " + title + "' about " + Math.round(Math.round(timeTill) / runtime) + " times until " + pikADate + " came round."
        if (tagline.length > 10){
          document.getElementById("tagline").innerHTML = "'" + tagline + '"'
        } else {
          document.getElementById("tagline").innerHTML =  "Filmed in " + json['spoken_languages'][0]['name'] || "What the shit: " + xhttp.responseText
        }
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
          return false   
        }      
        swal({title:"Spectacular Effort, " + inputValue,
              text:"If you want to know what just happened. <a href='./leaderboard.html' target='_blank'>Click Here.</a>",
              html: true
        }); 

        var dudsRef = myFirebaseRef.child("duds");
        var newFinder = dudsRef.push();
        newFinder.set({
          bad_id: media_id,
          nickname: inputValue
        });
      }
)}
function searchMovies() {
  mediaType();
  mediaName();
  document.getElementById('datepicker').style.display = "inline";
  document.getElementById('movieList').style.display = "inline";
  document.getElementById('titlepicker').style.display = "none";
  document.getElementById('normal_button').style.display = "none";
  document.getElementById('random_button').style.display = "none";
  document.getElementById('movieList').innerHTML = ""
  document.getElementById("datepicker")
    .addEventListener("change",
                      document.getElementById('specific_button')
                        .style
                          .display = "inline");
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.themoviedb.org/3/search/" + media_type + "?api_key=" + api_key +"&query='" + media_name, true);

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      window.json = JSON.parse(xhttp.responseText);
      var sel = document.getElementById('movieList');

      for(var i = 0; i < json['results'].length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = json['results'][i]['title'];
        opt.value = json['results'][i]['id'];
        sel.appendChild(opt);
      }
    }
  }
xhttp.send();
}

function getRandomData(){
  mediaType();
  mediaId();
  getMovieData() 
}

function getSpecificData(){
  mediaType();
  mediaName();
}
