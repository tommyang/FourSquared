/**
 * Created by DanielKong on 3/8/16.
 */
$(document).ready(function(){
var companyId;
    $('#form-company-name').on('input', function() {
        var name = $(this).val();
        if(name) {
            $(this).removeClass("invalid").addClass("valid");
        } else {
            $(this).removeClass("valid").addClass("invalid");
        }
    });
    
    $('#form-email').on('input', function() {
        var email = $(this).val();
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = re.test(email);
        if(validEmail) {
            $(this).removeClass("invalid").addClass("valid");
        } else {
            $(this).removeClass("valid").addClass("invalid");
        }
    });

    $('#form-phone').on('input', function() {
        var phone = $(this).val();
        var re = /^((\+\d{1,2}|1)[\s.-]?)?\(?[2-9](?!11)\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        var validPhone = re.test(phone);
        if(validPhone) {
            $(this).removeClass("invalid").addClass("valid");
        } else {
            $(this).removeClass("valid").addClass("invalid");
        }
    });

    //Listener for Initial Sign up of an Employee
    $('#submit-btn').on('click', function(){
        var employeeData = grabEmployeeData();
        console.log(employeeData);
        ajaxPost('/api/employees',employeeData);
    });
//Listener for creating a company
    $('#submit-company-btn').on('click',function(){
        var companyData = grabCompanyData();
        var parent_fieldset = $(this).parents('fieldset');
        if(validateCompany()) { 
            console.log(companyData);
            ajaxPost('/api/companies',companyData);
            parent_fieldset.fadeOut(400, function() {
              $(this).next().fadeIn();
            });


        } else {
            event.preventDefault();
        }
    })

    //Grab Company Data from form
    function grabCompanyData(){
        var company = {};
        company.name = $('#form-company-name').val();
        company.email = $('#form-email').val();
        company.phone_number = $('#form-phone').val();
        return company;

    }

    //Grab employee data from form
    function grabEmployeeData(){
        var employee = {};
        employee.first_name = $('#form-employee-first').val();
        employee.last_name = $('#form-employee-last').val();
        employee.email = $('#form-employee-email').val();
        employee.password = $('#form-password').val();
        employee.phone_number = $('#form-employee-phone').val();
        employee.role = 'c_admin';
        employee.company_id = companyId;
        return employee;
    }

    //Ajax function to create a POST request to server
    function ajaxPost(url, data){
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: 'json',
            success: function(response){
                //console.log(response);
                if(url == '/api/employees') {
                    localStorage.setItem('userState', 1);
                    localStorage.setItem('currentUser', JSON.stringify(response));
                    location.href = '/visitors.html';
                }
                else if (url == '/api/companies') {
                    localStorage.setItem('currentCompany', JSON.stringify(response));
                    companyId = response._id;
                }
            },
            error: function(response){
                console.log(response);
                var resJSON = JSON.stringify(response);
                alert(jQuery.parseJSON(resJSON).responseText);
                event.preventDefault();
                location.href = '/signup.html';
            }
        });
    }

    function checkValid(valid, id) {
        if(!valid) {
            $(id).removeClass("error").addClass("error_show");
            return false;
        } else {
            $(id).removeClass("error_show").addClass("error");
            return true;
        }
    }

    function validateCompany(){
        var validName = $('#form-company-name').hasClass("valid");
        var validEmail = $('#form-email').hasClass("valid");
        var validPhone = $('#form-phone').hasClass("valid");

        var checkName = checkValid(validName, "#company-name-error");
        var checkEmail = checkValid(validEmail, "#company-email-error");
        var checkPhone = checkValid(validPhone, "#company-phone-error");

        if(checkName && checkEmail && checkPhone) {
           return true;
        }
        else {
           return false;
        }
    }



    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function checkPassword(form){

        if(form.first.value == "") {
          alert("Error: Username cannot be blank!");
          form.username.focus();
          return false;
        }
        var password = $('#form-password');
        var confirmPassword = $('#form-repeat-password');

        if(password.value != "" && password.value == confirmPassword.value) {
          if(form.password.value.length < 6) {
            console.log("Password must contain at least six characters!");
            password.focus();
            return false;
          }
         if(password.value == password.value) {
            console.log("Error: Password must be different from Username!");
            password.focus();
            return false;
          }
          re = /[0-9]/;
          if(!re.test(password.value)) {
            console.log("Error: password must contain at least one number (0-9)!");
            password.focus();
            return false;
          }
          re = /[a-z]/;
          if(!re.test(password.value)) {
            console.log("Error: password must contain at least one lowercase letter (a-z)!");
            password.focus();
            return false;
          }
          re = /[A-Z]/;
          if(!re.test(form.pwd1.value)) {
            console.log("Error: password must contain at least one uppercase letter (A-Z)!");
            password.focus();
            return false;
          }
        } else {
          console.log("Error: Please check that you've entered and confirmed your password!");
          password.focus();
          return false;
        }
        console.log("You entered a valid password: " + password.value);
        return true;
    }
    function validateForm(){

    }


});
