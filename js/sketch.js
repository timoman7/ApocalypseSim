//loading a game does not update the cdf.plantLimit immediately
//
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
var charList=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"," ","-"];
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
var plantSelect;
var cropList=[];
var harvestList=[];
var plantInfoP=[];
var cropInfoP=[];
var plantableFood={};
var seedableFood={};
var seedableSelect;
var craftSeedButton;
var foodPlants={};
var refreshFoodButton;
var harvestButton;
var upgradeCdfButton;
var dispInfo;
var cropInfoDiv;
var plantInfoDiv;
function refreshPlantInfo(){
	plantInfoP=[];
	var pc=0;
	var pcc=0;
	for(var i in foodStuff){
		if(foodStuff[i].plantable){
			foodPlants[pcc]=foodStuff[i];
			pcc++;
		}
	}
	for(var i in foodPlants){
		if(document.getElementById('plantInfo'+pc)){
			document.getElementById('plantInfo'+pc).parentElement.removeChild(document.getElementById('plantInfo'+pc));
		}
		var tempP=createP();
		tempP.id("plantInfo"+pc);
		tempP.hide();
		plantInfoP.push(tempP);
		pc++;
	}
}
function setMaxCrops(n){
	cropList=[];
	harvestList=[];
	cropInfoP=[];
	cdf.plantLimit=n;
	for(var i=0;i<n;i++){
		if(document.getElementById('cropInfo'+i)){
			document.getElementById('cropInfo'+i).parentElement.removeChild(document.getElementById('cropInfo'+i));
		}
		if(document.getElementById('crop'+i)){
			document.getElementById('crop'+i).parentElement.removeChild(document.getElementById('crop'+i));
		}
		var tempBtn=createButton();
		var tempP=createP();
		cdf.plants[i]={planted:false,ticks:0};
		tempP.id("cropInfo"+i);
		tempBtn.id("crop"+i);
		tempP.hide();
		tempBtn.hide();
		cropInfoP.push(tempP);
		harvestList.push({readyH:false,selectedH:false});
		cropList.push(tempBtn);
	}
}
function setup(){
	img1 = loadImage('./images/brQeTf76.png');
	background(0,0,0);
	createCanvas(windowWidth,windowHeight);//-50 on both
	farmMode=createSelect();
	plantSelect=createSelect();
	qcList=createSelect();
	dispInfo=createSelect();
	saveList=createSelect();
	cropInfoDiv=createDiv();
	plantInfoDiv=createDiv();
	//(cdf.upgrades.tier1.effect+cdf.upgrades.tier2.effect+cdf.upgrades.tier3.effect) will get max potential limit
	setMaxCrops(cdf.plantLimit);
	refreshPlantInfo();
	cropInfoDiv.position(460,450);
	plantInfoDiv.position(460,450);
	cropInfoDiv.html("");
	plantInfoDiv.html("");
	cropInfoDiv.style('width','600px');
	plantInfoDiv.style('width','600px');
	cropInfoDiv.style('height','200px');
	plantInfoDiv.style('height','200px');
	cropInfoDiv.style('overflow-x','scroll');
	plantInfoDiv.style('overflow-x','scroll');
	cropInfoDiv.style('overflow-y','scroll');
	plantInfoDiv.style('overflow-y','scroll');
	cropInfoDiv.hide();
	plantInfoDiv.hide();
	dispInfo.position(460,435);
	dispInfo.option("Planted");
	dispInfo.option("Crop Inventory");
	dispInfo.hide();
	farmMode.position(750,420);
	farmMode.option("Craft");
	farmMode.option("Plant");
	farmMode.option("Harvest");
	upgradeCdfButton=createButton();
	upgradeCdfButton.id("upgradeCdf");
	upgradeCdfButton.html("Upgrade farm for "+((cdf.tier+1)*10)+" Shekels.");
	upgradeCdfButton.mouseClicked(upgradeFarm);
	upgradeCdfButton.position(700,95);
	upgradeCdfButton.hide();
	refreshFoodButton=createButton();
	refreshFoodButton.id("refreshFood");
	refreshFoodButton.elt.innerHTML="Refresh food list";
	refreshFoodButton.position(920,380);
	refreshFoodButton.mouseClicked(refreshFood);
	harvestButton=createButton();
	harvestButton.id("harvestButton");
	harvestButton.elt.innerHTML="Harvest selected";
	harvestButton.position(820,380);
	harvestButton.mouseClicked(harvestCrops);
	refreshFoodButton.hide();
	seedableSelect=createSelect();
	seedableSelect.id('plantableSelect');
	seedableSelect.position(920,420);
	seedableSelect.hide();
	craftSeedButton=createButton();
	craftSeedButton.id("craftSeedButton");
	craftSeedButton.elt.innerHTML="Craft into seed";
	craftSeedButton.position(820,420);
	craftSeedButton.mouseClicked(craftSeed);
	craftSeedButton.hide();
	farmMode.id('farmMode');
	plantSelect.id('plantSelect');
	farmMode.changed(farmModeEvent);
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
function upgradeFarm(event){
	var requiredCaps=(cdf.tier+1)*10;
	if(currentCaps>=requiredCaps){
		currentCaps-=requiredCaps;
		cdf.tier++;
		setMaxCrops(cdf.plantLimit+1);
		this.html("Upgrade farm for "+requiredCaps+" Shekels.");
	}
}
function checkFood(itemName){
	var foundFood=false;
	var foodName="";
	for(var foods in foodStuff){
		if(itemName.toLowerCase()==foodStuff[foods].name.toLowerCase()){
			foundFood=true;
			foodName=foods;
		}else if(!foundFood){
			foundFood=false;
		}
	}
	if(foundFood){
		return {found:true,foodName:foodName,};
	}else{
		return {found:false};
	}
};
function refreshFood(){
	refreshPlantInfo();
	seedableSelect.elt.innerHTML="";
	plantSelect.elt.innerHTML="";
	for(var plant in plantableFood){
		plantSelect.option(plantableFood[plant].name,plant);
	}
	for(var plant in seedableFood){
		seedableSelect.option(seedableFood[plant].name,plant);
	}
}
function craftSeed(){
	for(var plant in seedableFood){
		if(seedableSelect.selected().toLowerCase()==seedableFood[plant].name.toLowerCase()){
			if(foodStuff[plant].amount>0){
				foodStuff[plant].amount--;
				foodStuff[plant].seeds++;
			}
		}
	}
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
		plantSelect.hide();
	}else if(op=="Plant"){
		plantSelect.show();
	}else if(op=="Craft"){
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
			harvestList[i].selectedH=false;
			harvestList[i].readyH=false;
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
	    if(prefix.toLowerCase() === "sell" && !sellCheck){
		if(checkFood(item).found){
			for(var i=0;i<foodStuff.length;i++){
			//Sell Food
				if(foodStuff[checkFood(item).foodName].amount>0){
	               			currentCaps+=foodStuff[checkFood(item).foodName].sellPrice;
	               			foodStuff[checkFood(item).foodName].amount--;
		               		sellCheck=true;
		           	}
			}
		}else{
	       		for(var i=1;i<playerInventory.length;i++){
	           		if(item.toLowerCase() === playerInventory[i][0].name.toLowerCase() && playerInventory[i][1]>0){
	               			currentCaps+=playerInventory[i][0].value;
	               			playerInventory[i][1]-=1;
		               		sellCheck=true;
		           	}
	        	}
		}
	    }
	    if(prefix.toLowerCase() === "buy" && !sellCheck){
		if(checkFood(item).found){
			for(var i=0;i<foodStuff.length;i++){
			//Sell Food
				if(currentCaps>=foodStuff[checkFood(item).foodName].buyPrice){
	               			currentCaps-=foodStuff[checkFood(item).foodName].buyPrice;
	               			foodStuff[checkFood(item).foodName].amount++;
		               		sellCheck=true;
		           	}
			}
		}else{
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
			dispInfo.show();
			farmMode.show();
			upgradeCdfButton.show();
			var plantState=plantSelect.style('display');
			plantableFood={};
			seedableFood={};
			
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
			refreshFoodButton.show();
			if(farmMode.selected()=="Craft"){
				seedableSelect.show();
				craftSeedButton.show();
			}else{
				seedableSelect.hide();
				craftSeedButton.hide();
			}
			if(frameCount%20==0){
				var xFix=0;
				for(var cropIndex=0;cropIndex<cropInfoP.length;cropIndex++){
					if(cropIndex%10==0&&cropIndex!==0){
						xFix++;
					}
					cropInfoP[cropIndex].show();
					cropInfoP[cropIndex].style('margin','8px 0px');
					cropInfoP[cropIndex].parent(cropInfoDiv);
					if(cropIndex>=cdf.plantLimit){
						cropInfoP[cropIndex].html("Crop ID:"+cropIndex+" | Status: Unavailable");
					}else{
						if(cdf.plants[cropIndex].planted){
							cropInfoP[cropIndex].html("Crop ID:"+cropIndex+" | Plant: "+cdf.plants[cropIndex].name+" | Growth Progress: "+cdf.plants[cropIndex].ticks+" / "+cdf.plants[cropIndex].timeToGrow);
						}else{
							cropInfoP[cropIndex].html("Crop ID:"+cropIndex+" | Plant: None");
						}
					}
				}
				for(var pIndex=0;pIndex<plantInfoP.length;pIndex++){
					var pInfoP=plantInfoP[pIndex];
					var pInfo=foodStuff[foodPlants[pIndex].dictName];
					plantInfoP[pIndex].show();
					plantInfoP[pIndex].style('margin','8px 0px');
					plantInfoP[pIndex].parent(plantInfoDiv);
					if(pInfo!==undefined){
						plantInfoP[pIndex].html(pInfo.name+": Amount: "+pInfo.amount+" | Seeds: "+pInfo.seeds+" | Hunger Restored: "+pInfo.hungerRestored+" | Sell/Buy Price: "+pInfo.sellPrice+"/"+pInfo.buyPrice+" Shekels");
					}
				}
				if(dispInfo.selected() == "Planted"){
					plantInfoDiv.hide();
					cropInfoDiv.show();
				}else if(dispInfo.selected() == "Crop Inventory"){
					cropInfoDiv.hide();
					plantInfoDiv.show();
				}
			}
			if(frameCount%10==0){
				var yFix=0;
				for(var p=0;p<cdf.plantLimit;p++){
					cropList[p].show();
					if(p%5==0&&p!==0){
						yFix++;
					}
					cropList[p].position(700+((p%5)*60),120+(yFix*25));
					if(cropList[p].elt.innerHTML=="undefined" || !cdf.plants[p].planted){
						cropList[p].elt.innerHTML=p+" [-]";
					}
					if(cdf.plants[p].color!==undefined){
						cropList[p].style('background-color',cdf.plants[p].color);
						cropList[p].style('borderColor',cdf.plants[p].borderColor);
					}
					var grown="[X]";
					var harvestable=false;
					if(cdf.plants[p].ticks>=cdf.plants[p].timeToGrow){
						grown="[O]";
						harvestable=true;
					}
					cropList[p].elt.innerHTML=p+" "+grown;
					if(plantState=="block"){
						cropList[p].mouseClicked(function(){});
						cropList[p].elt.removeEventListener('click',cropList[p]._events.click["[[TargetFunction]]"]);
						if(cdf.plants[p].planted){
							cropList[p].style('background-color',cdf.plants[p].color);
							cropList[p].style('borderColor',cdf.plants[p].borderColor);
						}else{
							cropList[p].style('background-color','buttonface');
							cropList[p].style('borderColor','buttonface');
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
								cropList[p].style('borderColor',cdf.plants[p].borderColor);
							}
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
			}
			if(farmMode.selected()=="Harvest"){
				harvestButton.show();
			}else{
				harvestButton.hide();
			}
		}else{
			farmMode.hide();
		}
	}else{
		
		for(var pIndex=0;pIndex<plantInfoP.length;pIndex++){
			plantInfoP[pIndex].hide();
		}
		for(var cropIndex=0;cropIndex<cropInfoP.length;cropIndex++){
			cropInfoP[cropIndex].hide();
		}
		for(var p=0;p<cdf.plantLimit;p++){
			if(cropList[p]){
				cropList[p].hide();
			}
		}
		refreshFoodButton.hide();
		upgradeCdfButton.hide();
		craftSeedButton.hide();
		harvestButton.hide();
		farmGuiOpen=false;
		plantSelect.hide();
		cropInfoDiv.hide();
		plantInfoDiv.hide();
		farmMode.hide();
		dispInfo.hide();
		seedableSelect.hide();
	}
	//println(keyCode);
	//println(charList[i]+": "+keysDown[charList[i]]);
	text("Heatlh: "+CurrentHealth+" of "+MaxedHealth,420,100);
	text("Hunger: "+hunger+" of "+maxHunger,420,120);
}
