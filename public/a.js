let count=0;

var currentDate,
	$forecastDivs = $('#future .container'),
	$locateBtn = $('#locateBtn'),
	$unitBtn = $('#unitBtn');



let locationData={
	byName:true,
	name:"Surat, India",
	lat:0,
	lon:0
}


	// -----------------
	// Geolocation API
	// -----------------

	//This get hit when we click get location button
	function getCurrentLocation() {

		// If geolocation is not supported, output msg and exit out of function
		if (!navigator.geolocation){
			showStatus('error', 'ERROR: Geolocation is not supported by this browser');
			return;
		}


		function showPosition(position) {

			locationData.byName=false;
			locationData.lat=position.coords.latitude;
			locationData.lon=position.coords.longitude;


			getWeather(locationData); // Get weather after getting position
	
			showStatus('success', 'Success! Location found.');
			
			$locateBtn.addClass('on'); // Toggle btn class to on if successful
		}



		function showError(error) {
			switch(error.code) {
        case error.PERMISSION_DENIED:
					showStatus('error', 'ERROR: Geolocation request denied.');
					break;
        case error.POSITION_UNAVAILABLE:
					showStatus('error', 'ERROR: Location information is unavailable.');
					break;
        case error.TIMEOUT:
					showStatus('error', 'ERROR: The request to get user location timed out.');
					break;
        case error.UNKNOWN_ERROR:
					showStatus('error', 'ERROR: An unknown error occurred.');
					break;
    	}
		}
		showStatus('', 'Locating…'); // In progress text
		navigator.geolocation.getCurrentPosition(showPosition, showError, {enableHighAccuracy: true});
	}
	



	// ---------------
	// Weather API
	// ---------------
	

	// Send request to API to get weather data





	function getWeather(locationData) {
		showStatus( "",'Loading forcast data');
		$("html, body").animate({ scrollTop: 0 }, "slow");
		
		if(locationData.byName){
			let weatherRequest = $.ajax({
				method: 'GET',
				url: `/weather?address=${locationData.name}`
			});

			// If getting was successful, send data to be processed
			weatherRequest.done(function(data) {
		
				displayWeather(data);
				if(count>0){
					showStatus('success', 'We found the data you were looking for.');
				}
				count++;


			// If request fails, show error
				weatherRequest.fail(function(xhr, status, error) {
					console.warn(error);
				});

			})
		}else{

			let weatherRequest = $.ajax({
				method: 'GET',
				url: `/cord?lat=${locationData.lat}&lon=${locationData.lon}`
			});

			// If getting was successful, send data to be processed
			weatherRequest.done(function(data) {
				displayWeather(data);
				if(count>0){
					showStatus('success', 'We found the data you were looking for.');
				}


				count++;


			// If request fails, show error
			weatherRequest.fail(function(xhr, status, error) {
				console.warn(error);
			});

			})

		}
		
	}





	
	// Display data on page
	function displayWeather(data) {

		changeBackground(data.forcastData.isDay);
		console.log(data.forcastData.isDay);
	
		$('#current .location').html(data.name);
		$('#current .date').html(data.forcastData.localtime);
		$('#current .temp').html(data.forcastData.currentTemp);
		$('#current .conditions').html(data.forcastData.currentStatus);

		// $('#current .weatherIcon > div').attr('class', today.icon);


		if(data.forcastData.isDay=="no" ){
			$("#sun-moon").attr("src","images/clearMoon.svg");
		}else{
			$("#sun-moon").attr("src","images/clearSun.svg");
			
		}
		
		


		$('#lastUpdated').html('Last updated at ' + getCurrentTime().time);

		// Add forecast data to page, don't display temps yet

		// $forecastDivs.each(function(index) {
		// 	$(this).find('.day').html(forecast[index].weekdayShort);
		// 	$(this).find('.weatherIcon').children().attr('class', forecast[index].icon);
		// 	$(this).find('.conditions').html(forecast[index].conditions);
		// });

	}



	
	// ------------
	// Status Bar
	// ------------



	var $statusBar = $('#status');
	
	function showStatus(statusType, message) {
		var $statusText = $statusBar.children('p');
		var icon = '';
		// Set icon based on statusType
		if (statusType === 'error') {
			icon = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
		} else if (statusType === 'success') {
			icon = '<i class="fa fa-check-circle" aria-hidden="true"></i>';
		}
		// Set status class, icon, text, and open animation
		$statusText.html(icon + message);
		$statusBar.attr('class', statusType).slideDown('fast');
	}
	// Status bar close animation
	$statusBar.children('.close').on('click', function() {
		$statusBar.slideUp('fast'); // Slide up animation
	});
	
	// ---------------
	// Misc Functions
	// ---------------
	



	// Get and format current time
	function getCurrentTime() {
		var now = new Date();
		var hours = now.getHours();
		var mins = now.getMinutes();
		var period = ' am';

		let isDay=false;
		if(hours>=6 && hours<18){
			isDay=true;
		}

		if (hours > 11) {
			period = ' pm';
			if (hours > 12) hours -= 12; // Format for 12-hr clock
		}
		if (mins < 10) {
			mins = '0' + mins; // Format minutes
		}
		return {time:hours + ':' + mins + period, isDay};
	}
	

	
	// ------------------------
	// Locate and Unit Buttons
	// ------------------------
	
	// locateBtn - click to get current location
	$locateBtn.on('click', function() {
		getCurrentLocation($(this));
		$(this).removeClass('on pulse');
		// $("html, body").animate({ scrollTop: 0 }, "slow");
	});
	

	// ------------------------
	// Functions to run onload
	// ------------------------ 



	function changeBackground(isDay){
		if(isDay=="no" || !isDay){
			$("body").css("background-color", "black");
			$("body").css("color", "white");
			$('#locateBtn').css("border", "3px solid white");
		}else{
			$("body").css("background-color", "#a9f1f6");
			$("body").css("color", "black");
			$('#locateBtn').css("border", "3px solid black");
		}
	}

	
	window.onload = function() {

		changeBackground(getCurrentTime().isDay);

		
		getWeather(locationData); // Default to get Chicago weather
		// Suggest to share location with message and button animation


		setTimeout(function() {
			showStatus('', 'Click on the <i class="fa fa-location-arrow" aria-hidden="true"></i> button to share your current location. Currently defaults to Surat,India');
			$locateBtn.addClass('pulse');
		}, 1000);
	};








$("#inpt_search").on('focus', function () {
	$(this).parent('label').addClass('active');
	$(this).attr('placeholder', 'Press enter to search');
});

$("#inpt_search").on('blur', function () {
	if($(this).val().length == 0)
		$(this).parent('label').removeClass('active');
		$(this).attr('placeholder', '');
});



const weatherForm = document.querySelector('#WeatherForm')
const search = document.querySelector('#inpt_search')


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

	const locationSearch = search.value
	search.value="";
	// $("html, body").animate({ scrollTop: 0 }, "slow");
	// showStatus('', 'Locating…');
	getWeather({
		byName:true,
		name:locationSearch
	})



})
