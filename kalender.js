/*
###
# kalender.js
# Little javascript based calendar which is supposed to be a date-selector on
# websites.
#
# (c) 2007 by K. Ahlers
#
# This program is free software; you can redistribute it and/or modify it under 
# the terms of the GNU General Public License as published by the Free Software 
# Foundation; either version 2 of the License, or (at your option) any later 
# version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT 
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
# FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License along with 
# this program; if not, write to the Free Software Foundation, Inc., 
# 51 Franklin St, Fifth Floor, Boston, MA 02110, USA 
###
*/

// Function to receive maximum day number in a month
function MaxDateOfMonth(Monat, Jahr) {
	var Stop = 31;
	if(Monat==4 ||Monat==6 || Monat==9 || Monat==11 ) --Stop;
	if(Monat==2) {
		Stop = Stop - 3;
		if(Jahr%4==0) Stop++;
		if(Jahr%100==0) Stop--;
		if(Jahr%400==0) Stop++;
	}
	return Stop;
}

// Function to get the current date and show the calendar matching to that month
function ShowCurrentCalendar(htmlelement, functionday) {
	var now = new Date();
	var month = now.getMonth() + 1;
	var year = now.getFullYear();
	ShowCalendar(htmlelement, month, year, functionday);
}

function GenerateHeaderRow() {
	var str = "<tr><td class=\"kal-weekhead\">Woche</td>"+
			"<td class=\"kal-head\">Mo</td>"+
               "<td class=\"kal-head\">Di</td>"+
               "<td class=\"kal-head\">Mi</td>"+
               "<td class=\"kal-head\">Do</td>"+
               "<td class=\"kal-head\">Fr</td>"+
               "<td class=\"kal-head\">Sa</td>"+
               "<td class=\"kal-head\">So</td></tr>";
	return str;
}

function GenerateYearOptions(year) {
	year = parseInt(year);
	var str = "";
	var select = "";
	for(var i = year - 3; i <= year + 3; i++) {
		if(i == year) {
			select = " selected";
		} else {
			select = "";
		}
		str += "<option"+select+" value=\""+i+"\">"+i+"</option>";
	}
	return str;
}

function GenerateMonthOptions(month, Monat) {
	var str = "";
	var select = "";
	for(var i = 0; i < Monat.length; i++) {
		if(i == month) {
			select = " selected";
		} else {
		     select = "";
		}
		str += "<option"+select+" value=\""+(i+1)+"\">"+Monat[i]+"</option>";
	}
	return str;
}

// Funktion zur Wochen-Nummer-Ermittelung nach DIN 1355
function getWeek(year, month, day)
{
	// Den 1. Jan. year 0:00:00 als Timestamp und Datum ermitteln
	var first_date = new Date(year, 0, 1, 0, 0, 0);
	var first_stamp = Date.UTC(year, 0, 1, 0, 0, 0);

	// Den 31. Dez. year 0:00:00 als Datum ermitteln
	var last_date = new Date(year, 11, 31, 0, 0, 0);

	// Das übergebene Datum 0:00:00 als Timestamp und Datum ermitteln
	var now_date = new Date(year, month, day, 0, 0, 0);
	var now_stamp = Date.UTC(year, month, day, 0, 0, 0);

	// Den Wochentag des 1. Jan. year als Korrekturzeit nehmen
	var korrektur = first_date.getDay();
	if(korrektur <= 4) { // Die ersten Tage gehören zu Woche 1
		korrektur += 3; // Dafür sorgen, dass die Formel bei der ersten Woche 1 ergibt
	} else {             // Die ersten Tage gehören zu Woche 0
		korrektur -= 4; // Dafür sorgen, dass die Formel bei der ersten Woche 0 ergibt
	}

	// Wochennummer berechnen
	var woche = Math.round(((now_date - first_date) / 86400000 + korrektur) / 7);

	// Wenn Woche als 53 beziffert wird, aber weder 1. Jan. noch 31. Dez. Donnerstage
	// sind, ist die Woche nicht 53 sondern 1 (DIN 1355, 1.3.4 Anm. 2)
	if((woche > 52) && ((first_date.getDay() != 4) && (last_date.getDay() != 4))) {
		woche = 1;
	}

	// Wenn die Woche als 0 beziffert wird, gehören die Tage zur letzten Woche des
	// vorigen Jahres. (DIN 1355, 1.3.4 Anm. 1)
	if(woche == 0) {
		woche = getWeek(year - 1, 11, 31);
	}

	return woche;
}

