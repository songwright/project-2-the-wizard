let saved = []
let wizardForm = $("form.wizard");
let question = $("input#question");
let api_url = "https://api.wolframalpha.com/v2/query";
let key = "TJ4K3V-R45R9RUY6V";
let counter= 0;
let savedId = [];

$(document).ready(function() {
  	$.get("/api/user_data").then(function(data) {
    	$(".member-name").text(data.email);
  	});
  	getHistory();
});

function getHistory() {
	$("#lists").empty();
	$.ajax({
  		method: "GET",
  		url: "/api/queries"
  	}).then(data => {
		data.forEach(function(item,index) {
	  		saved.push({question:item.question,answer:item.answer});
	  		save(item.question,item.id);
		});
	});
};

wizardForm.on("submit", function(event) { 
	let input = question.val().trim();
	event.preventDefault();
	$.ajax({
    	url: api_url + "?appid=" + key + " &input=" + input +"&output=json",
    	contentType: "text/plain",
    	dataType: 'jsonp',
    	success: function(result){
    		$.get("/api/user_data").then(function(data) {
				login_id = data.id;
			});
    		$('#answer').empty();
    		let res = result.queryresult.pods[0].subpods[0].plaintext;
    		if (res.indexOf("|") > 0) {
    			res = result.queryresult.pods[1].subpods[0].plaintext;
    		}
    		saved.push({question:input,answer:res})
    		upload(input,res,login_id);
    		x = counter + 1;
    		$('#answer').append("The answer is: "+res);
    	}
    })
});

function upload(question,answer,id){
	$.post("/api/queries", {
		question: question,
		answer: answer,
		id: id
	}).then(function(data) {
		savedId.push(data);
		save(data.question,data.id)
	});
}

function save(question,questionId){
	let length = 20;
	let listItem = $("<li>").attr("class","list-group-item bg-light");
	if (question.length > length) {
		let button = $("<button>").attr("class","btn btn-light").attr("id",counter).text(question.substring(0, length));
		listItem.append(button);
	} 
	else {
		let button = $("<button>").attr("class","btn btn-light").attr("id",counter).text(question);
		listItem.append(button);
	}
	let dltButton = $("<button>").attr("id",questionId).attr("class","delete").html(`<i class="fas fa-trash-alt"></i>`);
	listItem.append(dltButton);
	$("#lists").prepend(listItem);
	counter++;
};
$(document).on("click",'#lists .btn-light',function(){
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
	saved.splice(bId,1);
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
