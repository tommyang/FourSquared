$(document).ready(function() {
    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var myCompanyId = companyData._id;
    var curUser = JSON.parse(localStorage.getItem('currentUser'));

    var forms = getForms();

    $('#myform').submit(function(event) {
        var d = grabElements();
        console.log(d);
        updateForm(d);
        forms = getForms();

    });

    function getForms() {
        var json;
        $.ajax({
            dataType: 'json',
            type: 'GET',
            data: $('#response').serialize(),
            async: false,
            url: '/api/formtemplates/company/'+myCompanyId,
            success: function(response) {
                json = response;
                console.log(response);
            }
        });
    }

    function updateForm(obj) {
        $.ajax({
            dataType: 'json',
            type: 'POST',
            data: obj,
            async: false,
            url: '/api/formtemplates/',
            success: function(response) {
                forms.push(response);
                console.log(response);
            }
        });
    }

    function grabElements() {
        var form = {};
       
        var field = 0;

        $("input:checkbox").each(function() {
            var label = $("label[for='" + this.id + "']").text();
            var checked = $(this).is(":checked");
           
            var str = "";
            if(checked) 
                str = "true_" + label;
            else
                str = "false_" + label;

            console.log(str);
            form[field] = {label, checked};;
            field = field + 1;
        });
        return form;
    }

});
