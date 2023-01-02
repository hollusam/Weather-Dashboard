var APIKey = "e8e30d04ced78b055b856ef735924d06";

// Gets previous searches from local storage
var storedHistory = JSON.parse(localStorage.getItem("storedHistory")) || [];

if (storedHistory.length > 0) {
  displayWeatherInfo(storedHistory[storedHistory.length - 1]);
}

for (var i = 0; i < storedHistory.length; i++) {
    
    // Appends the row to history div
    renderHistory(storedHistory[i]);
}

// Function for displaying history
function renderHistory(btn) {
    // $("#history").empty();
  
    // Looping through the array of stored history
  
    var cityBtn = $("<button>");
  
    cityBtn.addClass("btn btn-secondary btn-block");
    // cityBtn.attr("data-name", storedHistory[i]);
    cityBtn.text(btn);
    $("#history").append(cityBtn);
  }
  
    // Listener for button on click function
    $("#history").on("click", ".btn", function () {
      displayWeatherInfo($(this).text());
      displayWeatherForecast($(this).text());
    });
  

function displayWeatherInfo(citySearch) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    citySearch +
    "&appid=" +
    APIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    if (storedHistory.indexOf(citySearch) === -1) {
      // Pushing the search city into history array
      storedHistory.push(citySearch);

      // Storing the searched city
      localStorage.setItem("storedHistory", JSON.stringify(storedHistory));
      renderHistory(citySearch);

    }
    // Clears out the old contents
    $("#today").empty();

    var todayDiv = $("<div class='city'>");
    
    // Storing weather icon
    var iconEl = $("<img>").attr(
      "src",
      "https://api.openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );

    var today = moment();
    var title = $("<h3>").text(citySearch + " " + today.format("(D/M/YYYY)"));
    title.append(iconEl);
    todayDiv.append(title);

    // Storing weather temperature
    var temperature = (response.main.temp - 273).toFixed(2);
    var pOne = $("<p>").text("Temp: " + temperature + " C");
    todayDiv.append(pOne);

    // Storing weather wind
    var wind = (response.wind.speed * 1.60934).toFixed(2);
    var pTwo = $("<p>").text("Wind: " + wind + " KPH");
    todayDiv.append(pTwo);

    // Storing weather Humidity
    var humidity = response.main.humidity;
    var pThree = $("<p>").text("Humidity: " + humidity + " %");
    todayDiv.append(pThree);

    $("#today").append(todayDiv);
  });
  console.log("she");
  fetch(queryURL);
}

// Function to display the weather forecast
function displayWeatherForecast(citySearch) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    citySearch +
    "&appid=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // Creating header and row
    var h4El = $("<h4>").text("5-Day Forecast:");
    var forecastRow = $("<div>").addClass("row");

    // Clears out the old contents
    $("#forecast").empty();

    // Appending the header to forecast section
    $("#forecast").append(h4El);

    // Looping to create cards for 5-day forecast
    for (var i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.indexOf("03:00:00") !== -1) {
        var forecastCol = $("<div>").addClass("col-md-2.4");
        forecastRow.append(forecastCol);

        var forecastCard = $("<div>").addClass("card bg-dark text-white");
        forecastCol.append(forecastCard);

        var forecastBodyCard = $("<div>").addClass("card-body p-2");
        forecastCard.append(forecastBodyCard);

        var forecastDate = moment(response.list[i].dt_txt);
        var title = $("<h3 class = card-title>").text(
          forecastDate.format("(D/M/YYYY)")
        );

        var forecastIcon = $("<img>").attr(
          "src",
          "https://api.openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
        );

        // Storing weather temperature
        var temperature = (response.list[i].main.temp - 273).toFixed(2);
        var pOne = $("<p>").text("Temp: " + temperature + " C");

        // Storing weather wind
        var wind = (response.list[i].wind.speed * 1.60934).toFixed(2);
        var pTwo = $("<p>").text("Wind: " + wind + " KPH");

        // Storing weather Humidity
        var humidity = response.list[i].main.humidity;
        var pThree = $("<p>").text("Humidity: " + humidity + " %");

        forecastBodyCard.append(title, forecastIcon, pOne, pTwo, pThree);

        $("#forecast").append(forecastRow);
      }
    }
  });
}

// Search button click function
$("#search-button").on("click", function (event) {
  event.preventDefault();

  // Getting the value in
  var citySearch = $("#search-input").val().trim();

  // Empty input field
  $("#search-input").val("");

  displayWeatherInfo(citySearch);
  displayWeatherForecast(citySearch);
});




