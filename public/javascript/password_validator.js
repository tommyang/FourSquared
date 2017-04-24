function generateListElement(error) {
  var errorMsg = '<li class="list-group-item" style="background:#ff9999; border:none">' + error + '</li>';
  return errorMsg;
}

function isValidPassword() {
    var password = $("#password").val();
    var passwordScheme = setPasswordScheme();

    var errors = '<ul class="list-group">';

    if ("length" in passwordScheme) {
        if (password.length < passwordScheme["length"]) {
            errors = errors + generateListElement("Password length is not greater than "+ passwordScheme["length"] + ".");
        }
    }

    if ("lowercase" in passwordScheme) {
        if (password.toUpperCase() === password) {
            errors = errors + generateListElement("Password does not contain a lowercase letter.");
        }
    }

    if ("uppercase" in passwordScheme) {
        if (password.toLowerCase() === password) {
            errors = errors + generateListElement("Password does not contain an uppercase letter.");
        }
    }

    if ("number" in passwordScheme) {
        if (!/\d/.test(password)) {
            errors = errors + generateListElement("Password does not contain a number.");
        }
    }

    if ("special" in passwordScheme) {
        if (!/[!@#$%?]/.test(password)) {
            errors = errors + generateListElement("Password does not contain a special character.");
        }
    }
    
    if (errors === '<ul class="list-group">') {
        document.getElementById('errors').innerHTML="";
        document.getElementById("errors").innerHTML='<ul class="list-group"><li class="list-group-item" style="background:#99ff99; border:none"> Valid Password!</li></ul>';
        return true;
    }
    else {
        document.getElementById("errors").innerHTML="";
        document.getElementById("errors").innerHTML=errors + '</ul>';
        return false;
    }
}

function setPasswordScheme() {
    var checkedBoxes = {};

    if ($("#lengthBox").is(":checked")) {
        checkedBoxes["length"] = Number($("#lengthval").val());
        if(checkedBoxes["length"] < 6) 
          checkedBoxes["length"] = 6;
    }

    if ($("#lowercaseBox").is(":checked")) {
        checkedBoxes["lowercase"] = true;
    }

    if ($("#uppercaseBox").is(":checked")) {
        checkedBoxes["uppercase"] = true;
    }

    if ($("#numberBox").is(":checked")) {
        checkedBoxes["number"] = true;
    }

    if ($("#specialBox").is(":checked")) {
        checkedBoxes["special"] = true;
    }

    return checkedBoxes;
}

$("#validate").click(function() {
    isValidPassword(); // do something visual with this?!
});
