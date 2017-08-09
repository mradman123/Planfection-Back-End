// default day object
var DEFAULT_workSTART = '06:00';
var DEFAULT_workEND = '23:00';
var DEFAULT_breakSTART = '00:00';
var DEFAULT_breakEND = '00:00';
var DEFAULT_OPEN = true;


var _createDayJSON = function (dayTitle, workStart, workEnd, breakStart, breakEnd, open){

	return{
		'day' : dayTitle, // Monday, Tuesday...
		'workStart' : workStart, // HH:MM
		'workEnd' : workEnd, // HH:MM
		'breakStart' : breakStart, // HH:MM
		'breakEnd' : breakEnd, // HH:MM
		'open' : open // Bool
	}		
}

var _createDefaultWorkingTime = function(){

	// days in week
	var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	// new array of default working times
	var workingTime = new Array();

	// create default day object for every day
	for(var i=0; i < days.length; i++)
		workingTime.push(_createDayJSON(days[i], DEFAULT_workSTART, DEFAULT_workEND, DEFAULT_breakSTART, DEFAULT_breakEND, DEFAULT_OPEN));

	return workingTime;
} 

// export default time functions
module.exports = {

	CreateDefaultWorkingTime: _createDefaultWorkingTime
	
}