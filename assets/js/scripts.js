window.onload = function() {
    "use strict";
    var d = new Date(),
        y = "&copy; " + d.getFullYear() + " KleveRaft - A Lifestyle and Concept Store. Powered by <a href='http://www.quisi.net'>quisi.net</a>";
    $('.footer-details').html(y);
};


//var baselocation = "http://localhost/kleveraft/app";
var baselocation = "https://www.kleveraft.com/app";

function validateNumber(event) {
    "use strict";
    var regex = new RegExp('^[0-9\-\.\b]+$'),
        key = String.fromCharCode(!event.charCode ? event.which : event.charCode),
        charCode = event.which;
    
    if (charCode === 0) {
        return;
    } else if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

function validateContact(event) {
    "use strict";
    var regex = new RegExp('[0-9\-\(\)\+\b]+$'),
        key = String.fromCharCode(!event.charCode ? event.which : event.charCode),
        charCode = event.which;
    
    if (charCode === 0) {
        return;
    } else if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

//date mm/dd/yyyy
function getdate() {
    "use strict";
	var newdate = new Date(),
        y = newdate.getFullYear().toString(),
        m = (newdate.getMonth() + 1),
        d = newdate.getDate(),
        fulldate;
        

    if (m < 10) {
        m = '0' + m;
    }
	m = m.toString();
	if (d < 10) {
        d = '0' + d;
    }
    d = d.toString();
    
    fulldate = m + '/' + d + '/' + y;
    
	return fulldate;
}

//full date yymdHis
function getFulldate() {
    "use strict";
	var newdate = new Date(),
        y = newdate.getFullYear().toString().substring(2),
        m = (newdate.getMonth() + 1).toString(),
        d = newdate.getDate().toString(),
        hour = newdate.getHours().toString(),
        min = newdate.getMinutes().toString(),
        sec = newdate.getSeconds().toString(),
        fulldate = y + m + d + hour + min + sec;

	return fulldate;
}

function getYmdate() {
    "use strict";
    var newdate = new Date(),
        y = newdate.getFullYear().toString(),
        m = newdate.getMonth() + 1,
        d = newdate.getDate(),
        datenow;
	
	if (m < 10) {
        m = '0' + m;
    }
	m = m.toString();
	if (d < 10) {
        d = '0' + d;
    }
	d = d.toString();
	
    datenow = y + m + d;

	return datenow;
}

//timestamp yyyy-mm-dd H:i:s
function timeStamp() {
    "use strict";
    var newdate = new Date(),
        y = newdate.getFullYear().toString(),
        m = newdate.getMonth() + 1,
        d = newdate.getDate(),
        hour = newdate.getHours().toString(),
        min = newdate.getMinutes().toString(),
        sec = newdate.getSeconds().toString(),
        timestamp;
	
	if (m < 10) {
        m = '0' + m;
    }
	m = m.toString();
	if (d < 10) {
        d = '0' + d;
    }
	d = d.toString();
	
    timestamp = y + '-' + m + '-' + d + ' ' + hour + ':' + min + ':' + sec;

	return timestamp;
}

//custom loading - start
function prepage() {
    "use strict";
	document.getElementById("page-load").style.display = "block";
	document.getElementById("container").style.display = "none";
}

//custom loading - end
function loadpage() {
    "use strict";
    document.getElementById("page-load").style.display = "none";
    document.getElementById("container").style.display = "block";
}

//check File Size
function CheckFileSize(file) {
    "use strict";
	var uploadedFile = document.getElementById(file),
        fileSize = uploadedFile.files[0].size;
    return fileSize;
}

//check File Type (Image)
function CheckImgFileType(file) {
    "use strict";
	var e = $("#" + file).val(),
		a = (e.substring(e.lastIndexOf(".") + 1)).toLowerCase();
		
    return "gif" === a || "jpeg" === a || "jpg" === a || "png" === a || "bmp" === a ? !0 : !1;
}

//check File Type - Video
function CheckVideo(file) {
	"use strict";
	var e = $("#" + file).val(),
		a = (e.substring(e.lastIndexOf(".") + 1)).toLowerCase();
	return "mp4" === a || "webm" === a ? !0 : !1;
}

//check if Empty
function isEmpty(obj) {
    "use strict";
    var prop;
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return true;
}

//get QueryString Parameters 
function GetQueryStringParams(e) {
    "use strict";
    var t = window.location.search.substring(1),
        n = t.split("&"),
        r,
        i;
    
    for (r = 0; r < n.length; r++) {
        i = n[r].split("=");
        if (i[0] === e) {
            return i[1];
        }
    }
}

//custom alert message
function loadCustomAlert(msg, direction, color) {
    "use strict";
	$("#custom-message").text(msg);
	$("#custom-message").css("color", color);
	setTimeout(function () {
		document.getElementById("custom-alert").style.display = "block";
		document.getElementById("container").style.display = "none";
		setTimeout(function () {
			window.location = direction;
		}, 2500);
	}, 500);
}

function moneytrim(obj) {
    "use strict";
    var trim_obj = obj.trim();
    trim_obj = trim_obj.split(',').join('');
    return trim_obj;
}

Number.prototype.formatMoney = function (c, d, t) {
    "use strict";
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d === undefined ? "." : d,
        t = t === undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};