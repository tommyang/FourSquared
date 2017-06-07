$(document).ready(function(){
    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var myCompanyId = companyData._id;
    var curUser = JSON.parse(localStorage.getItem('currentUser'));

  
    $('#user-name').text(curUser.first_name + ' ' +  curUser.last_name);

    var appts = getAppts();

    function initializeAppts (appts){
      appts.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
      });
      for(var i = 0, len = appts.length; i < len; i++){
        appts[i].fullDate = formatDate(appts[i].date);
        appts[i].appointmentTime = formatTime(appts[i].date);
      }
      return appts;
    }

    appts = initializeAppts(appts);
    var source = $("#appt-list-template").html();
    var template = Handlebars.compile(source);
    var compiledHtml = template(appts);

    $("#appt-list").html(compiledHtml);
    $('.save-btn').click(submitForm);
    $('#close-btn').click(closeForm);
    
   /***
     * Makes a get request to display list of appts
     * @param none
     * @returns displays the appt list
     */
    function getAppts() {
       var json;
       $.ajax({
           dataType: 'json',
           type: 'GET',
           data: $('#response').serialize(),
           async: false,
           url: '/api/appointments/company/' + myCompanyId,
           success: function(response) {
               json = response;
           },

       });
       return json;
   }

   function closeForm() {
        $("#save-error").removeClass("error_show").addClass("error");
        $("#myModal").modal('hide');
        document.getElementById("appt-form").reset();
   }

   /***
     * When a patient submits their form
     * @param none
     * @returns updates the appt list
     */
    function submitForm(){
        var d = grabFormElements();
        updateApptList(d);
        appts = getAppts();
        appts = initializeAppts(appts);
        $("#appt-list").html(template(appts));
    }

    function checkErrors(stat) {
        if(stat === 400) {
            $("#save-error").html("Appointment already created.");
            $("#save-error").removeClass("error").addClass("error_show");
        } else if(stat === 404) {
            $("#save-error").html("Error saving appointment.");
            $("#save-error").removeClass("error").addClass("error_show");
        }
    }

    /***
     * Makes a post request to update list of appts when adding a new appointment
     * @param none
     * @returns updates the appt list
     */
   function updateApptList(obj) {
      $.ajax({
        dataType: 'json',
           type: 'POST',
           data: obj,
           async: false,
           url: '/api/appointments/',
           success: function(response) {
                appts.push(response);
                $("#save-error").removeClass("error_show").addClass("error");
                $("#myModal").modal('hide');
                document.getElementById("appt-form").reset();
           },
           error: function(response) {
                var resJSON = JSON.stringify(response);
                checkErrors(jQuery.parseJSON(resJSON).status);
           }
      });
    }


    /***
     * Grabs elements from the check in and puts it into an object
     * @param none
     * @returns new appt object
     */
    function grabFormElements(){
      var newAppt = {};
      var userTime,userDate;
      newAppt.company_id = myCompanyId;
      newAppt.first_name= $('#appt-first').val();
      newAppt.last_name = $('#appt-last').val();
      newAppt.phone_number = $('#appt-number').val();
      newAppt.provider_name = $('#appt-provider').val();

      userDate = $('#appt-date').val();
      userTime = $('#appt-time').val();

      newAppt.date = userDate + ' ' + userTime;
      return newAppt;
    } 

    $(document).on('click','.delete-appt',function(){
      var apptId = $(this).closest('.appt-row').attr('value');
      $.ajax({
        dataType:'json',
        type: 'DELETE',
        url:'/api/appointments/' + apptId,
        success:function(response){
          var updateAppts = getAppts();
          var removeAppt = initializeAppts(updateAppts);
          $("#appt-list").html(template(removeAppt));

        }
      });

    });


    /********************* FUNCTIONS TO FORMAT JAVASCRIPT DATES ********************/

    function formatDate(date){
      var d = new Date(date);
      var mm = d.getMonth() + 1; // zero indexed months
      var yyyy = d.getFullYear();
      var dd = d.getDate();
      return  mm + '/' + dd + '/' +  + yyyy;
    }

    function formatNumber(number){
      return '(' + number.substr(0,3) + ')' + number.substr(3,3) + '-' + number.substr(6,4);
    }

    //FUNCTION TO FORMAT TIME TO AM AND PM FOR HUMANS
    function formatTime(time){
        var d = new Date(time); 

        var hour = d.getHours();
        var minute = d.getMinutes();
        var pm = false;

        var hourString, minString, timeString;

        if (hour >= 12) {
          pm = true;
        }

        if (hour >= 13) {
          hour -= 12;
        }

        if (hour < 10) {
          hourString = '0' + hour;
        } else {
          hourString = hour.toString();
        }

        if (minute < 10) {
          minString = '0' + minute;
        } else {
          minString = minute.toString();
        }

        if (pm) {
          currentTime = hourString + ':' + minString + ' PM';
        } else {
          currentTime = hourString + ':' + minString + ' AM';
        }

        return currentTime;
    }

});
