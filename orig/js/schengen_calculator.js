/*
This source is shared under the terms of LGPL 3
www.gnu.org/licenses/lgpl.html

You are free to use the code in Commercial or non-commercial projects
*/

// This is a global variable (EEK!!!)
// It contains the trip table entered by the user plus the calculated data
// It will be used by the function that draws the chart
var tripData = [];

function calculateTime()
{
    // Get a handle to the form
    // TODO: Change this from "cakeform" to something appropriate to this being a calculator
    var theForm = document.forms["cakeform"];

    // Get handle to the div with the output
    // TODO: Change name to something appropriate to the calculator
    var divobj = document.getElementById("totalPrice");
    divobj.style.display="block";

    // Get handle to the table
    var myTable = document.getElementById("tripTable");

    // Loop across all rows of the table checking the inputs and calculating the output
    for(idx = 1; idx < myTable.rows.length; idx++) {
        var numdaysobj = document.getElementById("numDays"+idx);
        numdaysobj.style.display="block";
        var resetstartobj = document.getElementById("resetStart"+idx);
        resetstartobj.style.display="block";
        var resetendobj = document.getElementById("resetEnd"+idx);
        resetendobj.style.display="block";

        // Grab the text in the entry and exit boxes
        var entryText  = theForm.elements["entrydate"+idx].value;
        var exitText   = theForm.elements["exitdate"+idx].value;

        // Check to see if both have text
        if (entryText == "") {
            divobj.innerHTML = "Please enter the date you entered the Schengen Zone into row "+idx;
            return;
        } else if (exitText == "") {
            divobj.innerHTML = "Please enter the date you exited the Schengen Zone into row "+idx;
            return;
        }

        // Split the text dates into their components (assumption that format is MM-DD-YYYY)
        // Uses dashes, slashes or dots as delimiters (user could even mix them)
        // TODO: Make it understand one digit date/month and two digit year
        // TODO: Do some bounds checking
        // TODO: Give option to enter date in non-US format (DD-MM-YYYY)
        var entryDate  = /^(\d\d|\d)[\/\-\.](\d\d|\d)[\/\-\.](\d\d|\d\d\d\d)$/.exec(entryText);
        var exitDate   = /^(\d\d|\d)[\/\-\.](\d\d|\d)[\/\-\.](\d\d|\d\d\d\d)$/.exec(exitText);

        // Error check that the entry and exit are in the proper form
        if (entryDate === null) {
            divobj.innerHTML = "Please enter an entry date into row "+idx+" in a valid format (MM/DD/YY)";
            return;
        } else if (exitDate === null) {
            divobj.innerHTML = "Please enter an exit date into row "+idx+" in a valid format (MM/DD/YY)";
            return;
        } else {
            //divobj.innerHTML = "I think the dates are in the proper form entry "+entryDate+" exit "+exitDate;
            //return;
        }

        // Create the date objects
        var entryMonth = entryDate[1] - 1; // The months start at 0 in JS
        var entryDay   = entryDate[2];
        var entryYear  = entryDate[3];
        console.log("entry year is "+entryYear);
        if (entryYear < 100) {
            entryYear = parseInt(entryYear) + 2000;
            console.log("entry year was entered as two digits, changing it to "+entryYear);
        }
        var entryDateObj = new Date(entryYear, entryMonth, entryDay);
        var exitMonth  = exitDate[1] - 1; // The months start at 0 in JS
        var exitDay    = exitDate[2];
        var exitYear   = exitDate[3];
        if (exitYear < 100) { exitYear = parseInt(exitYear) + 2000; }
        var exitDateObj  = new Date(exitYear,  exitMonth,  exitDay);

        var daysBetween = Math.round((exitDateObj - entryDateObj)/(1000*60*60*24));

        divobj.innerHTML = "In row "+idx+" entered the Zone on "+entryDateObj.toDateString()+" and exited on "+exitDateObj.toDateString()+" a total of "+daysBetween+" days";
        numdaysobj.innerHTML = daysBetween + 1;
        var resetStartDate = new Date(entryDateObj);
        resetStartDate.setDate(resetStartDate.getDate() + 180);
        resetstartobj.innerHTML = resetStartDate.toDateString();
        var resetEndDate = new Date(exitDateObj);
        resetEndDate.setDate(resetEndDate.getDate() + 180);
        resetendobj.innerHTML = resetEndDate.toDateString();
        //return;
        //
        // Save the data (even if it already exists) in the tripData array in an array of anonymous objects
        tripData[idx] = { entryDate: entryDateObj,
                          exitDate:  exitDateObj,
                          numDays:   daysBetween + 1,
                          startRst:  resetStartDate,
                          endRst:    resetEndDate     };

    }
}

