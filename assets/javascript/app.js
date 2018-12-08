var config = {
    apiKey: "AIzaSyAsz9F9oZ9hKSsRxU2j0j_fVw5pDNXDZz8",
    authDomain: "my-first-project-44779.firebaseapp.com",
    databaseURL: "https://my-first-project-44779.firebaseio.com",
    projectId: "my-first-project-44779",
    storageBucket: "my-first-project-44779.appspot.com",
    messagingSenderId: "619256247493"
};
firebase.initializeApp(config);
var dbref = firebase.database().ref("san-train-db");

renderGrid(20);
setInterval(upFunction, 1000);

function upFunction() {
    var humanReadable = moment().format("hh:mm:ss A");

    $("#clock").text(humanReadable);
}

$("#add-train").on("click", function (e) {
    e.preventDefault();

    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = $("#time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    var formValuemap = $('#trainForm').serializeArray();

    dbref.push({
        name: name,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency,
        timeAdded: firebase.database.ServerValue.TIMESTAMP
    });
    // renderGrid(1);
    $('#trainForm').trigger("reset");
});

function renderGrid(count) {
    dbref.orderByChild("timeAdded").limitToLast(count).on("child_added", function (snapshot) {
        var record = snapshot.val();
        displayRecord(record);
    });
}
function displayRecord(rec) {
    var dateNextTrain = calcNextTrain(rec.frequency, rec.trainTime);
    var minsAway = dateNextTrain.diff(moment(), "minutes");

    var dayDiff = dateNextTrain.diff(moment(), "days")
    if (dayDiff > 0) pattern = "MM/DD/YYYY HH:mm";
    else pattern = "HH:mm";

    var nextArival = dateNextTrain.format(pattern);

    var trainTR = "<tr>" +
        "<td>" + rec.name + "</td>" +
        "<td>" + rec.destination + "</td>" +
        "<td>" + rec.frequency + "</td>" +
        "<td>" + nextArival + "</td>" +
        "<td>" + minsAway + "</td>" +
        "</tr>";
    $("#trainList").prepend(trainTR);
}





/*
//read firebasetime
var m=moment("1544125811567", "x");
console.log(m.format("MMM Do, YYYY hh:mm:ss"));
*/

/*
//we should get 16:20, since it is append to current 15:20
var dateNextTrain = calcNextTrain(60, "15:20");

//we should get nextDay 3:20 which is 24 hours from above 3:20 
var dateNextTrain = calcNextTrain(60 * 24, "15:20");
console.log("dateNextTrain=", dateNextTrain.format("MM/DD/YY HH:mm"));


var nextArival = dateNextTrain.format("MM/DD/YY HH:mm");
console.log("nextArival=", nextArival);

var minsAway = dateNextTrain.diff(moment(), "minutes");
console.log("minsAway=", minsAway);
*/

function calcNextTrain(tFrequency, firstTimeStr) {
    //var tFrequency = 3;

    // Time is 3:30 AM
    //var firstTime = "03:30";
    var firstTime = firstTimeStr;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    ///console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    ///console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    ///console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    ///console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    ///console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    ///console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    return nextTrain;
}
/*

    dbref.push({
        name: "trainName_1",
        destination: "train dest 1",
        trainTime: "14:26",
        frequency: 5,
        timeAdded: firebase.database.ServerValue.TIMESTAMP
    });

dbref.orderByChild("timeAdded").limitToLast(1).on("child_added", function (snapshot) {
    var record = snapshot.val();


    displayRecord(record);
    $('#trainForm').trigger("reset");
});
*/
/*
//to read all recored from firebase on page load into the display grid
dbref.on('value', function (snapshot) {
    // console.log("main", snapshot.val());
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        //     console.log("child", childData);
        //displayRecord(childData);
    });
});
*/
function add(aa, bb) {
    return aa + bb;
}


var a = 3;
var b = 4;
console.log(add(a, b));

// var tFrequency = 3;

// // Time is 3:30 AM
// var firstTime = "0";

// // First Time (pushed back 1 year to make sure it comes before current time)
// var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
// console.log(firstTimeConverted);

// // Current Time
// var currentTime = moment();
// console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// // Difference between the times
// var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
// console.log("DIFFERENCE IN TIME: " + diffTime);

// // Time apart (remainder)
// var tRemainder = diffTime % tFrequency;
// console.log(tRemainder);

// // Minute Until Train
// var tMinutesTillTrain = tFrequency - tRemainder;
// console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// // Next Train
// var nextTrain = moment().add(tMinutesTillTrain, "minutes");
// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
//   </script>
