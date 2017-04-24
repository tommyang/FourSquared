function isValidPassword() {
    var password = $("#password").val();
    var passwordScheme = setPasswordScheme();

    if ("length" in passwordScheme) {
        if (password.length < passwordScheme["length"]) {
            return false; 
        }
    }

    if ("lowercase" in passwordScheme) {
        if (password.toUpperCase() === password) {
            return false;
        }
    }

    if ("uppercase" in passwordScheme) {
        if (password.toLowerCase() === password) {
            return false;
        }
    }

    if ("number" in passwordScheme) {
        if (!/\d/.test(password)) {
            return false;
        }
    }

    if ("special" in passwordScheme) {
        if (!/[!@#$%?]/.test(password)) {
            return false;
        }
    }

    return true;
}

function setPasswordScheme() {
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
    isValidPassword(); // do something visual with this?!
});