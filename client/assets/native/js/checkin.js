$(document).ready(function(){

    var socket = io();

    var VALIDATE_COMPANY_ID = "validate_company_id";
    var ADD_VISITOR = "add_visitor";
    
    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    console.log(companyData);
    socket.emit(VALIDATE_COMPANY_ID, companyData);
    
    //Prevent users from scrolling around on iPad
    document.ontouchmove = function(e) {
        e.preventDefault();
    };

    //Bind Listeners
    $('#tap-to-check').on('click', startCheckIn);
    //$('.check-in').on('submit', submitForm); 
    $('#submit-btn').on('click', submitForm);

    //When a user starts their check in
    function startCheckIn(){
        $('.check-in').addClass('show');
        $('.check-in').animate({
            top:'10%',
            opacity: '1'
        }, 700);
        $(this).addClass('hide');
        $('#clock').addClass('hide');
    }

     $('input[type="text"]').each(function(){

         $(this).focus(function(){
               $(this).removeClass('error');
         });
    });


    function verifyData(data) {
        var success = true;
        if(data['first_name'] === "") {
            $("#visitor-first").addClass("error"); 
            success = false;
        }
        if(data['last_name'] === "") {
            $("#visitor-last").addClass("error"); 
            success = false;
        }
        console.log(data['phone_number']);
        var re = /^((\+\d{1,2}|1)[\s.-]?)?\(?[2-9](?!11)\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

        var validPhone = re.test(data['phone_number']);
        console.log(validPhone);
        if(!validPhone) {
            $("#visitor-number").addClass("error"); 
            success = false;
        }
        return success;
    }

    //When a patient submits their form
    function submitForm(){
        //event.preventDefault();
        var data = grabFormElements();

        if(!verifyData(data)) {
            
            return;
        }

        //console.log(data.company_id);
        if(localStorage.getItem("slackToken")&&localStorage.getItem("slackChannel"))
        {
             $.post("https://slack.com/api/chat.postMessage",
             {
                'token': localStorage.getItem("slackToken"),
                'channel': localStorage.getItem("slackChannel"), 
                'text': "Check In: \nName: " + data['first_name'] + " " + data['last_name'] + " Phone Number: " + data['phone_number']
             },
             function(data, status){
              });
        }
        socket.emit(ADD_VISITOR, data);

        $('.check-in').addClass('hide');
        $(this).animate({
            top:'35%',
            opacity:'0'
        },0);
        displayCheckin(data);
    }

    function displayCheckin(data) {
        var dt = new Date();
        var min = "";

        if(dt.getMinutes() < 10) 
            min = "0" + dt.getMinutes();
        else 
            min = dt.getMinutes();

        var time = dt.getHours() + ":" + min;
        $("#confirm-title").html("Hello, " + data['first_name'] + " " +
                                    data['last_name']);
        $("#confirm-name").html("You have successfully checked-in.");
        $("#confirm-time").html("Time now is " + time);
        $("#overlay").removeClass('hide');
        setTimeout(function() {
                    $(".check-in").submit();
                }, 3000);
    }

    //Grabs elements from the check in and puts it into an object
    function grabFormElements(){
        var newVisitor = {};
        newVisitor.company_id = companyData._id;
        newVisitor.first_name= $('#visitor-first').val();
        newVisitor.last_name = $('#visitor-last').val();
        newVisitor.phone_number = $('#visitor-number').val();
        newVisitor.checkin_time = new Date();
        return newVisitor;
    }

    //CLOCK
    function updateClock () {
        var currentTime = new Date ( );
        var currentHours = currentTime.getHours ( );
        var currentMinutes = currentTime.getMinutes ( );
        //var currentSeconds = currentTime.getSeconds ( );
        // Pad the minutes and seconds with leading zeros, if required
        currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
        //currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

        // Convert the hours component to 12-hour format if needed
        currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

        // Convert an hours component of "0" to "12"
        currentHours = ( currentHours == 0 ) ? 12 : currentHours;

        // Compose the string for display
        var currentTimeString = currentHours + ":" + currentMinutes;

        $("#clock").html(currentTimeString);
    }
    updateClock();
    setInterval(updateClock, 60 * 1000);

    /***
     * Find a specific cookie name
     * @param cName
     * @returns {string|*}
     */
    function getCookie(cName) {
        var name = cName + '=';
        var cookieArray = document.cookie.split(';');

        for (var i = 0, len = cookieArray.length; i < len; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ')
                cookie.substring(1);
            if (cookie.indexOf(name) == 0)
                return cookie.substring(name.length, cookie.length);
        }

    }


});
