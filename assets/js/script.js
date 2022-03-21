let timerElarray = [];
let timearray = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm' ];
let allRowData = new Map()

setInterval(() => {
    let now = new Date()
    $("#currentDay").text(new Date().toLocaleTimeString())
    for (let savebutton of allRowData){
        let rowData = allRowData.get(savebutton[0])
        updatedTimeRow(rowData, now);
    }
}, 1000);

function createElements(index, now, savedtasks) {

    // holds value of total hours for each iteration of index
    let totalHours = index%24

    //putting down container elements
    let containerEl = $('.container')

    // row container element
    let rowEl = $("<div></div>")
    $(rowEl).addClass("row")

    //first column container
    let colEl = $("<div></div>")
    $(colEl).addClass("col-sm-1 col-md-1 col-lg-1")

    //header for all 24 hours of the day listed
    let timeEl = $("<h1></h1>")
    $(timeEl).text(timearray[index])
    timerElarray.push(timeEl)
    $(colEl).append(timeEl)    

    // column 2
    let colEl2 = $("<div></div>")
    $(colEl2).addClass("col-sm-10 col-md-10 col-lg-10")
    
    // input field inside column
    let inputCont = $("<div></div)")
    $(inputCont).addClass("input-group")
    $(colEl2).append(inputCont)
    let inputGroup = $("<div></div>")
    $(inputGroup).addClass("input-group-prepend")
    $(inputCont).append(inputGroup)
    let inputSpanGroup = $("<span>'To Do'</span>")
    $(inputSpanGroup).addClass("input-group-text")
    $(inputGroup).append(inputSpanGroup)

    let textBoxEl = $("<textarea></textarea>")
    $(textBoxEl).addClass("form-control")
    $(inputCont).append(textBoxEl)

    // column 3 
    let colEl3 = $("<div></div>")
    colEl3.addClass("col-sm-1 col-md-1 col-lg-1 bg-primary")
    $(colEl3).attr("id", "savebutton")
    let colEl3button = $("<button>Save Tasks</button>")
    $(colEl3).append(colEl3button)

    // appends all columns to rowEl
    $(rowEl).append(colEl)
    $(rowEl).append(colEl2)
    $(rowEl).append(colEl3)
    $(containerEl).append(rowEl)


    let rowData = {
        rowEl : $(rowEl),
        textBoxEl : $(textBoxEl),
        totalHours : totalHours,
    };

    // stores infor for each row in allRowData map
    allRowData.set(colEl3button[0], rowData)
    updatedTimeRow(rowData, now)

    let loadedTask = savedtasks[index] || ""
    $(textBoxEl).text(loadedTask);

    // save task callback
    function saveTask() {
        let prevTaskData = JSON.parse(localStorage.getItem("taskdata") || "{}")
        prevTaskData[index] = $(textBoxEl).val()
        localStorage.setItem("taskdata", JSON.stringify(prevTaskData))
    }
    
    // event listener for colEl3button
   $(colEl3button).click(saveTask)


}

$(document).ready(function() {
    let now = new Date()
    let savedtasks = JSON.parse(localStorage.getItem("taskdata") || "{}")
    for (let index = 0; index < 24; index++) {
        createElements(index, now, savedtasks);
    }
});

function updatedTimeRow (rowData, currentTime){
    let currentHour = currentTime.getHours();
    let compareHour = rowData.totalHours;
    let rowEl = rowData.rowEl;

    let state;

    if (currentHour === compareHour) {
        state = "current"
    } else if (currentHour > compareHour) {
        state = "before"
    } else {
        state = "after"
    }

    if (state != rowData.currentState) {
        rowEl.removeClass("time-" + rowData.currentState)
        rowData.currentState = state
        rowEl.addClass("time-" + rowData.currentState)
        rowData.textBoxEl.attr("disabled", state === "before")
    }

}

