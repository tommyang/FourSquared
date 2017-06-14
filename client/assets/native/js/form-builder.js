$(document).ready(function() {
    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var myCompanyId = companyData._id;
    var curUser = JSON.parse(localStorage.getItem('currentUser'));

    var forms = getFormConfig();

    $('#myform').submit(function(event) {
        var d = grabElements();
        updateForm(d);
        forms = getFormConfig();
    });

    function getFormConfig() {
        var json;
        $.ajax({
            dataType: 'json',
            type: 'GET',
            data: $('#response').serialize(),
            async: false,
            url: '/api/form-builder/' + myCompanyId,
            success: function(response) {
                json = response;
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                ajaxPost('/api/form-builder', getDefaultTheme(myCompanyId));
            }
        });
        console.log(json);
        return json;
    }

    function updateForm(obj) {
        $.ajax({
            dataType: 'json',
            type: 'PUT',
            data: obj,
            async: false,
            url: '/api/form-builder/' + myCompanyId
        });
    }

    function grabElements() {
        var form = {};
       
        var optional_index = 1;

        $("input:checkbox").each(function() {
            var label = $("label[for='" + this.id + "']");

            if (label.length > 1) {
                label = label[optional_index - 1].text();
            } else {
                label = label.text();
            }
            
            var checked = $(this).is(":checked");
           
            if (label == 'First Name') {
                form.first_name = checked;
            } else if (label == 'Last Name') {
                form.last_name = checked;
            } else if (label == 'Phone Number') {
                form.phone_number = checked;
            } else {
                form['optional_' + optional_index.toString()] = [checked, label];
                optional_index += 1;
            }            
        });
        form.color = $('#colorpicker').val();
        return form;
    }

    function getDefaultTheme(id) {
        var theme = {};
        theme.color = '1C7F79';
        theme.first_name = true;
        theme.last_name = true;
        theme.phone_number = false;
        theme.optional_1 = [false, ''];
        theme.optional_2 = [false, ''];
        theme.company_id = id;
        return theme;
    }

    function ajaxPost(url, data){
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: 'json'
        });
    }

});
