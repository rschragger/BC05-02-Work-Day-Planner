//Create variables ---------------------------------------------------------
//var IDs
//Time (moment) variables
var startTimeInt = 9; //9am is basis
var checkTime = 0; //this checks to run hourly timer
var hourInt = 60 * 60 * 1000; //to make adding an hour clearer

//Note below are established here to be global and will be refreshed in functions
var startOfDay = moment().startOf('day'); //12am today
var startTime = moment(startOfDay).add(startTimeInt, 'hours');

//Row HTML
var rowCount = 9 //9 rows required for 9-5
var rowHMTL = `      <!--Start Row---------------->
<div class="row" id="row^^">
  <div class="col-2 col-md-1 hour" id="hour^^"></div>
  <textarea class="col-8 col-md-10 form-control description tense" id="FormControlText^^" rows="2"></textarea>
  <div class="col-2  col-md-1 fas fa-save saveBtn" id="btn^^">
  </div>
</div>
<!--End Row---------------->`
//do NOT delete above

//Button variables
// var startMinus = document.getElementById('start-1');
// var startPlus = document.getElementById('start+1');
var startInput = document.getElementById('startTime');
// var rowsMinus = document.getElementById('rows-1');
// var rowsPlus = document.getElementById('rows+1');
var rowsInput = document.getElementById('rows-input');

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
        // var valNo = key[key.length - 1];
        var valNo = key.replace('row', '');
        if ($('#' + key).val() != undefined) {
            $('#FormControlText' + valNo).val(value)
        }
    })

}

function makeRows() {
    $('.time-block').text('');
    //work through tenses-past, present, future

    for (var x = 0; x < rowCount; x++) {
        var iT = parseFloat(x) + parseFloat(startTimeInt);
        var tenseI = iT;
        if (iT > 23) {
            iT = iT - 24;
        }
        // console.log('x:' + x + " iT:" + iT + ' sti:' + startTimeInt);
        var newText = rowHMTL.replaceAll('^^', iT);
        var thisTense = establishTense(tenseI);
        var newText = newText.replaceAll('tense', thisTense);

        $('.time-block').append(newText);
        // Add time
        // var rowTime = moment(startTime).add(iT, 'hours');
        var rowTime = moment(startOfDay).add(iT, 'hours');
        $('#hour' + iT).text(rowTime.format('hA'))
    }
    initBtn();

}

function establishTense(rowNo) {
    var rowTime = moment(startOfDay).add(rowNo, 'hours');
    if (moment(rowTime).format('YMMDDHH') == moment().format('YMMDDHH')) {
        return 'present';
    } else if (moment(rowTime).format('YMMDDHH') < moment().format('YMMDDHH')) {
        return 'past';
    } else {
        return 'future';
    }

}

// fireOnHour initiates, should work if fired at exactly the hour or within. 
function fireOnHour() {
    var thisTime = moment();
    var endHour = moment(thisTime).endOf('hour');

    //'format('x') ' is Unix milliseconds format (lowercase x is milliseconds) so can be used in interval. 
    //Had to add a second as it was going off 1 second too soon
    var msecondsToEnd = moment(endHour).format('x') - moment().format('x') + 1;
    //  msecondsToEnd = msecondsToEnd/60/2 ;//testing
    console.log('fireOnHour has performed at ' + moment().toString() + ' - ' + msecondsToEnd)
    //We aren't using setInterval as the first interval is not going to be the full hour
    setTimeout(onHourTenseReset, msecondsToEnd);
    // setTimeout(onHourTenseReset, 5000 );

}

function onHourTenseReset() {
    for (x = 0; x < rowCount; x++) {
        var i = x + startTimeInt;
        var tenseI = i;
        if (i > 23) {
            i = i - 23;
        }
        var thisTense = establishTense(tenseI);
        // var tenseList = 'past present future tense';

        //https://stackoverflow.com/questions/5553551/jquery-change-class-by-given-ids & 1485647/removing-multiple-classes-jquery
        $('#FormControlText' + i).removeClass('past present future tense').addClass(thisTense)
    }
    // console.log('onHourTenseReset has performed at ' + moment().toString())
    // fireOnHour()
}

