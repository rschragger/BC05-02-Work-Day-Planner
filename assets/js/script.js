//Create variables ---------------------------------------------------------
//var IDs
//defaults
// var defaultVals = {

// }

//Other Variables required
var varOne = [];

if (localStorage.getItem('savedActivities') == null) {
    localStorage.setItem('savedActivities', JSON.stringify({}))
};

// Functions ---------------------------------------------------------
function init() {
    $('#currentTime').text(moment().format("dddd, Do MMMM YYYY hh:mm a"));
    setInterval(function () {
        // var tBlock = $('#currentTime');
        $('#currentTime').text(moment().format("dddd, Do MMMM YYYY hh:mm a"));
    }, 1000 * 60); //fires every minute, does not need to stop
}

$('.saveBtn').click(function () {
    var thisId = $(this).attr('id');
    console.log((thisId));

    // var thisRow = $(this).parent().attr('id');
    var rowNo = thisId[thisId.length - 1];

    var formText = $('#FormControlText' + rowNo).val();
    var thisRowData = [rowNo, formText]
    console.log((thisRowData));
    formToLocal(thisRowData);

})

function formToLocal(passedData) {
    var savedFormData = JSON.parse(localStorage.getItem('savedActivities'));
    var rowN = passedData[0];
    var thisValue = passedData[1];
    // if (savedFormData.thisKey != null) {
    //     savedFormData.thisKey = thisValue;
    // } else {
    //     savedFormData.thisKey = thisValue;
    //     // savedFormData.push({ [thisKey]: thisValue });
    // };
    // savedFormData.(thisKey.val()) = thisValue;
    eval('savedFormData.row' + rowN + ' = thisValue');

    localStorage.setItem('savedActivities', JSON.stringify(savedFormData));

    console.log(savedFormData);


}

init()