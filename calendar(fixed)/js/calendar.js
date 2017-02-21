var oMon = document.getElementById("cal-mon");
var oYear = document.getElementById("cal-year");
var mons = document.getElementById("cal-more-mons");
var years = document.getElementById("cal-more-years");
var calChoice = document.getElementById("cal-choice");
var calBody = document.getElementsByClassName("cal-body")[0];
var room = document.getElementsByTagName("td");
var calLast = document.getElementById("cal-last");
var calNext = document.getElementById("cal-next");
var calToday = document.getElementById("cal-today");
var oBody = document.getElementsByTagName("body")[0];

////////////////////////添加事件处理程序////////////////////////

var now = new Date(); 
var nowDate = now.getDate();

updateCal(now);

//选择月份,年份
mons.onclick = function(e){
	if (document.getElementById("cal-years")) {		//不同时显示年份月份选项
		showYears();
	};
	showMons(e);
};
years.onclick = function(e){
	if (document.getElementById("cal-mons")) {	
		showMons();
	};
	showYears(e);
}

//切换相邻月份
calLast.onclick = function(){
	now.setMonth(now.getMonth() - 1);
	updateCal(now);
};
calNext.onclick = function(){
	now.setMonth(now.getMonth() + 1);
	updateCal(now);
};
calToday.onclick = function(){
	now = new Date();
	updateCal(now);
}

//隐藏选项
oBody.onclick = function(event){
	event = event ? event : window.event;
	var aim = function(event){
		return event.target.id || event.srcElement.id;
	};
	if (document.getElementById("cal-mons")) {	
	//if（选项存在），点击页面除三角按钮外任何位置均隐藏选项（三角按钮的点击通过stopPropagation()方法排除影响）
		showMons();		
	};
	if (document.getElementById("cal-years") && aim != "cal-left" && aim != "cal-right") {	
	//if（选项存在&&不是左箭头&&不是右箭头）
		showYears();
	};
};

//////////////函数/////////////////

//更新日历
function updateCal(now){
	var nowYear = now.getFullYear();
	var nowMon = now.getMonth();
	//转换英文月份
	function EngMon(month){
		switch(month){
			case 0: return "January"; break;
			case 1: return "February"; break;
			case 2: return "March"; break;
			case 3: return "April"; break;
			case 4: return "May"; break;
			case 5: return "June"; break;
			case 6: return "July"; break;
			case 7: return "August"; break;
			case 8: return "September"; break;
			case 9: return "October"; break;
			case 10: return "November"; break;
			case 11: return "December"; break;
		}
	}
	//写入当前年月
	oMon.innerHTML = EngMon(nowMon);
	oYear.innerHTML = nowYear;
	//本月第一天周几
	now.setDate(1);
	var firstDay = (now.getDay() == 0) ? 7 : now.getDay();	//now.getDay()周日返回0
	//月天数
	function isLeapYear(year){
		//判断闰年条件：非整百年数除以4，无余为闰，有余为平;整百年数除以400，无余为闰有余平。
		if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
			return true;
		} else{
			return false;
		};
	};
	function allDays(year,month){
		switch(month){
			case 0: return "31"; break;
			case 2: return "31"; break;
			case 3: return "30"; break;
			case 4: return "31"; break;
			case 5: return "30"; break;
			case 6: return "31"; break;
			case 7: return "31"; break;
			case 8: return "30"; break;
			case 9: return "31"; break;
			case 10: return "30"; break;
			case 11: return "31"; break;
			default: if (isLeapYear(year)) {
				return "29";	//闰年2月
			} else{
				return "28";	//平年2月
			}
		}
	};
	//清除日期（需要清除数字从有到无的格子）
	for (var i = 0; i <= room.length - 1; i++) {
		room[i].innerHTML = "";	
		room[i].removeAttribute("class");
	};
	//写入日期
	for (var i = 1; i <= allDays(nowYear,nowMon); i++) {
		room[firstDay - 1].innerHTML = i;	//第一天的周数减1为前面的空格数
		if (i == nowDate) {	
			room[firstDay - 1].setAttribute("class","cal-show");	//高亮显示今日
		};
		firstDay++;		//天数对应格子数加1
	};
};

//显示隐藏月份
function showMons(e){
	if (!document.getElementById("cal-mons")) {
		//显示
		var calMons = document.createElement("div");
		calMons.setAttribute("id","cal-mons");
		var monNum = "";
		for (var i = 1; i <= 12; i++) {
			monNum += "<span>" + i + "</span>";		//写入12个月
		};
		calMons.innerHTML = monNum;
		calChoice.appendChild(calMons);
		monsList = calMons.getElementsByTagName("span");
		monsList[now.getMonth()].setAttribute("class","cal-show")	//当前月高亮
		calMons.onclick = chooseMon;
		/*点击三角型冒泡到容器，或者直接点击容器后触发函数显示选项，
		然后stopPropagation()方法可取消冒泡或捕获，不会再同时冒泡到body触发函数导致立即隐藏*/
		e.stopPropagation();	
	} else{
		//隐藏
		calChoice.removeChild(calChoice.lastChild);
	};
}
function chooseMon(e){
	e = e ? e : window.e;
	var target = e.target || e.srcElement;
	now.setMonth(target.firstChild.nodeValue - 1);  //设置月份，从0开始索引值对应月份
	updateCal(now);		//更新显示
	showMons(e);			//隐藏选项
}

//显示选择年份
function showYears(e){
	if (!document.getElementById("cal-years")) {	
		//不存在时添加
		var calYears = document.createElement("div");
		calYears.setAttribute("id","cal-years");
		var yearNum = "<span id='cal-left'>&lt</span>";	//添加左箭头
		for (var i = 1; i <= 5; i++) {					//添加年份
			var whichYear = now.getFullYear() + i - 3;	//通过与当前年份关系换算相邻年份
			yearNum += "<span>" + whichYear +"</span>"; 
		};
		yearNum += "<span id='cal-right'>&gt</span>"; 	//添加右箭头
		calYears.innerHTML = yearNum;
		calChoice.appendChild(calYears);
		yearsList = calYears.getElementsByTagName("span");
		yearsList[3].setAttribute("class","cal-show-year");	//中间年份（今年）高亮
		calYears.onclick = chooseYear;
		e.stopPropagation();	//停止冒泡
	} else{
		//存在时隐藏
		calChoice.removeChild(calChoice.lastChild);
	}
}
function chooseYear(e){
	e = e ? e : window.e;
	var target = e.target || e.srcElement;
	if (target.id == "cal-left") {						//点击左箭头
		now.setFullYear(now.getFullYear() - 5);				//中间年份减5
		showYears(e);										//移除旧选项
	} else if (target.id == "cal-right") {				//点击右箭头
		now.setFullYear(now.getFullYear() + 5);
		showYears(e);										//移除旧选项
	} else{													//点击年份
		now.setFullYear(target.firstChild.nodeValue);  		//通过文本值设置年份
	};
	showYears(e);	//当点击左右箭头时，为再次调用函数添加选项；当点击选项时，为调用函数移除选项
	updateCal(now);										//更新年份
};


