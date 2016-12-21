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
var loading=function(x,y,saze,amount,lines){
    this.x=x;
    this.y=y;
    this.amount=amount||10;
    this.c=[];
    this.b=[];
    this.d=[];
    this.e=[];
    this.saze=saze;
    this.t=0;
    this.lines=lines||true;
};
loading.prototype.draw= function() {
    this.c=[];
    this.b=[];
    this.d=[];
    this.e=[];
    this.t++;
    for(var zz=0;zz<this.amount;zz++){
        this.c.push((this.saze-(sin(this.t+(zz*4))*5))*sin(this.t*zz)*5);
        this.b.push((this.saze-(cos(this.t+(zz*4))*5))*cos(this.t*zz)*5);
    }
    for(var zz=-1;zz<this.amount-1;zz++){
        this.d.push((this.saze-(sin(this.t+(zz*4))*5))*sin(this.t*zz)*5);
        this.e.push((this.saze-(cos(this.t+(zz*4))*5))*cos(this.t*zz)*5);
    }
    for(var zz=0;zz<this.c.length;zz++){
        if(!this.lines){
            noStroke();
            fill(255, 0, 0);
            ellipse(this.x+this.c[zz],this.y+this.b[zz],5,5);
            ellipse(this.x+this.c[zz],this.y+this.e[zz],5,5);
            ellipse(this.x+this.d[zz],this.y+this.b[zz],5,5);
            ellipse(this.x+this.d[zz],this.y+this.e[zz],5,5);
        }else{
            stroke(0,190,10);
            line(this.x+this.c[zz],this.y+this.b[zz],this.x+this.d[zz],this.y+this.e[zz]);
            line(this.x+this.c[zz],this.y+this.e[zz],this.x+this.d[zz],this.y+this.b[zz]);
        }
    }
};
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
	farmMode.option("Plant");
	farmMode.option("Harvest");
	farmMode.option("Craft");
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
			cdf.plants[cropCount]={planted:false};
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
			var plantableFood={};
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
			if(document.getElementById('plantableSelect')){
				document.getElementById('plantableSelect').parentElement.removeChild(document.getElementById('plantableSelect'));
			}
			var seedableSelect=createSelect();
			seedableSelect.id('plantableSelect');
			seedableSelect.position(920,420);
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
				cropList[p].position(700+(p*30),120);
				if(cropList[p].elt.innerHTML=="undefined"){
					cropList[p].elt.innerHTML=p+" [-]";
				}
				if(plantState=="block"){
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
						function plantSeed(){
							for(var plant in plantableFood){
								if(plantSelect.value==plantableFood[plant].name){
									cdf.plants[p]=plantableFood[plant];
									foodStuff[plant].seeds--;
								}
							}
							cdf.plants[p].planted=true;
						}
						cropList[p].mouseClicked(plantSeed);
					}
				}else if(farmMode.selected()=="Harvest"){
					if(cdf.plants[p].planted){
						cropList[p].style('background-color',cdf.plants[p].color);
						var grown="[X]";
						var harvestable=false;
						if(cdf.plants[p].ticks>cdf.plants[p].timeToGrow){
							grown="[+]";
							harvestable=true;
						}
						cropList[p].elt.innerHTML=p+" "+grown;
						if(harvestable){
							harvestList[p].readyH=true;
							cropList[p].mouseClicked(function(){harvestList[p].selectedH=true;});
						}
					}else{
						cropList[p].mouseClicked(function(){});
					}
				}
			}
			if(farmMode.selected()=="Harvest"){
				if(document.getElementById('harvestButton')){
					document.getElementById('harvestButton').parentElement.removeChild(document.getElementById('harvestButton'));
				}
				var harvestButton=createButton();
				harvestButton.id("harvestButton");
				harvestButton.position(820,380);
				harvestButton.mouseClicked(harvestCrops);
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
	}
	//println(keyCode);
	//println(charList[i]+": "+keysDown[charList[i]]);
}
