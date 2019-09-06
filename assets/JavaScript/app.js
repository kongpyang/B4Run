
const weatherKey = "6a0d470ffbecb6a50a8e962ee8b76d25"
const napsterKey = "MjMxMDBhNjktY2YzNS00MTQwLWJjMTUtZGJmMmE0NjY3ODhi"
let perPage = 9;
let offset = 0;
let beerPerPage = 5;
let page = 0;
const userInput = document.getElementById("button");

const quotes = ['"The voice inside your head that says this is impossible is a liar"', '"Run when you can, walk if you must, crawl if you have to, just never give up"', '"We are what we repeatedly do. Excellence, then, is not an act, but a habit"', '"One run can change your day. Many runs can change your life"', '"The miracle isn’t that I finished. The miracle is that I had the courage to start"'];



// add onclick and enter key function to submit button
const input = document.getElementById("userInput");
input.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById("button").click()
    }
})


document.getElementById("closeButton").addEventListener("click", function (event) {
    document.getElementById ("popUp").style.display="none";
})

//main function to display all info after submit button is clicked
document.getElementById("button").addEventListener("click", function (event) {
    document.getElementById ("popUp").style.display="none";
    // grabbing the user input from the form
    event.preventDefault()
    let city = document.getElementById("userInput").value.trim();

    // if user enters a comma
    let cityIncludes = city.includes(",");
    
    // alert "can't use comma"
    if (cityIncludes || city === "") {
        document.getElementById ("popUp").style.display="block";

}

    // if user doesn't enter a comma run functions
    else {
        document.getElementById("weatherDiv").style.display = "block";
        document.getElementById("motivationalQuote").style.display = "block";
        document.getElementById("beerDiv").style.display = "block";
        document.getElementById("form").innerHTML = "";
        document.getElementById("slogan").innerHTML = "";

        if (offset === 0) {
            getMusic();
            getQuotes();
            getweather();
            musicButton();
            beerButton();
            getBeer();
        }
        else {
            getMusic();
        }
    }


    //function for getting quotes from our array and displayin them on the page
    function getQuotes() {

        //grabbing motivational quote from the dom and changing the HTML to the quotes in our array
        const quoteDiv = document.getElementById('motivationalQuote');

        //start at the second quote in the array
        let counter = 1;

        //display first quote of the array when page is loaded
        quoteDiv.innerHTML = quotes[0];

        //function to cycle through the quotes in the array without repeating the quote twice in a row
        setInterval(function () {
            quoteDiv.innerHTML = quotes[counter++ % quotes.length];
        }, 8000)
    }



    //function for getting weather data
    function getweather() {

        //variable containing the Open Weather URL
        const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + weatherKey;

        // Get function using Axios to call the response of Open Weather
        axios.get(weatherURL).then(function (response) {
            console.log(response.data);

            //creating div for Open Weather and assigning it a class
            weatherDiv = document.createElement("div");
            weatherDiv.classList.add("weatherDisplay");

            let icon = document.getElementById("weatherDescription").textContent = response.data.weather[0].icon;
            document.getElementById("weather").textContent = Math.floor(response.data.main.temp - 273.15) * 9 / 5 + 32 + " " + "Degrees ";
            document.getElementById("weatherDescription").textContent = response.data.weather[0].description;
            document.getElementById("humidity").textContent = response.data.main.humidity + "%";
            document.getElementById("city").innerHTML = "Current weather in " + " " + response.data.name + " " + '<img src="http://openweathermap.org/img/wn/' + icon + '.png" width="150" height="150"/>';
            document.getElementById("wind").textContent = Math.floor(response.data.wind.speed) + " " + "MPH";
        })
    }



    function getMusic() {

        //variable containing the Napster URL
        let napsterSongURL = "https://api.napster.com/v2.1/playlists/pp.188152066/tracks?apikey=" +
            napsterKey + "&limit=" + perPage + "&offset=" + offset;

        // Get function using Axios to call the response of Napster
        axios.get(napsterSongURL).then(function (response) {

            //grabbing songs from Napster API
            let napsterSongData = response.data.tracks;
            console.log(response.data);

            //adds 9 new songs when button is pressed
            offset += napsterSongData.length;

            //looping through the songs in the Napster API
            for (i = 0; i < napsterSongData.length; i++) {
                let myUrl = napsterSongData[i].previewURL;
                let artistID = napsterSongData[i].artistId;
                let artistImageURL = "https://api.napster.com/imageserver/v2/artists/" + artistID +
                    "/images/300x300.jpg?apikey=" + napsterKey + "&limit=" + perPage + "&offset=" + offset;
                let artistImage = "<img id='artistImage' src=' " + artistImageURL + "'/>";

                //adding a header for the Napster div by changing the HTML of #musicQuote
                const getMoving = document.getElementById("musicQuote");
                getMoving.innerHTML = "A little something to get you on your feet!";

                //creating a div for Napster and assigning it a class
                let songDiv = document.createElement("div");
                songDiv.classList.add("songDisplay");


                //creating artist images and audio elements for each song in the API array
                let html = artistImage + "<audio controls><source class='audioSource' src=" + myUrl + "></audio>";
                songDiv.innerHTML += html;

                //appending the musicQuote and the songDiv to the DOM
                document.getElementById("napsterDiv").prepend(getMoving);
                document.getElementById("napsterDiv").append(songDiv);
            }
        })
    }



    function musicButton() {
        let newMusicButton = document.createElement("button");
        newMusicButton.classList.add("newButton");
        newMusicButton.innerHTML = "Grab More Music";
        newMusicButton.addEventListener("click", getMusic);
        document.getElementById("musicButton").append(newMusicButton);
    }


    // Beer funtion
    function getBeer() {

        let getBeerURL = "https://api.openbrewerydb.org/breweries?per_page=" + beerPerPage + "&page=" + page + "&by_city=" + city;
        axios.get(getBeerURL).then(function (response) {

            let beerData = response.data;
            let beerList = [];
            console.log(beerData);

            page++;

            for (i = 0; i < beerData.length; i++) {
                let breweryName = response.data[i].name;
                let breweryAddress = response.data[i].street;
                let breweryWebsite = response.data[i].website_url;


                let breweryInfo = "<div class='breweryInfo'><h2>" + breweryName + "</h2>" + breweryAddress + "<br> <a class='breweryWebsite' href=" + breweryWebsite + ">www. " + breweryName + " .com </a><br><hr></div>";
                beerList.push(breweryInfo)
            }
            const beerTitle = "<p id='beerTitle'>The pot of gold at the end of the rainbow!</p><br><hr>";
            document.getElementById("beerDiv").innerHTML = beerTitle + beerList.join(" ");
        })
    }

    function beerButton() {
        let newBeerButton = document.createElement("button");
        newBeerButton.classList.add("newButton");
        newBeerButton.innerHTML = "Grab More Beer";
        newBeerButton.addEventListener("click", getBeer);
        document.getElementById("beerButton").append(newBeerButton);
    }
})
