var fileToGet;
var tasks = {};
var userIP="";
var newCanvas;
var waitTime=100;
function preload(){
	fileToGet=loadTable("yes.txt","CSV");
}
function setup(){
	newCanvas = createCanvas(window.windowWidth,window.windowHeight);
	background(255);
	for(var i=0;i<fileToGet.rows[0].arr.length;i++){
		tasks[fileToGet.rows[0].arr[i]]=[];
	}
}
function draw(){
	if(frameCount%20===0){
		$.getJSON('//api.ipify.org?format=jsonp&callback=?', function(data) {
			userIP=data.ip;
		});
		document.getElementById("myTitle").innerHTML="Task Manager for "+userIP;
	}
	if(frameCount%waitTime===0){
		fileToGet=loadTable("yes.txt","CSV");
	}
	tasks={};
	if(fileToGet.rows[0]!==undefined){
		for(var i=0;i<fileToGet.rows[0].arr.length;i++){
			tasks[fileToGet.rows[0].arr[i]]=[];
		}
		/*
		tasks["Image Name"]=[];
		tasks["PID"]=[];
		tasks["Session Name"]=[];
		tasks["Session#"]=[];
		tasks["Mem Usage"]=[];
		*/
		for(var i = 1;i<fileToGet.getRowCount();i++){
			var row=fileToGet.getRow(i).arr;
			for(var j = 0;j<row.length;j++){
				var ImageName=row[j];
				tasks[fileToGet.getRow(0).arr[j]].push(ImageName);
			}
		}
		background(255);
		var cc=0;
		for(var h in tasks){
			cc++;
		}
		if(width>(10+(cc*300))){
			newCanvas.size(window.windowWidth,20+(tasks["Image Name"].length*20));
		}else{
			newCanvas.size(10+(cc*300),20+(tasks["Image Name"].length*20));
		}
		var counter=0;
		for(var h in tasks){
			fill(0);
			text(h,10+(counter*(window.windowWidth/cc)),20);
			for(var i=0;i<tasks[h].length;i++){
				text(tasks[h][i],10+(counter*(window.windowWidth/cc)),40+(i*20));
			}
			counter++;
		}
	}
}