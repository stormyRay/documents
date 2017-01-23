function dayOfYear(year, month, day) {
	var daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var daysOfMonthInLeapyear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var isLeapYear = ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0));
	console.log(isLeapYear);
	var daysMapping = isLeapYear ? daysOfMonthInLeapyear : daysOfMonth;

	var days = 0;
	for(var i = 0; i < month - 1; i ++){
		days += daysMapping[i];
	}

	days += day;

	return days;
}

console.log(dayOfYear(2016, 1, 3));
console.log(dayOfYear(2016, 2, 3));
console.log(dayOfYear(2016, 12, 31));