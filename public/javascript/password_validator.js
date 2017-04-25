/**
 * Takes in a specific error message and then replaces part of a template error message with the
 * input and returns an error message which will be added to the list of errors with the inputted password.
 * @param {String} error - The specific error message type.
 * 
 * @returns {String} The newly created error message.
 */
function generateListElement(error) {
    var template = $("#errorListItem").html();
    var errorMsg = template.replace("error", error);

    return errorMsg;
}

/**
 * @class
 */
function PasswordScheme() {}

/**
 * Takes a string of all possible errors with the password and checks to see which parts of the password scheme are not matched.
 * Returns an error message detailing each part of the scheme that is not matched.
 * @param {String} error - String containing all parts of the password scheme which are not matched.
 *
 * @returns {String} Error message listing all parts of the password scheme which are not matched.
 */
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

/**
 * Takes in a password string and checks if it matches the password scheme specified.
 * @param {String} password - The password inputted by the user.
 *
 * @returns {Boolean} True if the password matches the password scheme else false
 */
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

/** 
 * Sets the specified password scheme
 * @memberOf PasswordScheme
 * @param {Array} passwordScheme - An array specifying each part of the password scheme
 */
function setPasswordScheme(passwordScheme) {
    PasswordScheme.scheme = passwordScheme;
}

/**
 * Retrieves the inputted information from the check boxs to be used for the password scheme
 *
 * @returns {Array} an array detailing the input for each check box
 */
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

if (typeof module !== 'undefined' && this.module !== module) {
    module.exports.setPasswordScheme = setPasswordScheme;
    module.exports.isValidPassword = isValidPassword;
}
else {
    $("#validate").click(function() {
        setPasswordScheme(getSchemeFromCheckboxes());
        var errors = isValidPassword($("#password").val());
        generateErrorMsg(errors);
    });
}
