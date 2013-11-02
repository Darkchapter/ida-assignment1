// just process the following when the whole page is loaded and ready
$(document).ready(function() {

	// list of month names as array; allows easy access for displaying
	monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	// list of numbers of days in each month; easier for processing in loops
	monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var now = new Date();  
	var currMonth = now.getMonth() + 1;  
	var currDay = now.getDate();  
	var currYear = now.getFullYear();  
	
	var currDate = currDay + "." + currMonth + "." + currYear;

	function Calendar(month, year) {
		this.month = (isNaN(month) || month == null) ? now.getMonth() : month;
		this.year  = (isNaN(year) || year == null) ? now.getFullYear() : year;
		this.html = '';
	}

	Calendar.prototype.generate = function(year, month) {
	
		// start with default values (needed for "today" button)
		if (year == 0 && month == 0) {
			this.year = now.getFullYear();
			this.month = now.getMonth();
		} else {
	
			if (year && year != 0) {
				this.year = this.year + year;
			}
			
			if (month && month != 0) {
				var newMonth = this.month + month;
				var maxMonth = monthNames.length - 1;			
				
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
		var monthLength = monthDays[this.month];
	  
		// handle leap year (decide whether feb is 28 or 29 days
		if (this.month == 1) { // month starts counting at 0, so february is 1
			if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {
				monthLength = 29;
			}
		}
	  
		// print out current month and year
		var monthName = monthNames[this.month]
		var today =  monthName + "&nbsp;" + this.year;
		
		var html = '<tr>';
		
		var day = 1;
		// generate weeks (rows)
		for (var i = 0; i < 9; i++) {
			// generate cells
			for (var j = 0; j <= 6; j++) {
			
				// start painting a table cell and add a style class
				html += '<td class="';
				
				// differ between cells of current month (dayCell) and cells from other months (dayCellOutside)
				if (day <= monthLength && (i > 0 || j >= startingDay)) {
					html += 'dayCell';
				} else {
					html += 'dayCellOutside';
				}
				
				// color current day
				if (currDate == day + "." + (this.month + 1) + "." + this.year) {
					html += ' now';
				}
				
				// end of style classe
				html += '"';
				
				// only add title if processing a cell of current month
				if (day <= monthLength && (i > 0 || j >= startingDay)) {
					html += 'title="Click to add event"';
				}
				
				// only add rel attribute id if processing a cell of current month
				if (day <= monthLength && (i > 0 || j >= startingDay)) {
					html += ' rel="';
					html += this.month + '-' + day + '-' + this.year;
					html += '"';
				}
				
				// end of table cell opening
				html += '>';
				
				// if currently processed table cell contains a valid date of current month, print out the date and a block placeholder for events
				if (day <= monthLength && (i > 0 || j >= startingDay)) {					
					html += '<div class="date">' + day + '</div>';
					html += '<div class="events"></div>';
					
					// increase day counter for next iteration
					day++;
				}
				
				// close table cell
				html += '</td>';
			}
			
			// stop making rows if we've run out of days
			if (day > monthLength) {
				break;
			} else { // finished one row, but more to go, so add another row
				html += '</tr><tr>';
			}
		}
		
		// finished a row
		html += '</tr>';

		// save the generated html output
		this.html = html;
		
		// save the current date (today) for printing out in table header
		this.today = today;
	}

	// output function of the calender; displays the "today" string and returns the generated calender html
	Calendar.prototype.output = function() {
		$('#today').html(this.today);
		return this.html;		
	}

	// generate new calendar instance
	var cal = new Calendar();

	// call init calendar function (without parameters, the defaults (today) will be loaded)
	generateCalendar(0,0);

	// function for generating the calendar; needed to be able to switch between months/years and so modify the parameters with which the calendar function is called (increases/decreases month and/or year by 1)
	function generateCalendar(year, month) {
		cal.generate(year, month);

		// print out generated calender in placeholder with id 'calendar'
		$('#calendar').html(cal.output());
	}

	// function is called when user has clicked on a valid dayCell
	// displays a modal dialog with the form for entering the details for a new event
	function createEvent(dayCell) {
	
		// get a handle to the dialog form in the html
        var $dialogContent = $("#eventform");
		
		// find the input field for the event title and the textarea for the event description and clean them
		$dialogContent.find("input").val("");
		$dialogContent.find("textarea").val("");
		
		// initialize an event counter, which holds the number of all events of the selected day
		var eventCounter = 0;
		
		// get the handle to the clicked cell (in order to be able to address the new event to the appropriate day)
		var selectedDay = $(dayCell);
		
		// get the "rel" value to adress the cell
		var dayID = $(selectedDay).attr('rel');
		
		// get all block elements from class "event" in the current dayCell and count them; this is value of the eventCounter
		eventCounter = $(selectedDay).find('.event').length;
		
		var selectTimes = getTimeslots();
		
		// clean up the time selector fields (reset)
		var startField = $dialogContent.find("select[name='start']").empty('');
        var endField = $dialogContent.find("select[name='end']").empty('');
		
		// fill in the dropdown boxes with time selection entries
        var startField = $dialogContent.find("select[name='start']").append(selectTimes);
        var endField = $dialogContent.find("select[name='end']").append(selectTimes);
		
		// work with local variables (it's shorter than the search type)
        var titleField = $dialogContent.find("input[name='title']");
        var descriptionField = $dialogContent.find("textarea[name='description']");
		
		// initialize the event data with empty values
		var eventStartDate = '';
		var eventEndDate = '';
		var eventTitle = 'Test';
		var eventDescription = 'Blub';
		
		// use a jquery function to convert the input form into a modal dialog
        $dialogContent.dialog({
            modal: true,
            title: "Add new Event",
			// when the dialog is closed, it has to be destroyed and hidden again
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
            },
			// add some buttons to the dialog
            buttons: {
			
				// what should happen with the entered form data
				save : function() {
				
					// only proceed if all fields contain values
					if (startField.val() && endField.val() && titleField.val() && descriptionField.val()) {
						
						// get the data input from the form and store it in the event data variables
						eventStartDate = startField.val();
						eventEndDate = endField.val();
						eventTitle = titleField.val();
						eventDescription = descriptionField.val();
						
						// add a new event block to the events container of the clicked dayCell
						$(dayCell).find(".events").append('<div class="event" id="'+ dayID + '_' + eventCounter + '"><div class="eventTitle">' + eventStartDate + ' - ' + eventEndDate + ': ' + eventTitle + '</div><div class="eventDescription">' + eventDescription + '</div></div>');
						
						// increase the eventCounter
						eventCounter++;
					}				

					// after processing/storing the data, call the "close" function to close the dialog
					$dialogContent.dialog("close");
				},
				
				// when the user cancels the input, just close the dialog and do nothing
				cancel : function() {
					$dialogContent.dialog("close");
				}
            }
        }).show();

		// displays the date of the selected dayCell as an header in the dialog
        $dialogContent.find(".date_holder").text(dayID);
    }
	
	
	function getTimeslots() {
        var startTime = 8;
		var endTime = 18;
		
		var options = '';
		
		options += '<option value="">Select Time</option>';
		
		for (var i = startTime; i <= endTime; i++) {
			options += '<option value="';
			if (i < 10) {
				options += '0';
			}
			options += i+':00">';
			if (i < 10) {
				options += '0';
			}
			options += i+':00</option>';
		}
		
		return options;		
    }
	
	function formatDate(date, format) {
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
	
	// event handler for clicking on a valid dayCell (to display the event dialog popup)
	$(".dayCell").click(function() {
		createEvent($(this));
    });
});