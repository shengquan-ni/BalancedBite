package edu.uci.ics.balancedbite.web.api;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class TimeManager {
	
	private static TimeManager timeManager = null;
	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
	
	private TimeManager() { }
	
	public static TimeManager getInstance() {
		if (timeManager == null) {
			timeManager = new TimeManager();
		}
		
		return timeManager;
	}
	
	public SimpleDateFormat getDateFormat() {
		return dateFormat;
	}
	
	public boolean checkSameDay(Date day1, Date day2) {
		Calendar calendar1 = Calendar.getInstance();
		Calendar calendar2 = Calendar.getInstance();
		
		calendar1.setTime(day1);
		calendar2.setTime(day2);
		
		return calendar1.get(Calendar.DAY_OF_YEAR) == calendar2.get(Calendar.DAY_OF_YEAR)
				&& calendar1.get(Calendar.YEAR) == calendar2.get(Calendar.YEAR);
	}
}
