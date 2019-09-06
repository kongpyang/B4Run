//local forage get function with a callback of result or an empty array
function getRunInfo(cb) {
    localforage.getItem("runTracking").then(function (result) {
        cb(result || []);
    });
}

//local forage set function 
function setRunInfo(newRunInfo, cb) {
    localforage.setItem("runTracking", newRunInfo).then(cb);
};

document.getElementById("closeButton").addEventListener("click", function (event) {
    document.getElementById ("popUp").style.display="none";


})
//on click function to store value of user input to local storage and update table
document.getElementById("submitButton").addEventListener("click", function (event) {
    event.preventDefault();


        //grabbing user input from form
        let dateInput = document.getElementById("dateInput").value;
        let distanceInput = document.getElementById("distanceInput").value.trim();
        let startInput = document.getElementById("startInput").value;
        let endInput = document.getElementById("endInput").value;

        //if user doesn't enter data into any form input, prevent the table from grabbing data
        if (dateInput === "" || distanceInput === "" || startInput === "" || endInput === "") {
        
            document.getElementById ("popUp").style.display="block";



        }

        else {
            let runData = {
                dateInput: dateInput,
                distanceInput: distanceInput,
                startInput: startInput,
                endInput: endInput
            }

            //pushing user input into a new array
            getRunInfo(function (result) {
                let newArray = result;
                newArray.push(runData);

                // //setting the new array to local storage
                setRunInfo(newArray, function () {

                    //updating the display on page load
                    getRunInfo(function (result) {
                        updateDisplay(result);
                        console.log(result);
                    });
                })
            })
        }
    })


function updateDisplay(result) {

    //grabbing table from the DOM and giving it an empty string as it's HTML
    let tableContainer = document.getElementById("tableBody");
    tableContainer.innerHTML = "";

    //looping through the user input
    for (let i = 0; i < result.length; i++) {

        //math for calculating resultd in the table
        let startTime = result[i].startInput;
        let endTime = result[i].endInput;
        let startTimeConverted = moment(startTime, "hh:mm");
        let endTimeConverted = moment(endTime, "hh:mm");
        let diffTime = endTimeConverted.diff(moment(startTimeConverted), "minutes");
        let averageSpeed = Math.floor((diffTime / result[i].distanceInput) * 100) / 100;

        //populating the HTML elements with the result index
        tableContainer.innerHTML += "<tr><td>" + result[i].dateInput +
            "</td><td>" + result[i].distanceInput + "</td><td>" + diffTime + " " + " minutes" + "</td><td>"
            + averageSpeed + " " + " Minutes/Mile" + "</td>";
    }
}

//updating the display on page load
getRunInfo(function (result) {
    updateDisplay(result);
    console.log(result);
});







