$(document).ready(function() {

	cal_months_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
					 
	cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	cal_current_date = new Date(); 
	
	var now = new Date();  
	var currMonth = now.getMonth() + 1;  
	var currDay = now.getDate();  
	var currYear = now.getFullYear();  
	
	var currDate = currDay + "." + currMonth + "." + currYear;

	function Calendar(month, year) {
		this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
		this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
		this.html = '';
	}

	Calendar.prototype.generate = function(year, month) {
	
		// start with default values (needed for "today" button)
		if (year == 0 && month == 0) {
			this.year = cal_current_date.getFullYear();
			this.month = cal_current_date.getMonth();
		} else {
	
			if (year && year != 0) {
				this.year = this.year + year;
			}
			
			if (month && month != 0) {
				var newMonth = this.month + month;
				var maxMonth = cal_months_labels.length - 1;			
				
				if (newMonth > maxMonth) { // check if the new month is over month range boundaries
					var diff = newMonth - maxMonth;
					this.month = 0;

					this.year = this.year + 1;
					
				} else if (newMonth < 0) { // check if the new month is under month range boundaries
					this.year = this.year - 1;
					
					this.month = maxMonth;
				
				} else { // no boundaries are overceeded, so proceed normally
					this.month = this.month + month;
				}
			}
		}

		// get first day of month
		var firstDay = new Date(this.year, this.month, 1);
		var startingDay = firstDay.getDay();
	  
		// get number of days in month
		var monthLength = cal_days_in_month[this.month];
	  
		// handle leap year (decide whether feb is 28 or 29 days
		if (this.month == 1) { // month starts counting at 0, so february is 1
			if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {
				monthLength = 29;
			}
		}
	  
		// print out current month and year
		var monthName = cal_months_labels[this.month]
		var today =  monthName + "&nbsp;" + this.year;
		
		var html = '<tr>';
		
		var day = 1;
		// generate weeks (rows)
		for (var i = 0; i < 9; i++) {
			// generate cells
			for (var j = 0; j <= 6; j++) { 
				html += '<td class="dayCell';
				// color current day
				if (currDate == day + "." + (this.month + 1) + "." + this.year) {
					html += ' now';
				}
				html += '" title="Click to add event" rel="';
				html += day + '-' + this.month + '-' + this.year;
				html += '">';
				if (day <= monthLength && (i > 0 || j >= startingDay)) {					
					html += '<div class="date">' + day + '</div>';
					html += '<div class="events"></div>';
					day++;
				}
				html += '</td>';
			}
			// stop making rows if we've run out of days
			if (day > monthLength) {
				break;
			} else {
				html += '</tr><tr>';
			}
		}
		html += '</tr>';

		this.html = html;
		this.today = today;
	}

	Calendar.prototype.output = function() {
		$('#today').html(this.today);
		return this.html;		
	}

	// generate new calendar instance
	var cal = new Calendar();

	// call init calendar function (without parameters, the defaults (today) will be loaded)
	generateCalendar(0,0);

	function generateCalendar(year, month) {
		cal.generate(year, month);

		// print out generated calender in placeholder with id 'calendar'
		$('#calendar').html(cal.output());
	}

	function createEvent() {
        var $dialogContent = $("#event_edit_container");
		 
		$dialogContent.find("input").val("");
		$dialogContent.find("textarea").val("");
		
		var dayID = $(this);		

		// calEvent leads to error!!!!
        /*var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
        var endField = $dialogContent.find("select[name='end']").val(calEvent.end);*/
		
		var startField = $dialogContent.find("select[name='start']").val('');
        var endField = $dialogContent.find("select[name='end']").val('')
		
        var titleField = $dialogContent.find("input[name='title']");
        var bodyField = $dialogContent.find("textarea[name='body']");

        $dialogContent.dialog({
            modal: true,
            title: "New Calendar Event",
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
            },
            buttons: {
				save : function() {
			   
					// calEvent leads to error!!!
					/*calEvent.id = id;
					id++;
					calEvent.start = new Date(startField.val());
					calEvent.end = new Date(endField.val());
					calEvent.title = titleField.val();
					calEvent.body = bodyField.val();*/

					$dialogContent.dialog("close");
				},
				cancel : function() {
					$dialogContent.dialog("close");
				}
            }
        }).show();

		// leads to error!!
        //$dialogContent.find(".date_holder").text(formatDate(calEvent.start));
    }
	
	function formatDate(date) {
		format = "H:i a";
        var options = this.options;
        var returnStr = '';
        for (var i = 0; i < format.length; i++) {
            var curChar = format.charAt(i);
            returnStr += curChar;
        }
        return returnStr;
    }

	// event handler for the date navigation
	$("#previous_year").click(function() {
        generateCalendar(-1,0);
        return false;
    });	
	$("#previous_month").click(function() {
        generateCalendar(0,-1);
        return false;
    });	
	$("#next_month").click(function() {	
        generateCalendar(0,1);
        return false;
    });	
	$("#next_year").click(function() {
        generateCalendar(1,0);
        return false;
    });	
	$("#todayselector").click(function() {
		generateCalendar(0,0);
        return false;
    });
	$(".dayCell").click(function() {
		createEvent();
    });
});