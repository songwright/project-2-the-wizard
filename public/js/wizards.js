let saved = []
let wizardForm = $("form.wizard");
let question = $("#question");
let submit = $("#submit");
let api_url = "https://api.wolframalpha.com/v2/query";
let key = "TJ4K3V-R45R9RUY6V";
let counter= 0;
let savedId = [];
let login_id;
$(document).ready(function() {
  	$.get("/api/user_data").then(function(data) {
    	$(".member-name").text(data.email);
  	});
  	getHistory();
});

function getHistory() {
	counter = 0;
	$("#lists").empty();
	saved = [];
	$.ajax({
  		method: "GET",
  		url: "/api/queries"
  	}).then(data => {
  		console.log(data.length);
		data.forEach(function(item,index) {
	  		saved.push({question:item.question,answer:item.answer});
	  		save(item.question,item.id);
		});
	});
};

$(document).on("click", '#submit', function(event) {
	console.log(question); 
	let input = question.val().trim();
	event.preventDefault();
	$.ajax({
    	url: api_url + "?appid=" + key + "&input=" + input +"&output=json",
    	contentType: "text/plain",
    	dataType: 'jsonp',
    	success: function(result){
    		console.log(result.queryresult.pods[0].subpods[0].plaintext);
    		console.log(result.queryresult.pods[1].subpods[0].plaintext);
    		$.get("/api/user_data").then(function(data) {
				login_id = data.id;
				console.log(login_id);
			});
    		$('#answer').empty();
    		let res = result.queryresult.pods[0].subpods[0].plaintext;
    		if (res.indexOf("|") > 0 || res.indexOf("English word") > 0) {
    			res = result.queryresult.pods[1].subpods[0].plaintext;
    		}
    		saved.push({question:input,answer:res})
    		upload(input,res);
    		x = counter + 1;
    		$('#answer').append("The answer is: "+res);
    	}
    })
});

function upload(question,answer,id){
	$.post("/api/queries", {
		question: question,
		answer: answer,
	}).then(function(data) {
		savedId.push(data);
		save(data.question,data.id)
		console.log(data)
		console.log(saved);
	});
}

function save(question,questionId){
	console.log("running");
	let length = 30;
	let listItem;
	if (question.length > length) {
		listItem = $("<a>").attr("class","list-item has-background-light").attr("id",counter).attr("style","font-size: 20px;").text(question.substring(0, length));
	} 
	else {
		listItem = $("<a>").attr("class","list-item has-background-light").attr("id",counter).attr("style","font-size: 20px;").text(question);
	}
	let dltButton = $("<button>").attr("id",questionId).attr("class","delete").attr("style","float: right").html(`<i class="fas fa-trash-alt"></i>`);
	listItem.append(dltButton);
	$("#lists").prepend(listItem);
	counter++;
};
$(document).on("click",'a',function(){
	console.log("clicked list item");
    let x = $(this)[0].id;
    $("#answer").empty();
    let savedAnswer = saved[x].answer;
    $('#answer').append("<br>The answer was: "+savedAnswer);
    let savedQuestion = saved[x].question;
    $('#answer').prepend("The Question you asked was : "+savedQuestion);
    console.log(saved[x].answer);
    console.log(saved[x].question);
});

$(document).on("click",'.delete', function(){
	let id = $(this).attr('id');
	let bId = $(this)[0].parentNode.firstElementChild.id;
	console.log(bId);
	console.log(saved);
	saved.splice(bId,1);
	console.log(saved);
	$.ajax({
  		method: "DELETE",
  		url: "/api/queries/"+id,
	}).then(function() {
		getHistory();
	});
});

$(document).on("click",'#deleteAll', function(){
	$.ajax({
  		method: "DELETE",
  		url: "/api/queries",
	}).then(function() {
		getHistory();
	});
});