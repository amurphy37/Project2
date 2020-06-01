$(document).ready(function () {
    $.get("/error", function (data) {
        console.log(data)
    })
});