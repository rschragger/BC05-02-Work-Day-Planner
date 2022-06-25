//Create variables ---------------------------------------------------------
//var IDs
//Time (moment) variables
var startTimeInt = 9; //9am is basis
var hourInt = 60 * 60 * 1000; //to make adding an hour clearer

//Note below are established here to be global and will be refreshed in functions
var startOfDay = moment().startOf('day'); //12am today
var startTime = moment(startOfDay).add(startTimeInt, 'hours');

//Row HTML
var rowCount = 9 //9 rows required for 9-5
var rowHMTL = `      <!--Start Row---------------->
<div class="row" id="row^^">
  <div class="col-1 hour" id="hour^^"></div>
  <textarea class="form-control col-10 description tense" id="FormControlText^^" rows="2"></textarea>
  <div class="col-1 fas fa-save saveBtn" id="btn^^">
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

    for (x = 0; x < rowCount; x++) {
        var i = x + startTimeInt;
        var tenseI = i;
        if (i > 23) {
            i = i - 23;
        }

        var newText = rowHMTL.replaceAll('^^', i);
        var thisTense = establishTense(tenseI);
        var newText = newText.replaceAll('tense', thisTense);

        $('.time-block').append(newText);
        // Add time
        // var rowTime = moment(startTime).add(i, 'hours');
        var rowTime = moment(startOfDay).add(i, 'hours');
        $('#hour' + i).text(rowTime.format('hA'))
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

function fireOnHour() {
    var thisTime = moment();
    var endHour = moment(thisTime).endOf('hour');
    var secondsToEnd = moment(endHour).format('X') - moment().format('X')+1 ; //initiates, should work even if fired at exactly the hour. '.format('X') ' is Unix seconds format (lowercase x is milliseconds) so can be used in interval. 
    //Had to add a second as it was going off 1 second too soon
    console.log('fireOnHour has performed at ' + moment().toString())
    //We aren't using setInterval as the first interval is not going to be the full hour
    setTimeout(function () {
        onHourTenseReset();
    }, secondsToEnd * 1000);

}

function onHourTenseReset() {
    for (x = 0; x < rowCount; x++) {
        var i = x + startTimeInt;
        var tenseI = i;
        if (i > 23) {
            i = i - 23;
        }
        var thisTense = establishTense(tenseI);
        //str.replaceAll(/dog|cat/gi,'fish') from https://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
        var regExExpr = `/past|present|future/gi`;

        //https://stackoverflow.com/questions/5553551/jquery-change-class-by-given-ids
        $('#FormControlText' + i).removeClass(eval(regExExpr)).addClass(thisTense)
    }
    fireOnHour()
}

function setCurrentTime() {
    setInterval(function () {
        // var tBlock = $('#currentTime');
        $('#currentTime').text(moment().format("dddd, Do MMMM YYYY h:mm a"));
        console.log('currentTime() has performed at '+ moment().toString())
    }, 1000 * 60); //fires every minute, does not need to stop

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
    $('#currentTime').text(moment().format("dddd, Do MMMM YYYY h:mm a"));

    var endMin = moment().endOf('minute');
    var msecondsToEnd = moment(endMin).format('x') - moment().format('x'); //lowercase x is milliseconds

    setTimeout(function () {
        $('#currentTime').text(moment().format("dddd, Do MMMM YYYY h:mm a"));
        setCurrentTime();
    }, msecondsToEnd);

    makeRows();
    localToForm();//adds data to the forms
    fireOnHour(); //fires every hour, resets itself
}

init()