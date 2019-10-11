function timestampToString(date){
	return date.getFullYear()+'/'+('0'+(date.getMonth()+1)).slice(-2)+'/'+('0'+date.getDate()).slice(-2)+ ' ' + ('0' + date.getHours()).slice(-2)+ ':' + ('0' + date.getMinutes()).slice(-2)+':'+('0' + date.getSeconds()).slice(-2);	
}

function makeTable(data, tableId){
	var rows = [];
	var table = document.createElement("table");
	for (var i = 0; i < data.length; i++){
		rows.push(table.insertRow(-1));
		var date = timestampToString(new Date(data[i]['submissionDate']));
		var userId = data[i]['userId'];
		var problemId = data[i]['problemId'];
		var newCell = function(){
			var cell = rows[i].insertCell(-1);
			cell.style.backgroundColor = (i % 2 === 0 ? "#ffffff" : "#dddddd");
			cell.style.textAlign = "center";
			return cell;
		}
		var newATag = function(ref,txt){
			var aTag = document.createElement("a");
			aTag.href = ref;
			aTag.target = "_blank";
			aTag.appendChild(document.createTextNode(txt));
			return aTag;
		}
		newCell().appendChild(document.createTextNode(date));
		newCell().appendChild(newATag("https://onlinejudge.u-aizu.ac.jp/status/users/"+userId,userId));
		newCell().appendChild(newATag("https://onlinejudge.u-aizu.ac.jp/problems/"+problemId,problemId));
	}
	document.getElementById(tableId).appendChild(table);
}

function getUrlVars(){
	var vars = {};
	var param = location.search.substring(1).split('&');
	for (var i = 0; i < param.length; i++) {
		var keySearch = param[i].search(/=/);
		var key = '';
		if(keySearch !== -1){key = param[i].slice(0, keySearch);}
		var val = param[i].slice(param[i].indexOf('=', 0) + 1);
		if(key !== ''){vars[key] = decodeURI(val);}
	}
	return vars;
}

window.onload = function () {
	var parameters = getUrlVars();
	var userIDs = (parameters['user'] !== undefined ? parameters['user'].split('+') : []);
	var solutions = [];
	var count = userIDs.length;
	var percent = document.getElementById('percent');
	var percentText = document.getElementById('percent-text'); percentText.innerHTML = 0;
	userIDs.forEach(userID => {
		var request = new XMLHttpRequest();
		request.open("GET","https://judgeapi.u-aizu.ac.jp/solutions/users/" + userID + "?page=0&size=999999999");
		request.addEventListener("load",function (event) {
			solutions = solutions.concat(JSON.parse(event.target.responseText));
			percentText.innerHTML = Math.floor(100 * (userIDs.length - count - 1)/userIDs.length);
			if (0 === --count) {
				percent.style.display = 'none';
				solutions.sort((a,b)=>(b.judgeDate-a.judgeDate));
				makeTable(solutions, "table");
			}
		});
		request.withCredentials = true;
		request.send();
	});
}
