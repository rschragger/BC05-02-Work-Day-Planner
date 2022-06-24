//Create variables ---------------------------------------------------------
//var IDs
//Time (moment) variables
var startTimeInt = 9; //9am is basis
var hourInt = 60 * 60 * 1000; //to make adding an hour clearer

//Note below are established here to be global and will be refreshed in functions
var StartOfDay = moment().startOf('day'); //12am today
var startTime = moment(StartOfDay).add(startTimeInt, 'hours');


//Other Variables required
var varOne = [];

if (localStorage.getItem('savedActivities') == null) {
    localStorage.setItem('savedActivities', JSON.stringify({}))
};

// Functions ---------------------------------------------------------
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

function localToForm() {
    var savedFormData1 = (JSON.parse(localStorage.getItem('savedActivities')));

    var savedFormData = new Map(Object.entries(savedFormData1));

    if (savedFormData == null) {
        formToLocal('')
        // return console.log('no data');
    }

    savedFormData.forEach(function (value, key) {
        var valNo = key[key.length - 1];
        if ($('#' + key).val() != undefined) {
            $('#FormControlText' + valNo).val(value)
        } 
    })

}

//Events ---------------------------------
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

//Initialise ----------------------------
function init() {
    $('#currentTime').text(moment().format("dddd, Do MMMM YYYY hh:mm a"));
    setInterval(function () {
        // var tBlock = $('#currentTime');
        $('#currentTime').text(moment().format("dddd, Do MMMM YYYY hh:mm a"));
    }, 1000 * 60); //fires every minute, does not need to stop
    localToForm() //adds data to the forms
}

init()