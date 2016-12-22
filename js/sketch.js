var imgWidth=0;
var imgHeight=0;
var shiftKey = "";
var backKey = "";
var img1;
var shifted=false;
var shiftY=-100;
var sellCheck=false;
var sellingDisp='';
var keysDown=[];
var keyDown=[];
var l=0;
var u=0;
var d=0;
var r=0;
var m=0;
var mousepush=false;
var mousepush2=false;
var charList=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"," "];
var newString='';
function keyPressed(){
    if(event.code!=="ShiftLeft"&&event.code!=="ShiftRight"){
	keysDown[keyCode]=true;
	keysDown["."+key.toLowerCase()]=true;
	keysDown[key.toString().toLowerCase()]=true;
    }
	if(event.code=="Enter"){
	    keysDown[".enterKey"]=true;
	}
	if(event.code=="ShiftLeft"||event.code=="ShiftRight"){
	    shifted=true;
	}
}
function keyReleased(){
    if(event.code!=="ShiftLeft"&&event.code!=="ShiftRight"){
	keysDown[keyCode]=false;
	keysDown["."+key.toLowerCase()]=false;
	keysDown[key.toLowerCase()]=false;
	keyDown[keyCode]=false;
	keyDown["."+key.toLowerCase()]=false;
	keyDown[key.toLowerCase()]=false;
    }
	if(event.code=="Enter"){
	    keysDown[".enterKey"]=false;
	    keyDown[".enterKey"]=false;
	}
	if(event.code=="ShiftLeft"||event.code=="ShiftRight"){
	    shifted=false;
	}
	keyDown[backKey]=false;
}
for(var ccc=0; ccc<charList.length-1; ccc++){
    keysDown["."+charList[ccc]]=false;
    keyDown["."+charList[ccc]]=false;
}
var qcList;
var saveList;
function prntTxt(){
	println("Test");
}
function typing(){
    if($("#assignPoints").prop("hidden")===true){
    	if(keyCode!==20&&keyCode!==38&&keyCode!==40&&keyCode!==37&&keyCode!==39&&!keysDown[".enterKey"]&&!keysDown[shiftKey]&&!keysDown[backKey]&&keysDown["."+key.toString().toLowerCase()]&&keyDown["."+key.toString().toLowerCase()]!==true){
    	    if(shifted){
    		    newString=newString+key.toString().toUpperCase();
    	    }else{
    		    newString=newString+key.toString().toLowerCase();
    	    }
    		keyDown["."+key.toString().toLowerCase()]=true;
    	}
    	if(keysDown[backKey]&&!keyDown[backKey]){
    		var c;
    		c=subset(newString,0,newString.length-1);
    		newString=c;
    		keyDown[backKey]=true;
    	}
    	if(keysDown[".enterKey"]&&!keyDown[".enterKey"]){
    		newString='';
    		$("form").submit();
    		keyDown[".enterKey"]=true;
    	}
    }
}
var testLoad;
var qcClick=0;
var saveClick=0;
var farmMode;
var craftSelect;
var plantSelect;
var cropList=[];
var harvestList=[];
var plantableFood={};
var seedableSelect;
function setup(){
	img1 = loadImage('./images/brQeTf76.png');
	background(0,0,0);
	createCanvas(windowWidth,windowHeight);//-50 on both
	farmMode=createSelect();
	craftSelect=createSelect();
	plantSelect=createSelect();
	qcList=createSelect();
	saveList=createSelect();
	for(var i=0;i<9;i++){
		var tempBtn=createButton();
		cdf.plants[i]={planted:false,ticks:0};
		harvestList.push({readyH:false,selectedH:false});
		tempBtn.id("crop"+i);
		tempBtn.hide();
		cropList.push(tempBtn);
	}
	farmMode.position(750,420);
	farmMode.option("Craft");
	farmMode.option("Plant");
	farmMode.option("Harvest");
	seedableSelect=createSelect();
	seedableSelect.id('plantableSelect');
	seedableSelect.position(920,420);
	seedableSelect.hide();
	farmMode.id('farmMode');
	craftSelect.id('craftSelect');
	plantSelect.id('plantSelect');
	farmMode.changed(farmModeEvent);
	craftSelect.position(820,420);
	plantSelect.position(820,420);
	qcList.position(175,90);
	saveList.position(310,90);
	qcList.option("Inventory");
	qcList.option("Stats");
	saveList.option("Save");
	saveList.option("Load");
	saveList.option("Delete Data");
	qcList.mouseClicked(qcEvent);
	saveList.mouseClicked(saveEvent);
	qcList.mouseOut(qcEventOut);
	saveList.mouseOut(saveEventOut);
}