function addRow()
{
    var myTable = document.getElementById("tripTable");
    var currentIndex = myTable.rows.length;
    var currentRow = myTable.insertRow(-1);

    var tripNoBox = document.createElement("div");
    tripNoBox.setAttribute("id", "tripNo" + currentIndex);
    tripNoBox.innerHTML = currentIndex;

    var entryBox = document.createElement("input");
    entryBox.setAttribute("name", "entrydate" + currentIndex);
    entryBox.setAttribute("id", "entrydate" + currentIndex);
    entryBox.setAttribute("placeholder", "MM/DD/YY");
    entryBox.setAttribute("onblur", "calculateTime()");

    var exitBox = document.createElement("input");
    exitBox.setAttribute("name", "exitdate" + currentIndex);
    exitBox.setAttribute("id", "exitdate" + currentIndex);
    exitBox.setAttribute("placeholder", "MM/DD/YY");
    exitBox.setAttribute("onblur", "calculateTime()");

    var numDaysBox = document.createElement("div");
    numDaysBox.setAttribute("id", "numDays" + currentIndex);

    var resetStartBox = document.createElement("div");
    resetStartBox.setAttribute("id", "resetStart" + currentIndex);

    var resetEndBox = document.createElement("div");
    resetEndBox.setAttribute("id", "resetEnd" + currentIndex);

    var currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(tripNoBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(entryBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(exitBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(numDaysBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(resetStartBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(resetEndBox);
}

function hideTotal()
{
    var divobj = document.getElementById('totalPrice');
    divobj.style.display='none';
    var resultobj = document.getElementById("numDays1");
    //divobj.innerHTML = "Initialized";

    var data;
    var chart;

    // Load the Visualization API and the piechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
//    google.charts.setOnLoadCallback(drawChart);

}

function selectHandler() {
        var selectedItem = chart.getSelection()[0];
        var value = data.getValue(selectedItem.row, 0);
        alert('The user selected ' + value);
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
    // Create our data table.
    data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
    ]);

    // Set chart options
    var options = {'title':'How Much Pizza I Ate Last Night',
                   'width':400,
                   'height':300};

    // Instantiate and draw our chart, passing in some options.
    chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(data, options);
}

function genChart()
{
    var divobj = document.getElementById('totalPrice');
    divobj.style.display='block';

    // Get handle to the table
    var myTable = document.getElementById("tripTable");

    // The number of rows - 1 tells us how many trips there are
    var numTrips = myTable.rows.length - 1;

    // Create the data object
    var data;
    var chart;

    // Assuming I dont need this since it is already loaded
    // // Load the Visualization API and the piechart package.
    // google.charts.load('current', {'packages':['corechart']});
    //
    // // Set a callback to run when the Google Visualization API is loaded.
    // google.charts.setOnLoadCallback(drawChart);

    // Create our data table.
    data = new google.visualization.DataTable();

    // One column for the date and a column per trip
    data.addColumn('datetime', 'Date');
    data.addColumn('number', '90 Days Max');
    //data.addColumn('number', 'Day');
    for(idx = 1; idx <= numTrips; idx++) {
        data.addColumn('number', 'Trip'+idx);
    }

    // Need to do some work before we can populate the rows
    // Big assumption here is that the trips are in order (TODO: make sure this is true)
    // so the first trip entry date is the first row
    // and the last trip end reset date is the last rowa
    var startDateRange = new Date(tripData[1].entryDate);
    var endDateRange   = new Date(tripData[numTrips].endRst);
    //var endDateRange   = new Date(tripData[1].exitDate);
    var lenDateRange   = Math.round((endDateRange - startDateRange)/(1000*60*60*24)) + 1;

    // Now loop through the date range populating the active days for each trip
    var activeDays = [];
    activeDays.length = numTrips;
    activeDays.fill(0);
    var fooIdx = 0;
    for(dateIdx = new Date(startDateRange); dateIdx <= endDateRange; dateIdx.setDate(dateIdx.getDate() + 1)) {
        // Loop through the trips and update the activeDays count accordingly
        // TODO: Stinky code smell, sometimes I'm counting trips from 0 and other times I count from 1
        for(tripIdx = 0; tripIdx < numTrips; tripIdx++) {
            if((dateIdx >= tripData[tripIdx + 1].entryDate) &&
               (dateIdx <= tripData[tripIdx + 1].exitDate)) {
                   activeDays[tripIdx]++;
                   console.log("added an active day to trip "+tripIdx);
            } else
            if((dateIdx >= tripData[tripIdx + 1].startRst) &&
               (dateIdx <= tripData[tripIdx + 1].endRst)) {
                   activeDays[tripIdx]--;
                   console.log("removed an active day to trip "+tripIdx);
            }
        }
        var rowData = [new Date(dateIdx), 90].concat(activeDays);
        //var rowData = [fooIdx].concat(activeDays);
        data.addRow(rowData);
        console.log("Row "+fooIdx+" is "+rowData);
        //divobj.innerHTML = "Row "+fooIdx+" is "+rowData;
        fooIdx++;
    }

    // Set chart options
    var options = {'title':'Active days on Schengen Zone tourist visa',
                   'width':400,
                   'height':300,
                   'isStacked':true,
                   'hAxis':{'title':'Date',
                            'format':'MMM yy'},
                   'seriesType':'area',
                   'series':{0:{'type':'line',
                                'lineDashStyle':[1,1],
                                'color':'red'}}
                  };
                   //'hAxis':{'title':'Date',
                   //         'format':'M/d/y',
                   //         'minValue':startDateRange,
                   //         'maxValue':endDateRange}};

    // Instantiate and draw our chart, passing in some options.
    chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(data, options);
//
////    function selectHandler() {
////        var selectedItem = chart.getSelection()[0];
////        var value = data.getValue(selectedItem.row, 0);
////        alert('The user selected ' + value);
////    }
}
