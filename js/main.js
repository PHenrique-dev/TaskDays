// Integração Google Calendar
const CLIENT_ID = '444431190037-0d9b8bcat1rhtd6tuejlujc9p75fosk3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA9Fk_nv4Y7MEhWLMJoEhKnYIEPbhfTKNA';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar";

let gapiLoaded = false;
let googleAuth;

function loadGapi(callback) {
	if (gapiLoaded) return callback();
	const script = document.createElement('script');
	script.src = "https://apis.google.com/js/api.js";
	script.onload = function() {
		gapi.load('client:auth2', async function() {
			await gapi.client.init({
				apiKey: API_KEY,
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				scope: SCOPES
			});
			googleAuth = gapi.auth2.getAuthInstance();
			gapiLoaded = true;
			callback();
		});
	};
	document.body.appendChild(script);
}

function signInGoogleCalendar(callback) {
	loadGapi(function() {
		if (!googleAuth.isSignedIn.get()) {
			googleAuth.signIn().then(callback);
		} else {
			callback();
		}
	});
}

function createCalendarEvent(atividade, callback) {
	signInGoogleCalendar(function() {
		const hoje = new Date();
		const startDate = new Date(hoje);
		const endDate = new Date(hoje);
		let [hStart, mStart] = atividade.horaInicio.split(':');
		let [hEnd, mEnd] = atividade.horaFim.split(':');
		startDate.setHours(hStart, mStart, 0);
		endDate.setHours(hEnd, mEnd, 0);
		const event = {
			summary: atividade.nome,
			start: { dateTime: startDate.toISOString() },
			end: { dateTime: endDate.toISOString() },
			reminders: { useDefault: true }
		};
		gapi.client.calendar.events.insert({ calendarId: 'primary', resource: event }).then(function(resp) {
			if (callback) callback(resp.result);
		});
	});
}

function updateCalendarEvent(eventId, atividade, callback) {
	signInGoogleCalendar(function() {
		const hoje = new Date();
		const startDate = new Date(hoje);
		const endDate = new Date(hoje);
		let [hStart, mStart] = atividade.horaInicio.split(':');
		let [hEnd, mEnd] = atividade.horaFim.split(':');
		startDate.setHours(hStart, mStart, 0);
		endDate.setHours(hEnd, mEnd, 0);
		const event = {
			summary: atividade.nome,
			start: { dateTime: startDate.toISOString() },
			end: { dateTime: endDate.toISOString() },
			reminders: { useDefault: true }
		};
		gapi.client.calendar.events.update({ calendarId: 'primary', eventId: eventId, resource: event }).then(function(resp) {
			if (callback) callback(resp.result);
		});
	});
}

function deleteCalendarEvent(eventId, callback) {
	signInGoogleCalendar(function() {
		gapi.client.calendar.events.delete({ calendarId: 'primary', eventId: eventId }).then(function(resp) {
			if (callback) callback(resp.result);
		});
	});
}
