//Create variables ---------------------------------------------------------
//var IDs
//defaults
// var defaultVals = {

// }

//Other Variables required
var varOne = [];


// Functions ---------------------------------------------------------
function init() {
    $('#currentTime').text(moment().format("dddd, Do MMMM YYYY hh:mm a"));
    setInterval(function () {
        // var tBlock = $('#currentTime');
        $('#currentTime').text(moment().format("dddd, Do MMMM YYYY hh:mm a"));
    }, 1000 * 60); //fires every minute, does not need to stop
}

$('.saveBtn').click(function () {
    // var thisId = $('.saveBtn').id ;
    var thisId = $(this).attr('id');
    var thisRow = $(this).parent().attr('id');
    var rowNo = thisRow[thisRow.length - 1];

    var formText = $('#FormControlText' + rowNo).val();
    var thisRowData = {
        thisRow : formText ,
}
console.log((thisRowData))
})

function formToLocal(passedData){
    var savedFormData = JSON.parse(localStorage.getItem('savedActivities'));
var thisKey = passedData.key();



}

init()