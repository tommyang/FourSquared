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
    $('.dwnld-btn').click(downloadDateTime);
    
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
      * When a receptionist downloads the date and time
      * @param none
      * returns none
      */
    function downloadDateTime(){
        var userDate = $('#appt-date').val();
        var year = userDate.substring(0,4);
        var month = userDate.substring(5,7);
        var day = userDate.substring(8,10);
        var date = (year.concat(month)).concat(day);
        //console.log(date);
        var userTime = $('#appt-time').val();
        var hours = userTime.substring(0,2);
        var minutes = userTime.substring(3,5);
        var time = (('T'.concat(hours)).concat(minutes).concat('00'));
        var datetime1 = date.concat(time);
        var datetime2;
        if(minutes == '00'){
          datetime2 = date.concat(('T'.concat(hours)).concat('30'));
        } else{
          var numHours = Number(hours);
          numHours = numHours + 1;
          newHour = numHours.toString();
          datetime2 = date.concat(('T'.concat(newHour)).concat('00'));
        }
        var location = 'Main Office'//$('.Location').text();
        var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nUID:me1@google.com\nDTSTAMP:20170614T170000Z\nATTENDEE;CN=My Self ;RSVP=TRUE:MAILTO:me@gmail.com\nORGANIZER;CN=Me:MAILTO::me@gmail.com\nDTSTART:" + datetime1 +"\nDTEND:" + datetime2 +"\nLOCATION:" + location + "\nSUMMARY:Our Meeting Office\nEND:VEVENT\nEND:VCALENDAR";
        window.open( "data:text/calendar;charset=utf8," + escape(icsMSG));
    }

    /***
     * Makes a post request to update list of appts when adding a new employee
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

      newAppt.date = new Date(userDate + ' ' + userTime);
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

    $(document).on('click','.edit-appt',function(){
      var editIconName = 'fa-pencil-square-o';
      var saveIconName = 'fa-floppy-o';
      var className = $(this).closest('i').attr('class');
      var currentTD = $(this).parents('tr').find('td');

      if (className.includes(editIconName)) {
        $(this).parents('tr').removeClass('appt-row').addClass('appt-row-active');
        $(this).closest('i').removeClass(editIconName).addClass(saveIconName);

        $.each(currentTD, function (i) {
          if (i > 0 && i < 7) {
            $(this).prop('contenteditable', true);
          }
        });
      } else if (className.includes(saveIconName)) {
        var newAppt = {};
        var userTime, userDate;
        var apptId = $(this).closest('.appt-row-active').attr('value');

        $.each(currentTD, function (i) {
          if (i > 0 && i < 7) {
            if (i < 5) {
              newAppt[$(this).attr('class')] = $(this).html();
            } else if (i == 5) {
              userDate = $(this).html();
            } else if (i == 6) {
              userTime = $(this).html();
            }
          }
        });

        newAppt.date = new Date(userDate + ' ' + userTime);
        newAppt.company_id = myCompanyId;

        var errStr = validateAppt(newAppt);

        if (errStr == '') {
          $.each(currentTD, function (i) {
            if (i > 0 && i < 7) {
              $(this).prop('contenteditable', false);
            }
          });
          $(this).closest('i').removeClass(saveIconName).addClass(editIconName);
          $(this).parents('tr').removeClass('appt-row-active').addClass('appt-row');
          updateAppt(apptId, newAppt);
        } else {
          alert(errStr);
        }
      }
    });

    function updateAppt(apptId, newAppt) {
      $.ajax({
        dataType: 'json',
        type: 'PUT',
        data: newAppt,
        async: true,
        url:'/api/appointments/' + apptId
      });
    }

    function validateName(nameStr) {
      var re = /^[a-z ,.'-]+$/i;
      return re.test(nameStr);
    } 

    function validatePhoneNumber(pnStr) {
      var re = /^\d{10}$/;
      return re.test(pnStr);
    }

    function validateDate(dateStr) {
      var d = new Date(dateStr);
      return d != 'Invalid Date';
    }

    function validateAppt(apptObj) {
      var errStr = '';

      if (!validateName(apptObj.first_name)) {
        if (errStr == '') {
          errStr += 'Invalid first name';
        } else {
          errStr += ', first name';
        }
      }

      if (!validateName(apptObj.last_name)) {
        if (errStr == '') {
          errStr += 'Invalid last name';
        } else {
          errStr += ', last name';
        }
      }

      if (!validateName(apptObj.provider_name)) {
        if (errStr == '') {
          errStr += 'Invalid provider name';
        } else {
          errStr += ', provider name';
        }
      }

      if (!validatePhoneNumber(apptObj.phone_number)) {
        if (errStr == '') {
          errStr += 'Invalid phone number';
        } else {
          errStr += ', phone number';
        }
      }

      if (!validateDate(apptObj.date)) {
        if (errStr == '') {
          errStr += 'Invalid date or time';
        } else {
          errStr += ', date or time';
        }
      }

      return errStr;
    }


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
