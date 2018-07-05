$(document).ready(function(){
    // var conf = {
    //     apiKey: "AIzaSyAWxUOomZn1vPFN0R4d11f2oYM3iFsaUb8",
    //     authDomain: "session-list.firebaseapp.com",
    //     databaseURL: "https://session-list.firebaseio.com",
    //     projectId: "session-list",
    //     storageBucket: "session-list.appspot.com",
    //     messagingSenderId: "1084037743623"
    //   };
    //   firebase.initializeApp(conf);
    //   let userSessions = firebase.database();
	var config = {
        apiKey: "AIzaSyAGrun6JkFUDgSTJRFqDyPxzT0ymkDdPwI",
        authDomain: "session-a4950.firebaseapp.com",
        userSessionsURL: "https://session-a4950.firebaseio.com",
        projectId: "session-a4950",
        storageBucket: "session-a4950.appspot.com",
        messagingSenderId: "298286458371"
      };
    // firebase.initializeApp(config);
    let database = firebase.database();
$("#sessionSubmit").on("click", function(event){
    event.preventDefault()
    
            var Topic = $("#sessionTopic").val();
            var Place = $("#sessionLocation").val();
            var Address = $("#sessionAddress").val();
            var City = $("#sessionCity").val();
            var State = $("#sessionState").val();
            var Zipcode = $("#sessionZipcode").val();
            var Start = $("#sessionTimeStart").val();
            var End = $("#sessionTimeEnd").val();
    
    
            var sessionInfo = {
                topic:  Topic,
                location: Place,
                address: Address,
                city: City,
                state: State,
                zip: Zipcode,
                start: Start,
                end: End
            };
    
            console.log(sessionInfo)
            database.ref("sessionData").push(sessionInfo);
    
            // console.log(sessionInfo.topic);
            // console.log(sessionInfo.location); 
            // console.log(sessionInfo.start);
            // console.log(sessionInfo.end)
            
            // $("#sessionTopic").val("");
            // $("#sessionLocation").val("");
            // $("#sessionAddress").val("");
            // $("#sessionCity").val("");
            // $("#sessionState").val("");
            // $("#sessionZipcode").val("");
            // $("#sessionTimeStart").val("");
            // $("#sessionTimeEnd").val("");
     
    
        
    
            return false;
        });
    
    
        
        database.ref("sessionData").on("child_added", function(childSnapshot, prevChildKey){
    
            console.log(childSnapshot.val());
    
        
            var fbaseTopic = childSnapshot.val().topic;
            var fbaseLocation = childSnapshot.val().location;
            var fbaseStart = childSnapshot.val().start;
            var fbaseEnd = childSnapshot.val().end;
    
            
            
    
    
            $("#sessionBody").append(
                `
                <tr class='sessionThread'>
                    <th scope='row'>${fbaseTopic}</th>
                    <td>${fbaseLocation}</td>
                    <td>${fbaseStart} - ${fbaseEnd}</td>
                    <td> <button data-fbstart="${fbaseStart}" data-fbend="${fbaseEnd}" data-fbtopic="${fbaseTopic}" data-fblocation="${fbaseLocation}" name='sessionDetails' type='submit' class='sessionCommit'>+To My List</button></td></tr>
                `)
            $("#sessionCommit").addClass(function(n){
                return "td_" + n;
            });
            $(".sessionThread").addClass(function(n){
                return "td_" + n;
            });
        });

        //need to save these to database as well so persistent
        $(document).on("click", ".sessionCommit", function(event){
          let fbstart = $(this).attr("data-fbstart")
          let fbend = $(this).attr("data-fbend")
          let fbtopic = $(this).attr("data-fbtopic")
          let fblocation = $(this).attr("data-fblocation")
          console.log(fbstart, fbend, fbtopic, fblocation)
            $("#commitmentList").append(
            `<tr>
            <th scope='row'>${fbtopic}</th>
            <td>${fblocation}</td>
            <td>${fbstart} - ${fbend}</td></tr>`)
        })
    });