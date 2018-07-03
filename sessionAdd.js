$(document).ready(function(){

	var config = {
        apiKey: "AIzaSyAWxUOomZn1vPFN0R4d11f2oYM3iFsaUb8",
        authDomain: "session-list.firebaseapp.com",
        databaseURL: "https://session-list.firebaseio.com",
        projectId: "session-list",
        storageBucket: "",
        messagingSenderId: "1084037743623"
      }
      
		
	
	  firebase.initializeApp(config)
	  var sessionData = firebase.database()
$("#sessionSubmit").on("click", function(event){
    event.preventDefault()
    
            var Topic = $("#sessionTopic").val().trim();
            var Place = $("#sessionLocation").val().trim();
            var Start = $("#sessionTimeStart").val().trim();
            var End = $("#sessionTimeEnd").val().trim();
    
    
            var sessionInfo = {
                topic:  Topic,
                location: Place,
                start: Start,
                end: End
            };
    
            console.log(sessionInfo)
            sessionData.ref().push(sessionInfo);
    
            console.log(sessionInfo.topic);
            console.log(sessionInfo.location); 
            console.log(sessionInfo.start);
            console.log(sessionInfo.end)
    
            
    
            
    
            
            $("#sessionTopic").val("");
            $("#sessionLocation").val("");
            $("#sessionTimeStart").val("");
            $("#sessionTimeEnd").val("");
    
        
    
            return false;
        });
    
    
        
        sessionData.ref().on("child_added", function(childSnapshot, prevChildKey){
    
            console.log(childSnapshot.val());
    
        
            var fbaseTopic = childSnapshot.val().topic;
            var fbaseLocation = childSnapshot.val().location;
            var fbaseStart = childSnapshot.val().start;
            var fbaseEnd = childSnapshot.val().end;
    
            
            
    
    
            $("#sessionTable").append("<tr><th scope='row'>" + fbaseTopic + "</th><td>" + fbaseLocation + "</td><td>" + fbaseStart + "-" + fbaseEnd + "</td><td>" + "<button type='submit' id='sessionCommit' class='btn btn-default'>+ To My List</button>" + "</td></tr>");
    
        });

    });