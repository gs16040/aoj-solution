function format(date){
	return date.getFullYear()+'/'+('0'+(date.getMonth()+1)).slice(-2)+'/'+('0'+date.getDate()).slice(-2)+ ' ' + ('0' + date.getHours()).slice(-2)+ ':' + ('0' + date.getMinutes()).slice(-2)+':'+('0' + date.getSeconds()).slice(-2);	
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

jQuery(($)=>{
	$("#foo-table").DataTable({
		order:[[0,"desc"]],
		lengthMenu:[[20,50,100,-1],[20,50,100,"All"]],
		columnDefs:[
			{targets:0,render:(data,type,row,meta)=>(type==="sort"||type==="type")?data:format(data)},
			{targets:1,render:(data,type,row,meta)=>(type==='display')?'<a href="https://onlinejudge.u-aizu.ac.jp/status/users/'+data+'" target="_blank">'+data+'</a> (<a href="http://judge.u-aizu.ac.jp/onlinejudge/user.jsp?id='+data+'#1" target="_blank">v1</a>)':data},
			{targets:2,render:(data,type,row,meta)=>(type==='display')?'<a href="https://onlinejudge.u-aizu.ac.jp/problems/'+data+'" target="_blank">'+data+'</a> (<a href="http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id='+data+'&lang=ja" target="_blank">v1</a>)':data}
		]
	});
});

window.onload = function () {
	var parameters = getUrlVars();
	var userIDs = (parameters['user'] !== undefined ? parameters['user'].split('+') : []);
	userIDs.forEach(userID => {
		var request = new XMLHttpRequest();
		request.open("GET","https://judgeapi.u-aizu.ac.jp/solutions/users/" + userID + "?page=0&size=999999999");
		request.addEventListener("load",function (event) {
			var solutions = JSON.parse(event.target.responseText).map(solution => {
				var date = new Date(solution.submissionDate);
				var userId = solution.userId;
				var problemId = solution.problemId;
				var language = solution.language;
				return [date, userId, problemId, language];
			});
			$("#foo-table").dataTable().fnAddData(solutions);
		});
		request.withCredentials = true;
		request.send();
	});
}
