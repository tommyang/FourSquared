function generateListElement(error) {
    var template = $("#errorListItem").html();
    var errorMsg = template.replace("error", error);

    return errorMsg;
}

function PasswordScheme() {}

function generateErrorMsg(error) {
    var passwordScheme = PasswordScheme.scheme;
    var errorMsg = '';
    var errors = '';

    if (error.indexOf("length") != '-1') {
        errorMsg = "Password length is not greater than ";
        errorMsg = errorMsg + passwordScheme["length"] + ".";
        errors = errors + generateListElement(errorMsg);
    }

    if (error.indexOf("lowercase") != '-1') {
        errorMsg = "Password does not contain a lowercase letter.";
        errors = errors + generateListElement(errorMsg);
    }

    if (error.indexOf("uppercase") != '-1') {
        errorMsg = "Password does not contain an uppercase letter.";
        errors = errors + generateListElement(errorMsg);
    }

    if (error.indexOf("number") != '-1') {
        errorMsg = "Password does not contain a number.";
        errors = errors + generateListElement(errorMsg);
    }

    if (error.indexOf("special") != '-1') {
        errorMsg = "Password does not contain a special character";
        errors = errors + generateListElement(errorMsg);
    }

    if (errors === '') {
        document.getElementById('errors').innerHTML="";
        document.getElementById("errors").innerHTML=$("#successMsg").html();
        return true;
    } else {
        document.getElementById("errors").innerHTML="";
        var errorList = $("#errorList").html();
        errorList = errorList.replace("item", errors);
        document.getElementById("errors").innerHTML=errorList;
        return false;
    }
}


function isValidPassword(password) {
    var passwordScheme = PasswordScheme.scheme;
    var errorMsg = '';

    if ("length" in passwordScheme) {
        if (password.length < passwordScheme["length"]) {
            errorMsg += "length ";
        }
    }

    if ("lowercase" in passwordScheme) {
        if (password.toUpperCase() === password) {
            errorMsg += "lowercase ";
        }
    }

    if ("uppercase" in passwordScheme) {
        if (password.toLowerCase() === password) {
            errorMsg += "uppercase ";
        }
    }

    if ("number" in passwordScheme) {
        if (!/\d/.test(password)) {
            errorMsg += "number ";
        }
    }

    if ("special" in passwordScheme) {
        if (!/[!@#$%?]/.test(password)) {
            errorMsg += "special";
        }
    }
    return errorMsg;
}

function setPasswordScheme(passwordScheme) {  
    PasswordScheme.scheme = passwordScheme;
}

function getSchemeFromCheckboxes() {
    var checkedBoxes = {};

    if ($("#lengthBox").is(":checked")) {
        checkedBoxes["length"] = Number($("#lengthval").val());
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
    setPasswordScheme(getSchemeFromCheckboxes());
    var errors = isValidPassword($("#password").val());
    generateErrorMsg(errors);
});