function setCurrentTime() {
    setInterval(function () {
        // var tBlock = $('#currentTime');
        $('#currentTime').text(moment().format("dddd, Do MMMM YYYY h:mm a"));
        // console.log('currentTime() has performed at '+ moment().toString())

        if (checkTime != moment().format('h')) {
            onHourTenseReset();
            checkTime = moment().format('h')
        }
    }, 1000 * 60); //fires every minute, does not need to stop

}

function startAndRowsFromLocal() {
    var noOfRows = localStorage.getItem('noOfRows');
    if (noOfRows != null) {
        window.rowCount = noOfRows;
    } else {
        noOfRows = rowCount;
    }
    rowsInput.value = parseFloat(noOfRows);

    var strTime = localStorage.getItem('strTime');
    if (strTime != null) {
        window.startTimeInt = strTime;
    } else {
        strTime = startTimeInt;
    }
    startInput.value = parseFloat(strTime);
}

function startAndRowsToLocal() {
    localStorage.setItem('noOfRows', rowsInput.value);
    localStorage.setItem('strTime', startInput.value);
}


function btnMinusPlus(message) {
    var mesType = message[0];
    var mesQty = message[1] + message[2];
    // console.log(mesQty);
    if (mesType == 's') { //start time
        startInput.value = parseFloat(startInput.value) + parseFloat(mesQty);
        if (startInput.value < 0) {
            startInput.value = 23;
        } else if (startInput.value > 23) {
            startInput.value = 0;
        }
        startTimeInt = parseFloat(startInput.value);
    } else if (mesType == 'r') { //row qty
        rowsInput.value = parseFloat(rowsInput.value) + parseFloat(mesQty);
        if (rowsInput.value < 1) {
            rowsInput.value = 24;
        } else if (rowsInput.value > 24) {
            rowsInput.value = 1;
        }
        rowCount = parseFloat(rowsInput.value);
    }
    makeRows();
    localToForm();
    startAndRowsToLocal()
}

function inputChange(inpVal, mesType) {
    if (inpVal > 24) { inpVal = 24; } ;
    if (inpVal < 1) { inpVal = 1; } ;

    if (mesType == 's') { //start time
        startTimeInt = parseFloat(inpVal);
        startInput.value = startTimeInt ;

    } else if (mesType == 'r') { //row qty
        rowCount = parseFloat(inpVal);
        rowsInput.value = rowCount ;
    }
    makeRows();
    localToForm();
    startAndRowsToLocal()
}


//Events ---------------------------------
function initBtn() {
    $('.saveBtn').click(function () {
        var thisId = $(this).attr('id');
        console.log((thisId));

        // var thisRow = $(this).parent().attr('id');
        //var rowNo = thisId[thisId.length - 1];
        var rowNo = thisId.replace('btn', '');

        var formText = $('#FormControlText' + rowNo).val();
        var thisRowData = [rowNo, formText]
        console.log((thisRowData));
        formToLocal(thisRowData);
    })
}

//Initialise ----------------------------
function init() {
    //Set the number of rows and 
    startAndRowsFromLocal()
    //Set the current time
    $('#currentTime').text(moment().format("dddd, Do MMMM YYYY h:mm a"));

    var endMin = moment().endOf('minute');
    var msecondsToEnd = moment(endMin).format('x') - moment().format('x') + 10;
    //Extra 10ms is so that it always fires just after clock strikes the minute
    //lowercase x is milliseconds

    setTimeout(function () {
        $('#currentTime').text(moment().format("dddd, Do MMMM YYYY h:mm a"));
        setCurrentTime();
    }, msecondsToEnd);

    makeRows();
    localToForm();//adds data to the forms
    fireOnHour(); //fires every hour, resets itself
}

init()