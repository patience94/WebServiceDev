$(document).ready(function(){
    $.ajax({
        type: "POST",
        url: reqUrl,
        data: reqBody,
        dataType: "json",
        success: function(data, textStatus) {
            if (data.redirect) {
                // data.redirect contains the string URL to redirect to
                window.location.href = data.redirect;
            } else {
                // data.form contains the HTML for the replacement form
                $("#myform").replaceWith(data.form);
            }
        }
    });
});