// Generates and displays the calendar to the passed element.
function ShowCalendar(htmlelement, month, year, functionday) {

	month = parseInt(month);
	year = parseInt(year);

	var o = document.getElementById(htmlelement);
	var str = "";
	var Monat = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni",
	                      "Juli", "August", "September", "Oktober", "November", "Dezember");
	o.innerHTML = "";
	month--;

	var firstofmonth = new Date(year, month, 1);
	var firstweekday = firstofmonth.getDay();
	var lastofmonth = MaxDateOfMonth(month+1, year);
	var temp = new Date();
	var today = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());

	var lnk_prev_month = month;
	var lnk_prev_year = year;
	
	var lnk_post_month = month + 2;
	var lnk_post_year = year;

	if(lnk_prev_month == 0) {
		lnk_prev_month = 12;
		lnk_prev_year = year - 1;
	}

	if(lnk_post_month == 13) {
		lnk_post_month = 1;
		lnk_post_year = year + 1;
	}
	
	str += "<table width=\"100%\" height=\"100%\" cellspacing=0 border=0>";
	str += "<tr><td class=\"kal-header-lnk\" onclick=\"ShowCalendar('"+htmlelement+"', "+lnk_prev_month+", "+lnk_prev_year+", '"+functionday+"');\"><img src=\"back.png\" /></td>"
	str += "<td colspan=6 class=\"kal-header\">"
	var onclickchoose = "onchange=\"ShowCalendar('"+htmlelement+"', document.getElementById('monthchoose').value, document.getElementById('yearchoose').value, '"+functionday+"');\"";
	str += "<select class=\"choose\" id=\"monthchoose\" "+onclickchoose+">"+GenerateMonthOptions(month, Monat)+"</select>";
	str += "<select class=\"choose\" id=\"yearchoose\" "+onclickchoose+">"+GenerateYearOptions(year)+"</select>";
	str += "</td>";
	str += "<td class=\"kal-header-lnk\" onclick=\"ShowCalendar('"+htmlelement+"', "+lnk_post_month+", "+lnk_post_year+", '"+functionday+"');\"><img src=\"fwd.png\" /></td></tr>";
	str += GenerateHeaderRow();

	var actualweek = getWeek(year, month, 1);

	str += "<tr>";
	str += "<td class=\"kal-week\">"+actualweek+"</td>";
	var fill = firstweekday - 1;
	if(fill < 0) {
		fill += 7;
	}
	for(var i = 0; i < fill; i++) {
		str += "<td>&nbsp;</td>";
	}
	
	var now = firstofmonth.getDate();
	var weeklines = 0;
	while(now <= lastofmonth) {
		var nowdate = new Date(year, month, now);
		var onmouseover = "onmouseover=\"KALOnMouseOver('"+htmlelement+"cell"+now+"');\"";
		var onmouseout = "onmouseout=\"KALOnMouseOut('"+htmlelement+"cell"+now+"');\"";
		if((nowdate.getFullYear() == today.getFullYear()) && (nowdate.getMonth() == today.getMonth()) && (nowdate.getDate() == today.getDate())) {
			str += "<td id=\""+htmlelement+"cell"+now+"\" class=\"kal-today\" onclick=\""+functionday+"("+year+", "+(month+1)+", "+now+");\" "+onmouseover+" "+onmouseout+" title=\"Heute\">"+now+"</td>";
		}
		else if((nowdate.getDay() == 6) || (nowdate.getDay() == 0)) {
			str += "<td id=\""+htmlelement+"cell"+now+"\" class=\"kal-weday\" onclick=\""+functionday+"("+year+", "+(month+1)+", "+now+");\" "+onmouseover+" "+onmouseout+">"+now+"</td>";
		} else {
			str += "<td id=\""+htmlelement+"cell"+now+"\" class=\"kal-day\" onclick=\""+functionday+"("+year+", "+(month+1)+", "+now+");\" "+onmouseover+" "+onmouseout+">"+now+"</td>";
		}
		if(nowdate.getDay() == 0) {
			str += "</tr><tr>";
			if((now) < lastofmonth) {
				actualweek = getWeek(year, month, now + 1);
				str += "<td class=\"kal-week\">"+actualweek+"</td>";
				weeklines++;

			}
		}
		now++;
	}
	
	if(weeklines < 5) {
		str += "</tr><tr><td colspan=7>&nbsp;</td>";
	}

	str += "</tr>";

	// Aktuelles Datum anzeigen
	str += "<tr><td colspan=8 class=\"today\" onclick=\"ShowCalendar('"+htmlelement+"', "+(today.getMonth()+1)+", "+today.getFullYear()+", '"+functionday+"');\">";
	str += "Heute: "+today.getDate()+". "+Monat[today.getMonth()]+" "+today.getFullYear();
	str += "</td><tr>";

	str += "</table>";
	o.innerHTML = str;
}

function KALOnMouseOver(cell) {
	var ce = document.getElementById(cell);
	ce.style.background = "#cdedff";
}

function KALOnMouseOut(cell) {
	var ce = document.getElementById(cell);
	ce.style.background = "#ffffff";
}


// Beispielfunktion für das OnClick-Event
function DayClick(year, month, day) {
	alert(day+"."+month+"."+year);
}
