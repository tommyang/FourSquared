function validatePassword() {

}

function setPasswordScheme() {
    var checkedBoxes = {};

    if ($("#lengthBox").is(":checked")) {
        checkedBoxes["length"] = $("#lengthval").val();
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
    console.log(setPasswordScheme());
});