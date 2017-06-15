$(document).ready(function() {
    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var myCompanyId = companyData._id;
    var curUser = JSON.parse(localStorage.getItem('currentUser'));

    var forms = getFormConfig();
    loadData(forms);

    $('#myform').submit(function(event) {
        var d = grabElements();
        updateForm(d);
        forms = getFormConfig();
    });

    function addBox(bod, label, n) {
        var box_html = $('<div class="form-group"><input type="checkbox" class="form-control" name="boxes[]" id="box'+n+'"/> <label id = "added_label'+n+'" for="box'+n+'">' + label + '</label> <button type="button" class="btn btn-danger remove-box">Remove</button></div>');
        box_html.hide();
        $('.my-form:first .addField:last').before(box_html);
        console.log(bod);
        if(bod === "true") {
        	$('#box' + n).prop('checked', true);
        }
        box_html.fadeIn('slow');
        $('#optional_label').val("");

    }

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

    function loadData(data) {
    	var color = data.color;
        var fname = data.first_name;
        var lname = data.last_name;
        var phone = data.phone_number;
        var op1 = data.optional_1;
        var op2 = data.optional_2;
        showColor(color);
        showData(fname, "#f_Name");
        showData(lname, "#l_Name");
        showData(phone, "#phone");
        if(op1[1] !== "") {
        	addBox(op1[0], op1[1], 1);

        }
        if(op2[1] !== "") {
        	addBox(op2[0], op2[1], 0);
		}	
    }

    function showColor(color) {
    	console.log(color);
    	$("#colorpicker").val(color);
    }

    function showData(checked, name) {
    	console.log(checked);
    	if(checked) 
 			$(name).prop('checked', true);
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
