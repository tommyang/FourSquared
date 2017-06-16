$(document).ready(function($){
    $('.my-form:last .add-box').click(function(){
        var label;
        label = $('#optional_label').val();
        console.log("value: " + label);
        var n = $(':checkbox').length - 3;
        if( 2 < n ) {
            alert('Max number of fields that can be added is 2');
            return false;
        }
        var box_html = $('<div class="form-group"><input type="checkbox" class="form-control" name="boxes[]" id="box'+n+'"/> <label id = "added_label'+n+'" for="box'+n+'">' + label + '</label> <button type="button" class="btn btn-danger remove-box">Remove</button></div>');
        box_html.hide();
        $('.my-form:first .addField:last').before(box_html);
        box_html.fadeIn('slow');
        $('#optional_label').val("");
        return false;
    });

});

$('.my-form').on('click', '.remove-box', function(){
    $(this).parent().css( 'background-color', '#FF6C6C' );
    $(this).parent().fadeOut("slow", function() {
        $(this).remove();
        $('.box-number').each(function(index){
            $("#box2").attr("id", "box1");
            $("#added_label").attr("for", "optional_1");
        });
    });
    return false;
});
