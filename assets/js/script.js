//Create variables ---------------------------------------------------------
//var IDs
//Time (moment) variables
var startTimeInt = 20; //9am is basis
var hourInt = 60 * 60 * 1000; //to make adding an hour clearer

//Note below are established here to be global and will be refreshed in functions
var StartOfDay = moment().startOf('day'); //12am today
var startTime = moment(StartOfDay).add(startTimeInt, 'hours');

//Row HTML
var rowCount = 8 //8 rows required
var rowHMTL = `      <!--Start Row---------------->
<div class="row" id="row^^">
  <div class="col-2 hour" id="hour^^"></div>
  <textarea class="form-control col-8 description tense" id="FormControlText^^" rows="2"></textarea>
  <div class="col-2 fas fa-save saveBtn" id="btn^^">
  </div>
</div>
<!--End Row---------------->`


//Other Variables required
var varOne = [];

// Var local storage
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

function makeRows() {
    $('.time-block').text('');
    //work through tenses-past, present, future

    for (i = 0; i < rowCount; i++) {

        var newText = rowHMTL.replaceAll('^^', i);
        var thisTense = establishTense(i);
        var newText = newText.replaceAll('tense', thisTense);

        $('.time-block').append(newText);
        // Add time
        var rowTime = moment(startTime).add(i, 'hours');
        $('#hour' + i).text(rowTime.format('hA'))
    }
    initBtn() ;

}

function establishTense(rowNo) {
    var rowTime = moment(startTime).add(rowNo, 'hours');
    if (moment(rowTime).format('YMMDDHH') == moment().format('YMMDDHH')) {
        return 'present';
    } else if (moment(rowTime).format('YMMDDHH') < moment().format('YMMDDHH')) {
        return 'past';
    } else {
        return 'future';
    }

}

//Events ---------------------------------
function initBtn(){
$('.saveBtn').click(function () {
    var thisId = $(this).attr('id');
    console.log((thisId));

    // var thisRow = $(this).parent().attr('id');
    var rowNo = thisId[thisId.length - 1];

    var formText = $('#FormControlText' + rowNo).val();
    var thisRowData = [rowNo, formText]
    console.log((thisRowData));
    formToLocal(thisRowData);
})}

//Initialise ----------------------------
function init() {
    $('#currentTime').text(moment().format("dddd, Do MMMM YYYY hh:mm a"));
    setInterval(function () {
        // var tBlock = $('#currentTime');
        $('#currentTime').text(moment().format("dddd, Do MMMM YYYY hh:mm a"));
    }, 1000 * 60); //fires every minute, does not need to stop
    makeRows();
    localToForm();//adds data to the forms
}

init()