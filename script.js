    var flight_id;
    var departure_id;
    var arrival_id;
    var airline_id;
    var departure_airport;
    var arrival_airport;
    var root_url = "http://comp426.cs.unc.edu:3001/";
    var fid_array;
    var arrival, departure, number; 
    var f, m, l, email, gender, age; 
    var latitude, longitude;
    var departure_time;

window.onload = function(){
   
    //populate flight list
    fid_array = [];
    var populate = function(){
         $.ajax(root_url + 'flights/',
			      {
				  type: 'GET',
				  dataType: 'json',
				  xhrFields: {withCredentials: true},
				  success: (response) => {
                      fid_array = response;
                      for(let i = 0; i < fid_array.length; i++){
                          $("#flight_list").append("<li><a href = #flight_list class = 'flight_link'>"+fid_array[i].id+"</a></li>")
                      }
				  }
			      }); 
    }

var log_in = function() { 
    var login_url = root_url + "sessions";
    $.ajax(login_url,
           { 
            type: 'POST',
            xhrFields: {withCredentials: true},
            data: { "user": {
            "username": "jmn", //our username
            "password": "jmn426" //our password
            }
        },
        success: (response) => {
        console.log("logged in!");
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
        console.log("failed login");
        }
    });

}
    
    $(document).ready(function () {
    log_in();
    populate();
});
    
     
   
        
    
    
    //click on your flight
    
    $(document).on('click', '.flight_link', function(){
        flight_id = this.innerHTML;
        flight_id.parseInt;
        var resp_array = [];
        logFlightInfo();
        $.ajax(root_url + 'instances/',
			      {
				  type: 'GET',
				  dataType: 'json',
				  xhrFields: {withCredentials: true},
				  success: (response) => {
                      resp_array = response;
                      resp_array.forEach(function(element){
                         if(flight_id == element.flight_id){
                             if(element.is_cancelled){
                                     logFlightInfo();
                                      flight_cancelled();
                                    
                             }else{
                                 
                                 logFlightInfo();
                                 
                                 $('#container').empty();
                                 $('#container').append("<div id = congrats><h1>Congratulations!</h1></div>");
                                 $('#container').append("<hr>");
                                 $('#container').append("<div id=sched>Your flight is as scheduled <div><button id=another><a href = '#' id = 'an'>Check Another Flight</a></button></div></div>")
                                 
                             }
                         }                  
                      })
				  }
			      }); 
       
    });
   
    
    //check another flight
    var cont = "<div id='container'><h2>Is My Flight Cancelled?</h2><input type='text' id='input' placeholder='Search for your flight number...'><div id = 'ul_cont'><ul id='flight_list'></ul><div id='acc'><p>Having trouble viewing this page?</p></div> <button id = 'changeStyle'>Click Here!</button></p></div>"
    $(document).on('click', '#another', function(){
        $('body').empty();
        $('body').append(cont);
        populate();
    })
    
    //filter for flights
    $(document).on('keyup', '#input', function(){
        
        var input, filter, ul, li, a, i, textValue;
        
        input = document.getElementById("input");
        value = input.value.toUpperCase();
        ul = document.getElementById("flight_list");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            textValue = a.innerText;
            if (textValue.toUpperCase().indexOf(value) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    });
   
        
    var link = document.getElementById("link");
    $(document).on('click', '#changeStyle', function(){
        if(link.className == "1"){
            link.className = "2"
             link.href = "accstyles.css"
        } else{
            link.className = "1";
            link.href = "styles.css"
        }
        
        $('#acc').remove();
        $('body').append("<button id = 'undo'>Undo Accessibility Mode</button>");
       
    });
    
    $(document).on('click', '#undo', function(){
        if(link.className == "1"){
            link.className = "2"
             link.href = "accstyles.css"
        } else{
            link.className = "1";
            link.href = "styles.css"
        }
        
        $('#undo').remove();
        
        $('#ul_cont').append("<div id='acc'><p>Having trouble viewing this page? <button id = 'changeStyle'>Click Here!</button>");
       
    });
    
    
    var next_available_flights = function() {
        $('body').empty();
        $('body').append('<div id = "AFF"><h4>Available flights from ' + departure_airport + ' to ' + arrival_airport + '</h4><div id="list_of_available_flights"></div></div>');
       

        $.ajax(root_url + 'flights?filter[departs_at_gt]='+ {
            type: 'GET',
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
            if(response != null) {
                
                let flight_numbers = [];

            for(let i=0; i < response.length; i++) {
                if(response[i].departure_id == departure_id & response[i].arrival_id == arrival_id) {
                  let departyear = response[i].departs_at.substring(0, 4);
                let departmonth = response[i].departs_at.substring(5, 7);
                let departday = response[i].departs_at.substring(8, 10);
                let departtime = response[i].departs_at.substring(11, 16);
                let arriveyear = response[i].arrives_at.substring(0, 4);
                let arrivemonth = response[i].arrives_at.substring(5, 7);
                let arriveday = response[i].arrives_at.substring(8, 10);
                let arrivetime = response[i].arrives_at.substring(11, 16);
                    let b = $('<input/>').attr({
                             type: "button",
                            class: "select_flight_button",
                             id: response[i].id
                        })
                    $('#list_of_available_flights').append(b); //Add the button
                    $('#list_of_available_flights').append('<div class="available_flight" data-flight-number="' + response[i].number + '">Flight number: ' + response[i].number + ' Departs at: ' + departtime + ' on ' + departmonth + '/' + departday + '/' + departyear + ' Arrives at: ' + arrivetime + ' on ' + arrivemonth + '/' + arriveday + '/' + arriveyear + '</span><br><br></div>');
                        }
                    }
                }else {
                    console.log("data was null");
                    $('#list_of_available_flights').append('<div>No available flights :(</div>');
                }
                if ($('#list_of_available_flights').children().length == 0) {
                    $('#list_of_available_flights').append('<div>No available flights :(</div>');
                    }
            }
    });

   
    }
    
    //selecting a flight
    $(document).on('click', '.select_flight_button', function(){
        var myid = $(this).attr('id'); 
        $.ajax(root_url + 'flights/' + myid,
			      {
				  type: 'GET',
				  dataType: 'json',
				  xhrFields: {withCredentials: true},
				  success: (response) => {
                      let flights = response;
                      arrival = flights.arrives_at;
                      departure = flights.departs_at;
                      number = flights.number;
                      }
        
    });
        
        ticket_info_interface();
        getll();
    });
    
    
    //call this function if Is_Cancelled is true
    var flight_cancelled = function() {
    $('body').empty();
    $('body').append('<div id = "is_cancelled_cont"><div id="flight_cancelled_text">Your flight has been cancelled!</div><div id="add_message">(Optional) Send a message to your airline below:</div><textarea id="message_to_airline"></textarea><div><button id="send_message">Send message</button><button id="next_available_flights_button">Click here to check the next available flights</button></div></div>')
      
   
    }
    
    $(document).on('click', '#send_message', function() {
    let themessage = $(this).parent().find('#message_to_airline').val();
    $.ajax(root_url + 'airlines/' + airline_id, {
    type: 'PUT',
    dataType: 'json',
    xhrFields: {withCredentials: true},
    data: {"airline": {
    "info": themessage
    }
    },
    success: (response) => {
      $('#message_to_airline').remove();
        $('#send_message').remove();
        $('#add_message').replaceWith('<div>Message sent!</div>');
    }
    });
    });
    
    $(document).on('click', '#next_available_flights_button', function() {

    next_available_flights();

    });

    $(document).on('click', '.available_flight', function() {

    new_flight_number = $(this).data('flight-number');

    });
    
    
    //log flight info on flight id click
    
    var logFlightInfo = function(){
        
    //get info from flights page
     $.ajax(root_url + 'flights/',
			      {
				  type: 'GET',
				  dataType: 'json',
				  xhrFields: {withCredentials: true},
				  success: (response) => {
                      let flights = response;
                      for(let i = 0; i < flights.length; i++){
                         if (flight_id == flights[i].id){
                            departure_id = flights[i].departure_id;
                            arrival_id = flights[i].arrival_id;
                            airline_id = flights[i].airline_id;
                             departure_time = flights[i].departs_at;
                         }
                      }
                      
                      //get info from airports page
                    $.ajax(root_url + 'airports/',
                                  {
                                  type: 'GET',
                                  dataType: 'json',
                                  xhrFields: {withCredentials: true},
                                  success: (response) => {
                                      let airports = response;
                                      for(let i = 0; i < airports.length; i++){
                                         
                                         if (departure_id == airports[i].id){
                                             departure_airport = airports[i].name;
                                         }
                                          if(arrival_id == airports[i].id){
                                              arrival_airport = airports[i].name;
                                          }
                                      }
                                  }
                                  }); 
                      
				  }
			      }); 
        
    
        
    }// end log flight info
    
    var ticket_info_interface = function() {
    let body = $('body');
    body.empty();
    let reserve = $('<h2 class ="seat_info">Reserving Available Seat on Flight ' + flight_id + '</h2>')
    let header = $('<h3 class="title_info">Enter Ticket Holder Information</h3>');
    body.append(reserve);
    
    let infoDiv = $('<div id=myInfo></div>');
    infoDiv.append(header);
    let fnameDiv = $('<div id="fname" class="tic"></div>');
    fnameDiv.append('First Name:* ');
    $('<input/>').attr({ type: 'text', class: 'cust_fname', placeholder:'First Name'}).appendTo(fnameDiv);
    infoDiv.append(fnameDiv);
     
    let mnameDiv = $('<div id="mname" class="tic"></div>');
    mnameDiv.append('Middle Name: ');
    $('<input/>').attr({ type: 'text', class: 'cust_mname', placeholder: 'Middle Name'}).appendTo(mnameDiv);
    infoDiv.append(mnameDiv);
    
    let lnameDiv = $('<div id="lname" class="tic"></div>');
    lnameDiv.append('Last Name:* ');
    $('<input/>').attr({ type: 'text', class: 'cust_lname', placeholder: 'Last Name'}).appendTo(lnameDiv);
    infoDiv.append(lnameDiv);
    
    let ageDiv = $('<div id="age" class="tic"></div>');
    ageDiv.append('Age:* ');
    $('<input/>').attr({ type: 'text', class: 'cust_age', placeholder: 'Age'}).appendTo(ageDiv);
    infoDiv.append(ageDiv);
    
    let emailDiv = $('<div id="email" class="tic"></div>');
    emailDiv.append('Email:* ');
    $('<input/>').attr({ type: 'text', class: 'cust_email', placeholder: 'Email'}).appendTo(emailDiv);
    infoDiv.append(emailDiv);
    
    let genderDiv = $('<div id="gender" class="tic"></div>');
    genderDiv.append('Gender:* ');
    $('<input/>').attr({ type: 'text', class: 'cust_gender', placeholder: 'Gender'}).appendTo(genderDiv);
    infoDiv.append(genderDiv);
    
    let warning = $('<h6 class = "warn">(*) Required</h6>');
    infoDiv.append(warning);
    body.append(infoDiv);
    $("#myInfo").append("<button type ='button' class='subTicket'>Submit </button>");  
   
    
    $('.subTicket').click(function(){
        if (validate_form()) {
            create_ticket_interface(); 
        }
});
        
} 
var validate_form = function() {
        f = $('.cust_fname').val();
        m = $('.cust_mname').val();
        l = $('.cust_lname').val();
        age = $('.cust_age').val();
        gender = $('.cust_gender').val();
        email = $('.cust_email').val();
    if (f == '' || l == '' || gender == '' || age == '' || email == '') {
            $('h6.warn').append('<h6 class="error1">All required items must be filled in.</h6>');
        return false; 
    }
    if (isNaN(age) || age < 1) {
        $('h6.warn').append('<h6 class="error2">Age must be a valid number.</h6>');
        return false;
    }
    create_itinerary(email);
    create_ticket(f, m, l, age, gender);
    return true; 
}

var create_ticket_interface = function() {
    let body = $('body');
    body.empty(); 
    let men = modemenu();
    body.append(men);
    
    let ticketDiv = $('<div id="myTicket"></div>');
    let yourTicketHeader = $('<h3 class = "ticHead">Congratulations! You have booked a ticket on flight ' + number + '</h3>')
    body.append(yourTicketHeader);
    
    let name = l + ', ' + f + ' ' + m;
    let img = document.createElement("img");
    img.src = "https://cdn1.iconfinder.com/data/icons/transportation-28/100/26_Airplane_take_off-512.png";
    let ticketName = $('<h5>' + name + '</h5>');
    let ticketInfo = $('<h6> Age: ' + age + "   Gender: " + gender + '</h6>');
    let myflightInfo = $('<h5> Flight #' + number + ' from ' + departure_airport + ' to ' + arrival_airport + '</h5>'); 
    ticketDiv.append(img);
    ticketDiv.append(ticketName);
    ticketDiv.append(ticketInfo);
    ticketDiv.append(myflightInfo);
    body.append(ticketDiv);
    
    var val = Math.floor(1000 + Math.random() * 9000);
    
    let code = "FLY" + val;
    
    
}

$(document).on('click', '#ticketmode', function() {  
    create_ticket_interface();
});

$(document).on('click', '#mapmode', function() {  
    create_map_interface();
});

var getll = function() {
    $.ajax(root_url + 'airports/',
			      {
				  type: 'GET',
				  dataType: 'json',
				  xhrFields: {withCredentials: true},
				  success: (response) => {
                      let flights = response;
                      for(let i = 0; i < flights.length; i++){
                          if(departure_id == flights[i].id){
                             longitude = flights[i].longitude;
                              latitude = flights[i].latitude;
                          }
                      }
                  }
    });
}
    
var create_map_interface = function() {
    let body = $('body');
    body.empty(); 
    let men = modemenu();
    body.append(men);
    
    let mapDiv = $('<div class="mapDiv"></div>');
    mapDiv.append('<h3 class = "maptext">See map below for '+ departure_airport +' airport location.<h3>');
    body.append(mapDiv);
    let map = $('<div style="width: 480px; height: 360px" id="mapContainer"></div>');
    
    mapDiv.append(map);
    add_map();
}

var modemenu = function() { //Creates a ticket and a map mode menu
    let menuDiv = $('<div id="modes"></div>');
    let b1 = $('<button id=ticketmode><a href = "#" id = "an">Ticket</a></button>');
    let b2 = $('<button id=mapmode><a href = "#" id = "nofl">Map</a></button>');
    menuDiv.append(b1);
    menuDiv.append(b2);
    return menuDiv;
}

var create_itinerary = function(email) {
    let itinerary_url = root_url + "itineraries"; 
        let val = Math.floor(1000 + Math.random() * 9000);
    let code = "FLY" + val;
        $.ajax(itinerary_url, 
            {   type: 'POST', 
                xhrFields: {withCredentials: true}, 
                data: { "itinerary": {
                        "confirmation_code": code,
                        "email": email
                        }
                },
                success: (response) => { 
                    console.log("should be there!");
                    },
            });  
}

var create_ticket = function(fname, mname, lname, age, gender) {
    let ticket_url = root_url + "tickets"; 
        
        $.ajax(ticket_url, 
            {   type: 'POST', 
                xhrFields: {withCredentials: true}, 
                data: { "ticket": {
                "first_name": fname,
                "middle_name": mname,
                "last_name": lname,
                "age": age,
                "gender": gender,
                "is_purchased": true,
                "price_paid":   "122.50",
                "instance_id":  1,
                "seat_id":      2
  }
                },
                success: (response) => { 
                    console.log("ticket created!");
                    },
            });  
}


var add_map = function() {
    // Initialize the platform object:
    var platform = new H.service.Platform({
    'app_id': 'MTuNW0C6b1aixvnAiZho',
    'app_code': 'PwXNhrS1Cbpm8CZpWdGDWQ'
    });

    // Obtain the default map types from the platform object
    var maptypes = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new H.Map(
    document.getElementById('mapContainer'),
    maptypes.normal.map,
    {
      zoom: 15,
      center: { lng: longitude, lat: latitude }
    });
}
    
    //end onload
 
}

 



