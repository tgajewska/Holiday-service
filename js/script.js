$(function() {
	setMaxDate();
	$('#submit').on('click', function () {
		const $btn = $(this);
		$btn.addClass('loading');
		$btn.prop('disabled', true);

		const date = handleDate()[1];
		const apiUrl = handleDate()[0];

		loadingData(apiUrl, date, $btn);
	});
})


var view = {
	displayMessage: function(msg) {
		$('#response').html(msg);
	},
	clearSettings: function() {
		$('#inputDate').val('');
	}
}

//get date choosen by user
function handleDate() {
	const choosenDate = new Date($('#inputDate').val());

	if (isNaN(choosenDate)) { view.displayMessage("Nie podałeś poprawnej daty. Spróbuj jeszcze raz!") }

	else {
		const year = choosenDate.getFullYear();
		const month = choosenDate.getMonth() + 1;
		const day = choosenDate.getDate();
		const date = day + '.' + month + '.' + year;

		const apiUrl = setApiUrl(day, month, year);

		return [apiUrl, date];
	}
}

function setApiUrl(day, month, year) {
	const basicUrl = "https://holidayapi.com/v1/holidays?key=fde99ba9-f987-461b-87ba-cf18e710b773&country=PL";
	const apiUrl = basicUrl + '&year=' + year + '&month=' + month + '&day=' + day;
	return(apiUrl);
}

function loadingData(apiUrl, date, $btn) {
	//loading data
	$.ajax({
		url : apiUrl,
		method      : 'get',
		dataType : 'json'
	})

	//success
	.done(function(res) {

		if (res.holidays.length == 0) {
			view.displayMessage(`Dnia <span>${date}</span> nie było święta.`);
		}
		else {
			const feastName = res.holidays[0].name;
			view.displayMessage(`Dnia <span>${date}</span> było święto o nazwie <span>${feastName}</span>.`);
		}
	})

	//error
	.fail(function() {
		alert("Wystąpił błąd, spróbuj jeszcze raz!");
	})

	//restoring default settings
	.always(function() {
		$btn.removeClass('loading');
		$btn.prop('disabled', false);
		view.clearSettings();
	});
}

//setting max date available for choosing

function setMaxDate() {
	const today = new Date();
	let yesterday = new Date(today);
	yesterday.setDate(today.getDate()-1);

	const max = yesterday.toJSON().split('T')[0];
	$('#inputDate').prop('max', max);
}