function plantSeed(event){
	var plantLocation=event.target.id.split("crop")[1];
	for(var plant in plantableFood){
		if(plantSelect.value().toLowerCase()==plantableFood[plant].name.toLowerCase()){
			if(foodStuff[plant].seeds>0 && !cdf.plants[plantLocation].planted){
				cdf.plants[plantLocation]=plantableFood[plant];
				cdf.plants[plantLocation].planted=true;
				cdf.plants[plantLocation].ticks=0;
				foodStuff[plant].seeds--;
				console.log(cdf.plants[plantLocation],foodStuff[plant].seeds);
			}
		}
	}
	//cdf.plants[plantLocation].planted=true;
}
function selectCrop(event){
	var plantLocation=event.target.id.split("crop")[1];
	if(harvestList[plantLocation].selectedH){
		harvestList[plantLocation].selectedH=false;
	}else{
		harvestList[plantLocation].selectedH=true;
	}
}
function farmModeEvent(event){
	var op=event.target.selectedOptions[0].value;
	if(op=="Harvest"){
		craftSelect.hide();
		plantSelect.hide();
	}else if(op=="Plant"){

		craftSelect.hide();
		plantSelect.show();
	}else if(op=="Craft"){
		craftSelect.show();
		plantSelect.hide();
	}
}
function qcEvent(){
	if(qcClick===1){
		if(qcList.value()==="Inventory"){
			dispInv();
		}else if(qcList.value()==="Stats"){
			dispStats();
		}
		qcClick=0;
	}else{	
		qcClick++;
	}
}
function saveEvent(){
	if(saveClick===1){
		if(saveList.value()==="Save"){
			saveGame();
		}else if(saveList.value()==="Load"){
			loadGame();
		}else if(saveList.value()==="Delete Data"){
			removeGameData();
		}
		saveClick=0;
	}else{
		saveClick++;
	}
}
function saveEventOut(){
	if(saveClick===1){
		saveClick=0;
	}
}
function qcEventOut(){
	if(qcClick===1){
		qcClick=0;
	}
}
function harvestCrops(){
	var cropCount=0;
	for(var i in harvestList){
		if(harvestList[i].selectedH && harvestList[i].readyH){
			var cropName=cdf.plants[cropCount].dictName;
			for(var chance in foodStuff[cropName].chanceToDrop){
				if(rngA(100)<foodStuff[cropName].chanceToDrop[chance]){
					foodStuff[cropName].amount++;
				}
			}
			foodStuff[cropName].seeds++;
			cdf.plants[cropCount]={planted:false,ticks:0};
			harvestList[i]={selectedH:false,readyH:false};
		}
		cropCount++;
	}
}
var shopWeapList=[];
var watList = []; //Array to store instances of the wat element
watList.push($("#message_wat"));
var imgHeight=-0.17;
var imgWidth=0.284;
function draw(){
    background(10,10,0);
	fill(0,255,0);
	image(img1,-100,-60,(windowWidth-50)*1.186,(windowHeight-60)*1.186);//window.innerWidth,window.innerHeight
	typing();
	for(var i=0;i<watList.length;i++){
	    if(parseFloat(watList[i].css('opacity'))<1){
	       watList[i].css('opacity',parseFloat(watList[i].css('opacity'))+0.1);
	   }
	}
	if(canTrade === true){
	    var itemListDisp='';
	    var availableItems=[];
	    if(prefix.toLowerCase() === "check"){
	        if(item.toLowerCase() === "prices"){
	            shopWeapList=[];
	            for(var i=0;i<shopWeapNameType.length-1;i++){
	                for(var l=0;l<shopEffectList.length;l++){
	                    var shopWeap=new weap(shopWeapNameType[i][0],shopEffectList[l],shopWeapNameType[i][1],(weapList.length+shopWeapList.length));
	                    var avItem=[shopWeap.name,shopWeap.value];
	                    shopWeapList.push(shopWeap);
	                    itemListDisp=itemListDisp+avItem[0]+' | Value:'+avItem[1]+'\n';
	                }
	            }
	            sellingDisp=itemListDisp;
	        }
	    }
	    if(prefix.toLowerCase() === "sell" && sellCheck!==true){
	       for(var i=1;i<playerInventory.length;i++){
	           if(item.toLowerCase() === playerInventory[i][0].name.toLowerCase() && playerInventory[i][1]>0){
	               currentCaps+=playerInventory[i][0].value;
	               playerInventory[i][1]-=1;
	               sellCheck=true;
	           }
	        }
	    }
	    if(prefix.toLowerCase() === "buy" && sellCheck!==true){
	       for(var i=0;i<shopWeapList.length;i++){
	           if(item.toLowerCase() === shopWeapList[i].name.toLowerCase() && currentCaps>shopWeapList[i].value){
	               currentCaps-=shopWeapList[i].value;
	               if(shopWeapList[i].name==function(){for(var k=0;k<playerInventory.length;k++){if(playerInventory[k][1]>0){return playerInventory[k][0].name;}}}){
	                    playerInventory[i][1]++;
	               }else{
	                    playerInventory.push([shopWeapList[i],1]);
	               }
	               sellCheck=true;
	           }
	        }
	    }
	}
	if(sellingDisp!==''&&canTrade === true){
	    fill(255,255,255);
	    if(keysDown[38]){
	        shiftY-=10;
	    }
	    if(keysDown[40]){
	        shiftY+=10;
	    }
	    push();
	    translate(120,shiftY);
	    text(sellingDisp,windowWidth/2+windowWidth/4,windowHeight/2+windowHeight/4);
	    pop();
	}
	newInput=newString;
	document.getElementById('command_line').value=newString;
	updateText();
for(var pyy=0;pyy<10;pyy++){
    for(var pxx=0;pxx<10;pxx++){
        if(playerX===pxx&&playerY===pyy){
            fill(0,255,0);
        }else if(area[pyy][pxx][0]===99){
            fill(255,0,0);
        }else if(area[pyy][pxx][0]===98){
            fill(255,255,0);
        }else{
            fill(0,0,255);
        }
        rect(windowWidth/2+windowWidth/4+(pxx*10),-200+windowHeight/2+windowHeight/4+(pyy*10),10,10);
    }
}
	if(area[playerY][playerX][0]==98){
		if(farmGuiOpen){
			farmMode.show();
			var plantState=plantSelect.style('display');
			var craftState=craftSelect.style('display');
			plantableFood={};
			var seedableFood={};
			for(var plant in foodStuff){
				if(foodStuff[plant].plantable && foodStuff[plant].seeds>0){
					plantableFood[plant]=foodStuff[plant];
				}
			}
			for(var plant in foodStuff){
				if(foodStuff[plant].plantable && foodStuff[plant].amount>0){
					seedableFood[plant]=foodStuff[plant];
				}
			}
			function refreshFood(){
				seedableSelect.elt.innerHTML="";
				plantSelect.elt.innerHTML="";
				for(var plant in plantableFood){
					plantSelect.option(plantableFood[plant].name,plant);
				}
				for(var plant in seedableFood){
					seedableSelect.option(seedableFood[plant].name,plant);
				}
			}
			if(frameCount%100==0){
				if(document.getElementById('refreshFood')){
					document.getElementById('refreshFood').parentElement.removeChild(document.getElementById('refreshFood'));
				}
				var refreshFoodButton=createButton();
				refreshFoodButton.id("refreshFood");
				refreshFoodButton.elt.innerHTML="Refresh food list";
				refreshFoodButton.position(920,380);
				refreshFoodButton.mouseClicked(refreshFood);
			}
			if(craftState=="block"){
				seedableSelect.show();
			}else{
				seedableSelect.hide();
			}
			for(var p=0;p<cdf.plantLimit;p++){
				cropList[p].show();
				cropList[p].position(700+(p*40),120);
				if(cropList[p].elt.innerHTML=="undefined"){
					cropList[p].elt.innerHTML=p+" [-]";
				}
				if(plantState=="block"){
					cropList[p].mouseClicked(function(){});
					cropList[p].elt.removeEventListener('click',cropList[p]._events.click["[[TargetFunction]]"]);
					if(cdf.plants[p].planted){
						cropList[p].style('background-color',cdf.plants[p].color);
						var grown="[X]";
						var harvestable=false;
						if(cdf.plants[p].ticks>cdf.plants[p].timeToGrow){
							grown="[+]";
							harvestable=true;
						}
						cropList[p].elt.innerHTML=p+" "+grown;
					}else{
						cropList[p].style('background-color','buttonface');
						cropList[p].mouseClicked(plantSeed);
					}
				}else if(farmMode.selected()=="Harvest"){
					cropList[p].mouseClicked(function(){});
					cropList[p].elt.removeEventListener('click',cropList[p]._events.click["[[TargetFunction]]"]);
					if(cdf.plants[p].planted){
						if(harvestList[p].selectedH){
							cropList[p].style('background-color','purple');
						}else{
							cropList[p].style('background-color',cdf.plants[p].color);
						}
						var grown="[X]";
						var harvestable=false;
						if(cdf.plants[p].ticks>cdf.plants[p].timeToGrow){
							grown="[+]";
							harvestable=true;
						}
						cropList[p].elt.innerHTML=p+" "+grown;
						if(harvestable){
							harvestList[p].readyH=true;
							cropList[p].mouseClicked(selectCrop);
						}
					}else{
						cropList[p].style('background-color','buttonface');
						cropList[p].elt.removeEventListener('click',cropList[p]._events.click["[[TargetFunction]]"]);
					}
				}
			}
			if(farmMode.selected()=="Harvest"){
				if(frameCount%100==0){
					if(document.getElementById('harvestButton')){
						document.getElementById('harvestButton').parentElement.removeChild(document.getElementById('harvestButton'));
					}
					var harvestButton=createButton();
					harvestButton.id("harvestButton");
					harvestButton.elt.innerHTML="Harvest selected";
					harvestButton.position(820,380);
					harvestButton.mouseClicked(harvestCrops);
				}
			}else{
				if(document.getElementById('harvestButton')){
					document.getElementById('harvestButton').parentElement.removeChild(document.getElementById('harvestButton'));
				}
			}
		}else{
			farmMode.hide();
		}
	}else{
		farmGuiOpen=false;
		plantSelect.hide();
		craftSelect.hide();
		farmMode.hide();
		seedableSelect.hide();
	}
	//println(keyCode);
	//println(charList[i]+": "+keysDown[charList[i]]);
}
