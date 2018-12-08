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

function calcNextTrain(tFrequency, firstTimeStr) {

    var firstTime = firstTimeStr;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

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


