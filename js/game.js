var currentUser;
var Class;
var clickedButton=false;
var clickButton=function(){
	clickedButton=true;
};
var closePrompt = function(){
	document.body.style.pointerEvents="auto";
	document.getElementById('overlay').parentNode.removeChild(document.getElementById('overlay'));
};
var setOnClick=function(){
	document.getElementById('signOutBtn').setAttribute('onClick',"signout();");
	document.getElementById('userButton').setAttribute('onClick',"changeVis(document.getElementById('userInformation'));");
};
var customPrompt = function(prom,okFunc,exitFunc){
	exitFunc=exitFunc || "";
	okFunc=okFunc || "";
	if(document.getElementById('overlay')===null){
		var myPrompt=document.createElement('div');
		var overlay=document.createElement('div');
		var exitBtn=document.createElement('button');
		exitBtn.innerHTML="X";
		var okBtn=document.createElement('button');
		okBtn.innerHTML="Ok";
		exitBtn.id="exitBtn";
		okBtn.id="okBtn";
		exitBtn.style="border-style:none; top: 5px; right: 5px; background-color: inherit; position: inherit";
		okBtn.style="border-style: ridge; border-radius: 10px; border-color: black; bottom: 5px; right: 50%; background-color: inherit; position: inherit";
		prom.style.position="inherit";
		prom.style.backgroundColor="inherit";
		overlay.id="overlay";
		overlay.style="z-index: 99999; background-color: rgba(0,0,0,0.6); top: 0; right: 0; left: 0; bottom: 0; pointer-events: painted; position: absolute;";
		myPrompt.style="z-index: 100000; pointer-events: auto; position: inherit; border-radius: 10px; border-style: ridge; border-color: black; background-color: ghostwhite; left: 40%; right: 40%; top: 20%; bottom:55%";
		myPrompt.id='myPrompt';
		myPrompt.appendChild(exitBtn);
		if(prom.style.left===""){
			prom.style.left="5px";
		}
		if(prom.style.top===""){
			prom.style.top="5px";
		}
		myPrompt.appendChild(prom);
		myPrompt.appendChild(okBtn);
		overlay.appendChild(myPrompt);
		document.body.insertBefore(overlay,document.body.childNodes[0]);
		document.getElementById('exitBtn').setAttribute('onClick','closePrompt();'+exitFunc);
		document.getElementById('okBtn').setAttribute('onClick','closePrompt();'+okFunc);
		document.body.pointerEvents="none";
	}
};
var changeVis=function(a){
	if(a.style.visibility==="hidden"){
		a.style.visibility="visible";
	}else{
		a.style.visibility="hidden";
	}
};
var signout=function(){
	firebase.auth().signOut().then(function() {
		var newDiv=document.createElement('div');
		newDiv.style="color: black; left: 40%; right: 40%; top: 20%; bottom: 60%;";
		newDiv.innerHTML="Signed Out.";
		changeVis(document.getElementById('userInformation'));
		customPrompt(newDiv,"closePage();","closePage();");
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in.
			}else{
				//closePage();
			}
		});
	}, function(error) {
		var newDiv=document.createElement('div');
		newDiv.style="color: black; left: 40%; right: 40%; top: 20%; bottom: 60%;";
		newDiv.innerHTML="Sign Out Error:\n"+error;
		customPrompt(newDiv);
	});
};
firebase.auth().getRedirectResult().then(function(result) {
  var user = result.user;
  var credential = result.credential;
	if(user===null){
		var providerChoice=prompt("What is your form of login?\nGoogle\nGithub\nEmail\nTwitter\nFacebook","");
		var provider;
		if(providerChoice.toLowerCase()==="google"){
			provider = new firebase.auth.GoogleAuthProvider();
		}else if(providerChoice.toLowerCase()==="github"){
			provider = new firebase.auth.GithubAuthProvider();
		}else if(providerChoice.toLowerCase()==="email"){
			provider = new firebase.auth.EmailAuthProvider();
		}else if(providerChoice.toLowerCase()==="twitter"){
			provider = new firebase.auth.TwitterAuthProvider();
		}else if(providerChoice.toLowerCase()==="facebook"){
			provider = new firebase.auth.FacebookAuthProvider();
		}
		firebase.auth().signInWithRedirect(provider);
	}else{
		currentUser = firebase.auth().currentUser;
		var userDiv = document.createElement('div');
		userDiv.id="userInformation";
		userDiv.style="position: absolute; width: 300px; height: 200px; border-style: ridge; border-radius: 15px; border-color: black; background-color: rgb(200,200,200); color: black; right: 60px; bottom: 100px; z-index:10000; visibility: hidden;";
		var userIcon = document.createElement('img');
		var userInfo1 = document.createElement('p');
		var userInfo2 = document.createElement('p');
		var signOutButton = document.createElement('button');
		signOutButton.id="signOutBtn";
		signOutButton.style = "position: inherit; right: 10px; bottom: 10px; width: 65px; height: 30px; border-radius: 4px; border-style: ridge; border-color: black; color: black;";
		signOutButton.innerHTML="Sign out";
		userInfo1.class="userInfo";
		userInfo2.class="userInfo";
		userIcon.class="userIcon";
		userInfo1.innerHTML="Name: "+currentUser.displayName;
		userInfo2.innerHTML="Email: "+currentUser.email;
		userInfo1.style="position: absolute; left: 10px; top: 150px; font-size: 12px; color: black;";
		userInfo2.style="position: absolute; left: 10px; top: 165px; font-size: 12px; color: black;";
		userIcon.src=currentUser.photoURL;
		userIcon.style="position: inherit; right: 7px; top: 5px; width: 120px; height: 120px; border-radius: 60px;";
		userDiv.appendChild(signOutButton);
		userDiv.appendChild(userInfo1);
		userDiv.appendChild(userInfo2);
		userDiv.appendChild(userIcon);
		document.body.appendChild(userDiv);
		var userButton = document.createElement('button');
		var userImg = document.createElement('img')
		userImg.src = currentUser.photoURL;
		userImg.style = "border-style: none; position: absolute; z-index: 9999; top: 0; left: 0; width: 100%; height: 100%; border-radius: 20px;";
		userButton.appendChild(userImg);
		userButton.id = "userButton";
		userButton.style = "border-style: none; position: absolute; z-index: 9999; right: 60px; bottom: 60px; width: 40px; height: 40px; border-radius: 20px;";
		document.body.appendChild(userButton);
		setOnClick();
	}
}, function(error) {
  // The provider's account email, can be used in case of
  // auth/account-exists-with-different-credential to fetch the providers
  // linked to the email:
  var email = error.email;
  // The provider's credential:
  var credential = error.credential;
  // In case of auth/account-exists-with-different-credential error,
  // you can fetch the providers using this:
	
});
var loadedData;
var getData=function(dataToGet){
	if(firebase.auth().currentUser!==undefined && firebase.auth().currentUser!==null){
		firebase.database().ref('/users/' + firebase.auth().currentUser.uid).once('value').then(
			function(snapshot){
				loadedData = snapshot.val()[dataToGet.toString()];
			}
		);
	}
};
var dataRecieved;
var getPlayername=function(idOfPlayer){
	if(firebase.auth().currentUser!==undefined && firebase.auth().currentUser!==null){
		firebase.database().ref('/users/' + idOfPlayer + '/gamedata/playerName').once('value').then(
			function(snapshot){
				dataRecieved = snapshot.val();
			}
		);
	}
	return dataRecieved;
};

			var globalXY={};
			firebase.database().ref('deathMessages').once('value').then(
				function(snapshot){
					globalXY = snapshot.val();
				}
			);
var enableCombat=true;
var checkStorage=function(){
	getData("gamedata");
     if(loadedData!==undefined){
          return true;
     }else{
          return false;
     }
};
checkStorage();
var speaking = new p5.Speech();
speaking.setLang('en-US');
speaking.setVoice("Google UK English Male");
speaking.setVolume(2);
speaking.setPitch(0.8);
speaking.setRate(0.8);
speaking.interrupt = true;
var currentSpeak = "";
for (var i = 0; i < document.getElementById('console').childElementCount; i++) {
    if (document.getElementById('console').children[i].id !== "place_holder") {
        if (document.getElementById('console').children[i].childElementCount > 0) {
            for (var j = 0; j < document.getElementById('console').children[i].childElementCount; j++) {
                if (document.getElementById('console').children[i].children[j].id !== "assignPoints") {
                    document.getElementById('console').children[i].children[j].className += " speakable";
                }
            }
        } else {
            document.getElementById('console').children[i].className += " speakable";
        }
    }
}
var chooseBackground=document.createElement('select');
chooseBackground.id="backgroundSelection";
var doctor=document.createElement('option');
var soldier=document.createElement('option');
var vendor=document.createElement('option');
var mayor=document.createElement('option');
doctor.value="Doctor";
doctor.innerHTML="Doctor";
doctor.title="Before the bombs dropped, you were a doctor at a local hospital.\nHealing items are more efficient.";
soldier.value="Soldier";
soldier.innerHTML="Soldier";
soldier.title="You are a soldier that survived when the bombs dropped.\nAssault rifles do additional damage.";
vendor.value="Vendor";
vendor.innerHTML="Vendor";
vendor.title="You use to be the owner of a local business.\nItems cost less and sell for more.";
mayor.value="Mayor";
mayor.innerHTML="Mayor";
mayor.title="When the bombs dropped you were calming down the local residents.\nYou have a higher charisma and are more persuasive.";
var availableClasses=[doctor,soldier,vendor,mayor];
for(var i=0;i<availableClasses.length;i++){
	chooseBackground.appendChild(availableClasses[i]);
}
document.getElementById('assignPoints').appendChild(chooseBackground);
var statButton=document.createElement('button');
statButton.setAttribute('onclick','clickButton();');
document.getElementById('assignPoints').appendChild(statButton);
var divLength;
if (currentSpeak === "") {
    divLength = document.getElementById('console').childElementCount - 1;
} else {
    divLength = document.getElementById('console').childElementCount;
}
var checkChange = function() {
    speaking.setVoice("Google UK English Male");
    var localChange = false;
    if (document.getElementById('console').childElementCount > divLength) {
        localChange = true;
    } else {
        localChange = false;
    }
    if (document.getElementById('console').childElementCount > divLength) {
        divLength = document.getElementById('console').childElementCount;
        if (currentSpeak === "") {
            currentSpeak = document.getElementsByClassName('speakable')[2].innerHTML.replace(/<br>/g, "").replace(/<\/br>/g, "").replace(/[><\]\[]/g, "").replace(/&gt;/g, "");
        } else {
            currentSpeak = document.getElementsByClassName('speakable')[0].innerHTML.replace(/<br>/g, "").replace(/<\/br>/g, "").replace(/[><\]\[]/g, "").replace(/&gt;/g, "");
        }
    }
    if (localChange) {
        console.log(currentSpeak);
        //speaking.speak(currentSpeak);
    } else {
        console.log("No change.");
    }
};
//Rooms Check
var playerInventory = [];
var currentCaps = 10;
var canTrade = false;
var startMSG = document.getElementById('area_vault');
var playerName = '';
startMSG.innerHTML = '>' + playerName + ' messed up this time, the overseer walked in on ' + playerName + ' sleeping with his daughter.\nThat salty old bastard is kicking ' + playerName + ' out into the wasteland to be. As ' + playerName + ' approached\nthe vault door. A dim beam of light from a crack in ceiling reveals a a wooden stick\non the floor next to a note with the name ' + playerName + ' on it...';
window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
    if (e.keyCode == 8 && e.target == document.body) {
        e.preventDefault();
    }
};
var done = 0;
{
    var roomChecky = function() {
        var zxc = [0, 0, 0, 0, 0, 0];
        for (var i = 0; i < area.length; i++) {
            for (var j = 0; j < area[i].length; j++) {
                for (var c = 0; c < zxc.length; c++) {
                    if (area[i][j][0] === c) {
                        zxc[c] += 1;
                    }
                }
            }
        }
        for (var g = 0; g < zxc.length; g++) {
            zxc[g] = g + 1 + ": " + zxc[g];
        }
        for (var b = 0; b < zxc.length; b++) {
            console.log(zxc[b]);
        }
    };
}
var j = 0;
var n = 4;
var prefix;
var item;
var updatingSPEC = true;
var stopCounting = false;
// Been to Variables
var beentoarea_vault = true;
// Current starting room
var currentroom = "area_vault";
//Game Winning Item Variables 
var titaniumKey = false; {
    Array.prototype.sortOn = function(key) {
        this.sort(function(a, b) {
            if (a[key] < b[key]) {
                return -1;
            } else if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        });
    };
    var effectList = ["Incendiary", "Normal", "Cryo", "Normal", "Radiant", "Normal", "Blinding", "Normal"];

    var fistBase = {
        type: "Melee",
        defName: "Fist",
        value: 5,
        damage: 10,
        reloadSpeed: 1,
        magCap: 12,
        ammoCap: 80,
    };
    var pistolBase = {
        type: "Pistol",
        defName: "9MM Pistol",
        value: 15,
        damage: 30,
        reloadSpeed: 1,
        magCap: 12,
        ammoCap: 80,
    };
    var shotgunBase = {
        type: "Shotgun",
        defName: "Shotgun",
        value: 35,
        damage: 25,
        reloadSpeed: 0.8,
        magCap: 6,
        ammoCap: 36,
    };
    var smgBase = {
        type: "SMG",
        defName: "SMG",
        value: 20,
        damage: 10,
        reloadSpeed: 1.2,
        magCap: 32,
        ammoCap: 160,
    };
    var nukeBase = {
        type: "Nuke",
        defName: "Nuke Launcher",
        value: 70,
        damage: 100,
        reloadSpeed: 0.5,
        magCap: 1,
        ammoCap: 80,
    };
    var weapNameType = [
        [pistolBase, "9MM Pistol"],
        [nukeBase, "Nuke Launcher"],
        [pistolBase, "9MM Pistol"],
        [smgBase, "SMG"],
        [pistolBase, "9MM Pistol"],
        [smgBase, "SMG"],
        [pistolBase, "9MM Pistol"],
        [shotgunBase, "Shotgun"],
        [pistolBase, "9MM Pistol"],
        [shotgunBase, "Shotgun"],
        [pistolBase, "9MM Pistol"],
        [fistBase, "Fist"]
    ];
    var shopEffectList = ["Incendiary", "Cryo", "Radiant", "Blinding", "Normal"];
    var shopWeapNameType = [
        [nukeBase, "Nuke Launcher"],
        [smgBase, "SMG"],
        [pistolBase, "9MM Pistol"],
        [shotgunBase, "Shotgun"],
        [fistBase, "Fist"]
    ];
    var weap = function(baseWeap, effect, name, id) {
        this.id = id;
        this.baseWeap = baseWeap;
        this.name = name || this.baseWeap.defName;
        this.effect = effect === "Normal" ? "Normal" : effect;
        this.value = this.baseWeap.value;
        this.damage = this.baseWeap.damage;
        this.type = this.baseWeap.type;
        this.magCap = this.baseWeap.magCap;
        this.ammoCap = this.baseWeap.ammoCap;
        this.magCap = this.baseWeap.magCap;
        if (this.effect !== "Normal") {
            this.name = this.effect + " " + this.name;
            switch (this.effect) {
                case "Incendiary":
                    this.damage = this.damage * 1.4;
                    this.value += 40;
                    break;
                case "Cryo":
                    this.damage = this.damage * 1.3;
                    this.value += 30;
                    break;
                case "Radiant":
                    this.damage = this.damage * 1.2;
                    this.value += 20;
                    break;
                case "Blinding":
                    this.damage = this.damage + (this.damage * 0.1);
                    this.value += 10;
                    break;
            }
        }
    };
    var weapList = [];
    var randomWeapEffect = function() {
        var b = effectList.length - 1;
        var a = effectList[Math.round(Math.random() * b)];
        return a;
    };
    var giveRandomWeap = function() {
        var l = weapNameType[Math.round(Math.random() * (weapNameType.length - 2))];
        var k = new weap(l[0], randomWeapEffect(), l[1], weapList.length);
        return k;
    };
}














//[End] Game Winning Item Variables

{
    var Sharp_Wooden_Stick = 0;
    var note1 = false;
    var items = [
        //[Name] [ID] [AmountOwned] [Value] [Damage] [Type]
        ["Nothing", 0, 0, 0, 1, "Melee"],
        ["9MM Pistol", 1, 0, 50, 2, "Gun"],
        ["Shotgun", 2, 0, 75, 3, "Gun"],
        ["Stick", 3, 0, 20, 1.5, "Melee"],
        ["SMG", 4, 0, 60, 3, "Gun"],
        ["Nuke launcher", 5, 0, 100, 6, "Gun"],
        ["Thingy", 6, 0, 10, 1.75, "Melee"],
        ["Bandage", 7, 1, 40, 0]
    ];
}
//Items/Equip
{
    var equipItem = new weap(fistBase, "Normal", "Fists", -1);
    playerInventory.push([equipItem, 1]);
    var equipedWeapon;
    // Action/Perk Variables
    var MeleeDmg;
    var curDmg;
    var HealAmount;
    var StimDropRate;
    var numStim;
    var MaxedHealth;
    var CurrentHealth;
}
//Area tiles and RNG
{
    var rngA = function(n) {
        var resA = Math.round(Math.random() * n);
        var resB = Math.round(Math.random() * n);
        var resC = Math.round((resA / 2) + (resB / 2));
        return resC;
    };
    var rSpawn = rngA(100);
    var playerX;
    var playerY;
    var merchSpawn = rngA(100);
    var fixArea = [];
    var area = [];
    var counter = 0;
    for (var yy = 0; yy < 10; yy++) {
        for (var xx = 0; xx < 10; xx++) {
            counter++;
            var roomGen = [];
            var itemGen = [];
            for (var ii = 0; ii < 4; ii++) {
                var rngWeap = rngA(100);
                var abc = giveRandomWeap();
                weapList.push(abc);
                if (rngWeap < 20) {
                    itemGen.push([abc, 1]);
                } else {
                    itemGen.push([0, 0]);
                }
                var ab = document.createElement('p');
                var bc = document.createTextNode('>You took a ' + abc.name + ".");
                var ab2 = document.createElement('p');
                var bc2 = document.createTextNode('>You equipped ' + abc.name + ".");
                var ab3 = document.createElement('p');
                var bc3 = document.createTextNode('>You see a ' + abc.name + ".");
                var ab4 = document.createElement('p');
                var bc4 = document.createTextNode(">You don't have " + abc.name + ".");
                ab.appendChild(bc);
                ab.id = "message_takeItem" + abc.id;
                //ab.hidden=true;
                document.getElementsByClassName('items')[0].appendChild(ab);
                ab2.appendChild(bc2);
                ab2.id = "message_equipItem" + abc.id;
                //ab2.hidden=true;
                document.getElementsByClassName('items')[0].appendChild(ab2);
                ab3.appendChild(bc3);
                ab3.id = "message_item" + abc.id;
                //ab3.hidden=true;
                document.getElementsByClassName('items')[0].appendChild(ab3);
                ab4.appendChild(bc4);
                ab4.id = "message_noEquip" + abc.id;
                //ab4.hidden=true;
                document.getElementsByClassName('items')[0].appendChild(ab4);
            }
            if (counter == rSpawn) {
                roomGen.push(100, itemGen);
            } else if (counter == merchSpawn) {
                roomGen.push(99, itemGen);
            } else {
                roomGen.push(rngA(4), itemGen);
            }
            fixArea.push(roomGen);
        }
        area.push(fixArea);
        fixArea = [];
    }
    setInterval(function() {
        for (var i = 0; i < playerInventory.length; i++) {
            if (playerInventory[i] == 0) {
                playerInventory.splice(i, 1);
            }
        }
    }, 10);
var createNewArea=function(){
	area=[];
    var merchSpawn = rngA(100);
    var fixArea = [];
    var counter = 0;
    for (var yy = 0; yy < 10; yy++) {
        for (var xx = 0; xx < 10; xx++) {
            counter++;
            var roomGen = [];
            var itemGen = [];
            for (var ii = 0; ii < 4; ii++) {
                var rngWeap = rngA(100);
                var abc = giveRandomWeap();
                weapList.push(abc);
                if (rngWeap < 20) {
                    itemGen.push([abc, 1]);
                } else {
                    itemGen.push([0, 0]);
                }
                var ab = document.createElement('p');
                var bc = document.createTextNode('>You took a ' + abc.name + ".");
                var ab2 = document.createElement('p');
                var bc2 = document.createTextNode('>You equipped ' + abc.name + ".");
                var ab3 = document.createElement('p');
                var bc3 = document.createTextNode('>You see a ' + abc.name + ".");
                var ab4 = document.createElement('p');
                var bc4 = document.createTextNode(">You don't have " + abc.name + ".");
                ab.appendChild(bc);
                ab.id = "message_takeItem" + abc.id;
                //ab.hidden=true;
                document.getElementsByClassName('items')[0].appendChild(ab);
                ab2.appendChild(bc2);
                ab2.id = "message_equipItem" + abc.id;
                //ab2.hidden=true;
                document.getElementsByClassName('items')[0].appendChild(ab2);
                ab3.appendChild(bc3);
                ab3.id = "message_item" + abc.id;
                //ab3.hidden=true;
                document.getElementsByClassName('items')[0].appendChild(ab3);
                ab4.appendChild(bc4);
                ab4.id = "message_noEquip" + abc.id;
                //ab4.hidden=true;
                document.getElementsByClassName('items')[0].appendChild(ab4);
            }
            if (counter == rSpawn) {
                roomGen.push(100, itemGen);
            } else if (counter == merchSpawn) {
                roomGen.push(99, itemGen);
            } else {
                roomGen.push(rngA(4), itemGen);
            }
            fixArea.push(roomGen);
        }
        area.push(fixArea);
        fixArea = [];
    }
};
    /*
for(var y=0; y<area.length;y++){
	for(var x=0; x<area[y].length;x++){
		for(var i=1; i<4;i++){
			if(area[y][x][1][0][0]==area[y][x][1][4-i][0]){
				area[y][x][1][0][1]+=1;
				area[y][x][1][4-i][1]=0;
				area[y][x][1][4-i][0]=0;
			}
			if(area[y][x][1][1][0]==area[y][x][1][4-i][0]){
				area[y][x][1][1][1]+=1;
				area[y][x][1][4-i][1]=0;
				area[y][x][1][4-i][0]=0;
			}
			if(area[y][x][1][2][0]==area[y][x][1][4-i][0]){
				area[y][x][1][2][1]+=1;
				area[y][x][1][4-i][1]=0;
				area[y][x][1][4-i][0]=0;
			}
			if(area[y][x][1][3][0]==area[y][x][1][4-i][0]){
				area[y][x][1][3][1]+=1;
				area[y][x][1][4-i][1]=0;
				area[y][x][1][4-i][0]=0;
			}
		}
	}
}
*/
    for (var y = 0; y < area.length; y++) {
        for (var x = 0; x < area[y].length; x++) {
            if (area[y][x][0] === 100) {
                playerX = x;
                playerY = y;
            }
        }
    }


}
//Enemy Stat Boosts
{
    var smart = [
        "Smart ",
        0, [],
        0,
        8,
        2,
    ];
    var agile = [
        "Agile ",
        0, [],
        10,
        10,
        3,
    ];
    var tough = [
        "Tough ",
        40, [],
        0,
        15,
        5,
    ];


    var enBoosts = [
        smart,
        agile,
        tough,
    ];
    var legendary = [
        "Legendary ",
        50, [],
        20,
        50,
        20,
    ];
}
//Enemy List
{
    var turn = 1;
    var goon = [
        "Goon", //Name
        45, //HP
        giveRandomWeap(), //Item
        65, //Chance to hit
        10, //XP
        10, //Damage
    ];
    var enList = [
        goon,
    ];

    function Enemy() {
        var enStatBoost = enBoosts[rngA(enBoosts.length - 1)];
        var rndEnemy = enList[rngA(enList.length - 1)];
        var boostPrcnt = rngA(100);
        var retEnemy = [];
        for (var i = 0; i < enList[0].length; i++) {
            if (boostPrcnt < 25) {
                if (i === 2) {
                    retEnemy[2] = giveRandomWeap();
                } else if (i !== 5) {
                    retEnemy[i] = enStatBoost[i] + rndEnemy[i];
                } else if (i === 5) {
                    retEnemy[5] = enStatBoost[5] + rndEnemy[5] + retEnemy[2].damage;
                }
            } else if (boostPrcnt > 30) {
                if (i === 2) {
                    retEnemy[2] = giveRandomWeap();
                } else if (i !== 5) {
                    retEnemy[i] = rndEnemy[i];
                } else if (i === 5) {
                    retEnemy[5] = rndEnemy[5] + retEnemy[2].damage;
                }
            } else if (boostPrcnt >= 25 && boostPrcnt <= 30) {
                if (i === 2) {
                    retEnemy[2] = giveRandomWeap();
                } else if (i !== 5) {
                    retEnemy[i] = legendary[i] + rndEnemy[i];
                } else if (i === 5) {
                    retEnemy[5] = legendary[5] + rndEnemy[5] + retEnemy[2].damage;
                }
            }
        }
        return retEnemy;
    };
    // End Enemy List
}
var encounteredEnemy;
var enterBattle = 0;

function encounter() {
    var enc = rngA(100);
    if (enc < 25) {
        encounteredEnemy = Enemy();
        enterBattle = 1;
    }
    if (enc >= 25 && enc <= 100) {
        enterBattle = 0;
    }
    if (enterBattle == 1) {
	var newElement=document.createElement('p');
	    newElement.class="speakable";
	    newElement.innerHTML=">"+"You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5];
	    $(newElement).insertAfter("#place_holder").hide().fadeIn(1000);
        //alert("You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5]);
        //console.log("You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5]);
    }
};
//Items
{
    var item1;
    var item2;
    var item3;
    var item4;
    var item5;
    var item6;
    var item7;
    //End Items
}
//SPECIAL Variables
var BaseS = document.getElementById('baseS');
var BaseP = document.getElementById('baseP');
var BaseE = document.getElementById('baseE');
var BaseC = document.getElementById('baseC');
var BaseI = document.getElementById('baseI');
var BaseA = document.getElementById('baseA');
var BaseL = document.getElementById('baseL');
var BaseDD = document.getElementById('baseD');
var totalP;
var htmTP = document.getElementById("totalP");
var hideIt = document.getElementById("assignPoints");


//For calling upon  stats @ start game

function startSPECIAL() {
    BaseS = document.getElementById('baseS');
    BaseP = document.getElementById('baseP');
    BaseE = document.getElementById('baseE');
    BaseC = document.getElementById('baseC');
    BaseI = document.getElementById('baseI');
    BaseA = document.getElementById('baseA');
    BaseL = document.getElementById('baseL');
    BaseDD = document.getElementById('baseD');
};
//Are you SPECIAL?
{
    var defenceStat = 0;
    setInterval(function() {
        if (updatingSPEC == true) {
            BaseS = document.getElementById('baseS');
            BaseP = document.getElementById('baseP');
            BaseE = document.getElementById('baseE');
            BaseC = document.getElementById('baseC');
            BaseI = document.getElementById('baseI');
            BaseA = document.getElementById('baseA');
            BaseL = document.getElementById('baseL');
            BaseDD = document.getElementById('baseD');
            defenceStat = Math.floor(((BaseS.valueAsNumber / 1.5) + (BaseE.valueAsNumber / 2)) * 5);
            document.getElementById('baseD').innerHTML = "Defence:" + defenceStat.toString();
            BaseS.min = 1;
            BaseP.min = 1;
            BaseE.min = 1;
            BaseC.min = 1;
            BaseI.min = 1;
            BaseA.min = 1;
            BaseL.min = 1;
            totalP = 41 - (BaseS.valueAsNumber + BaseP.valueAsNumber + BaseE.valueAsNumber + BaseC.valueAsNumber + BaseI.valueAsNumber + BaseA.valueAsNumber + BaseL.valueAsNumber);
            if (BaseS.value == "") {
                BaseS.value = 1;
            }
            if (BaseP.value == "") {
                BaseP.value = 1;
            }
            if (BaseE.value == "") {
                BaseE.value = 1;
            }
            if (BaseC.value == "") {
                BaseC.value = 1;
            }
            if (BaseI.value == "") {
                BaseI.value = 1;
            }
            if (BaseA.value == "") {
                BaseA.value = 1;
            }
            if (BaseL.value == "") {
                BaseL.value = 1;
            }
            //S valueAsNumber fix
            if (BaseS.valueAsNumber < 0) {
                BaseS.value = 1;
            }
            if (BaseP.valueAsNumber < 0) {
                BaseP.value = 1;
            }
            if (BaseE.valueAsNumber < 0) {
                BaseE.value = 1;
            }
            if (BaseC.valueAsNumber < 0) {
                BaseC.value = 1;
            }
            if (BaseI.valueAsNumber < 0) {
                BaseI.value = 1;
            }
            if (BaseA.valueAsNumber < 0) {
                BaseA.value = 1;
            }
            if (BaseL.valueAsNumber < 0) {
                BaseL.value = 1;
            }
            //Over powering fix
            if (BaseS.valueAsNumber > totalP - 1) {
                BaseS.max = totalP;
            }
            if (BaseP.valueAsNumber > totalP - 1) {
                BaseP.max = totalP;
            }
            if (BaseE.valueAsNumber > totalP - 1) {
                BaseE.max = totalP;
            }
            if (BaseC.valueAsNumber > totalP - 1) {
                BaseC.max = totalP;
            }
            if (BaseI.valueAsNumber > totalP - 1) {
                BaseI.max = totalP;
            }
            if (BaseA.valueAsNumber > totalP - 1) {
                BaseA.max = totalP;
            }
            if (BaseL.valueAsNumber > totalP - 1) {
                BaseL.max = totalP;
            }
            //
            if (BaseS.valueAsNumber > 10) {
                BaseS.valueAsNumber = 1;
            }
            if (BaseP.valueAsNumber > 10) {
                BaseP.valueAsNumber = 1;
            }
            if (BaseE.valueAsNumber > 10) {
                BaseE.valueAsNumber = 1;
            }
            if (BaseC.valueAsNumber > 10) {
                BaseC.valueAsNumber = 1;
            }
            if (BaseI.valueAsNumber > 10) {
                BaseI.valueAsNumber = 1;
            }
            if (BaseA.valueAsNumber > 10) {
                BaseA.valueAsNumber = 1;
            }
            if (BaseL.valueAsNumber > 10) {
                BaseL.valueAsNumber = 1;
            }
            BaseS.max = 10;
            BaseP.max = 10;
            BaseE.max = 10;
            BaseC.max = 10;
            BaseI.max = 10;
            BaseA.max = 10;
            BaseL.max = 10;
            htmTP.innerHTML = totalP;

            if (totalP < 0) {
                BaseS.valueAsNumber = 1;
                BaseP.valueAsNumber = 1;
                BaseE.valueAsNumber = 1;
                BaseC.valueAsNumber = 1;
                BaseI.valueAsNumber = 1;
                BaseA.valueAsNumber = 1;
                BaseL.valueAsNumber = 1;
            }
            if (totalP === 0 && clickedButton) {
		Class=document.getElementById('backgroundSelection').value;
                updatingSPEC = false;
            }
        } else {
            hideIt.hidden = true;
        }
    }, 10);
}
//Game Machinecs
{
    setInterval(function() {
        equipedWeapon = equipItem;
    }, 10);
    CurrentHealth = 100;
    setInterval(function() {
        curDmg = equipedWeapon.damage;
        HealAmount = ((BaseI.valueAsNumber * 5) + 20);
        StimDropRate = ((BaseL.valueAsNumber / 5) + 1) * 10;
        MaxedHealth = ((BaseE.valueAsNumber * 10) + 100);
        var headledMessage = document.getElementById("useBandage");
        headledMessage.innerHTML = "> Bandage used " + HealAmount + " HP healed.";
    }, 10);
}
//Stat Changes During game
{



    var htmSA = document.getElementsByClassName("htmS");
    var htmPA = document.getElementsByClassName("htmP");
    var htmEA = document.getElementsByClassName("htmE");
    var htmCA = document.getElementsByClassName("htmC");
    var htmIA = document.getElementsByClassName("htmI");
    var htmAA = document.getElementsByClassName("htmA");
    var htmLA = document.getElementsByClassName("htmL");
    var htmDA = document.getElementsByClassName("htmD");
    var htmCurrentHealth = document.getElementsByClassName("htmHealth");
    var htmCaps = document.getElementsByClassName("playerCaps");

    function updateStats() {
        defenceStat = Math.floor(((BaseS.valueAsNumber / 1.5) + (BaseE.valueAsNumber / 2)) * 5);
        for (var i = 0; i < htmSA.length; i++) {
            htmSA[i].innerHTML = "Strength:.............." + BaseS.value;
            htmPA[i].innerHTML = "Perception:............" + BaseP.value;
            htmEA[i].innerHTML = "Endurance:............." + BaseE.value;
            htmCA[i].innerHTML = "Charisma:.............." + BaseC.value;
            htmIA[i].innerHTML = "Intelligence:.........." + BaseI.value;
            htmAA[i].innerHTML = "Agility:..............." + BaseA.value;
            htmLA[i].innerHTML = "Luck:.................." + BaseL.value;
            htmDA[i].innerHTML = "Defence:..............." + defenceStat.toString();
            htmCurrentHealth[i].innerHTML = "Current Health:........" + CurrentHealth + "/" + MaxedHealth;
            htmCaps[i].innerHTML = "Caps..................." + currentCaps;
            htmTP.innerHTML = totalP;
        }
    };
    //End ingame stat changes
}
//Notes on enemies
{

    //Enemy Tiers
    //String[1] LowEnemies = {"Feral Goon","Savage","Psycho","Rabid Stag","Rookie Hitman"};
    //var LowEnemyMaxHealth = 25;
    //var LowEnemyMaxDmg = 7; 
    //String[2] MidEnemies = {"Irradiated Stag","Irradiated Bear","Amateur Hitman"};
    //var MidEnemyMaxHealth = 50;
    //var MidEnemyMaxDmg =  15; 
    //String[3] HighEnemies = {"Human Hunter","Alpha Wolf","Alpha Stag","Alpha Bear","Professional Hitman"};
    //var HighEnemyMaxHealth = 100;
    //var HighEnemyMaxDmg = 25; 

    //end notes
}
setInterval(function(){
	if(enterBattle==1){
		if(turn===-1){
			if(encounteredEnemy[1]>0){
				var tempBRNG=rngA(100);
				if(tempBRNG>(30+(BaseA.valueAsNumber*2)+(floor(BaseL.valueAsNumber*1.5)))){	//You get attacked
					var damageTaken=encounteredEnemy[5]-defenceStat;
					if(damageTaken<0){
						damageTaken=0;
					}
					CurrentHealth-=damageTaken;
					var newElement2=document.createElement('p');
					newElement2.class="speakable";
					newElement2.innerHTML=">"+"You were hit by the "+encounteredEnemy[0]+" with a "+encounteredEnemy[2].name+" for "+damageTaken+" damage.";
					$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
				}else{
					var newElement2=document.createElement('p');
					newElement2.class="speakable";
					newElement2.innerHTML=">"+encounteredEnemy[0]+" missed.";
					$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
				}
			}else{
				var newElement2=document.createElement('p');
				newElement2.class="speakable";
				newElement2.innerHTML=">You killed the "+encounteredEnemy[0]+".";
				$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
				enterBattle=0;
				turn=1;
			}
			if(CurrentHealth<0){
				var lastwords=prompt("YOU DIED!\nAny final words?","");
				var thisUser=firebase.auth().currentUser.uid;
				firebase.database().ref('deathMessages/'+playerY+'/'+playerX+'/'+thisUser).set({deathText:lastwords.toString()});
				closePage();
			}
			turn*=-1;
		}else{
			if(CurrentHealth<0){
				var lastwords=prompt("YOU DIED!\nAny final words?","");
				var thisUser=firebase.auth().currentUser.uid;
				firebase.database().ref('deathMessages/'+playerY+'/'+playerX+'/'+thisUser).set({deathText:lastwords.toString()});
				closePage();
			}	
		}
	}else{
		if(CurrentHealth<0){
			var lastwords=prompt("YOU DIED!\nAny final words?","");
			var thisUser=firebase.auth().currentUser.uid;
			firebase.database().ref('deathMessages/'+playerY+'/'+playerX+'/'+thisUser).set({deathText:lastwords.toString()});
			closePage();
		}
	}
},10);

    //"You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5]
    /** 
     * Reserved for combat
     **/

setInterval(function() {
    $('blink').each(function() {
        $(this).css('visibility', $(this).css('visibility') === 'hidden' ? '' : 'hidden')
    });
}, 250);

function updateText() {
    var inText = document.getElementById("command_line").value;
    var dispText = document.getElementById("dispText");
    var blinking = document.getElementById("blinking").innerHTML;
    dispText.innerHTML = blinking + inText;
}; { //Room Message
    function room() {
        canTrade = false;
        if (area[playerY][playerX][0] == 99) {
            canTrade = true;
            $("#message_room99").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
        } else if (area[playerY][playerX][0] == 5) {
            $("#message_vaultReturn").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
        } else {
            $("#message_room"+(area[playerY][playerX][0]+1)).clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
        }
    };
}
var inventory = document.getElementById('messageInventory');

function checkItem() {
    this.foundSomething=false;
    for (var i = 0; i < 4; i++) {
        if (area[playerY][playerX][1][i][1] == 1) {
            $("#message_item" + area[playerY][playerX][1][i][0].id).clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
            this.foundSomething=true;
        }
    }
    if(!this.foundSomething){
        $("#message_nothing").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
        return
    }
};
var itemBefore = "";
var itemAfter = "";
//area[playerY][playerX][1][i][0]

function updateInventory() {
    itemBefore = "";
    itemAfter = "";
    for (var i = 1; i < playerInventory.length; i++) {
        itemBefore = playerInventory[i][0].name + "s:.." + playerInventory[i][1] + "..||.Damage:.." + playerInventory[i][0].damage + " ...||.Value:.." + playerInventory[i][0].value + " caps" + "<br>";
        itemAfter = itemAfter + itemBefore;
        inventory.innerHTML = itemAfter;
    }
};
var sayMyName = document.getElementById('dispName'); { //Inputs and Commands

    setInterval(updateText(), 10);
    setInterval(updateStats(), 10);
    setInterval(updateInventory(), 10);

    function dispInv() {
        updateInventory();
        document.getElementById('messageInventory').innerHTML = itemAfter;
        $("#messageInventory").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
    };

    function dispStats() {
        updateStats();
        $("#display_stats").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
    };
    var newInput;
    var i = 0;

    var prefixList = ["equip", "inventory", "use", "look", "go", "help", "take", "stats", "read", "done", "buy", "sell", "attack", "burst"];
    var prefixList2 = ["note", "stick", "north", "west", "east", "south", "left", "right", "up", "down", "around", "bandage", "2", "3", "4", "5", "6"];
    var prefixInputCheck = function() {
        this.check = true;
        for (var i = 0; i < prefixList.length; i++) {
            if (prefix.toLowerCase() === prefixList[i] && this.check === true) {
                this.check = false;
            }
        }
        if (this.check === true) {
            return true;
        } else {
            return false;
        }
    };
    var itemInputCheck = function() {
        this.check = true;
        for (var i = 0; i < prefixList2.length; i++) {
            if (item.toLowerCase() === prefixList2[i] && this.check === true) {
                this.check = false;
            }
        }
        if (this.check === true) {
            return true;
        } else {
            return false;
        }
    };
    var weapInputCheck = function() {
        this.check = true;
        for (var i = 0; i < playerInventory.length; i++) {
            if (item.toLowerCase() === playerInventory[i][0].name.toLowerCase() && this.check === true) {
                this.check = false;
            }
        }
        if (this.check === true) {
            return true;
        } else {
            return false;
        }
    };
    var checkData=function(){
        var appendedConfirmText="";
        var savedData=function(){getData("gamedata");return loadedData};
        for(var storageLength in savedData){
            if(storageLength=="playerName"||storageLength=="stats"||storageLength=="inventory"||storageLength=="currentCaps"){
                if(storageLength=="inventory"){
                    for(var invLength = 0; invLength < savedData.inventory.length; invLength++){
                        appendedConfirmText+="\n"+savedData[storageLength][invLength][1]+" "+savedData[storageLength][invLength][0].name+": "+savedData[storageLength][invLength][0].value+" caps";
                    }
                }else if(storageLength=="stats"){
                    for(var statLength in savedData[storageLength]){
                        appendedConfirmText+="\n"+statLength+": "+savedData[storageLength][statLength];
                    }
                }else{
                    appendedConfirmText+="\n"+storageLength+": "+savedData[storageLength];
                }
            }
        }
        return appendedConfirmText;
    };
    var saveGame=function(){
        if(checkStorage()){
            if(confirm("Overwrite current game data?"+checkData())){
                var gameData={};
                gameData.area=area;
                gameData.playerX=playerX;
                gameData.playerY=playerY;
                gameData.inventory=playerInventory;
                gameData.currentCaps=currentCaps;
                gameData.playerName=playerName;
                gameData.textHistory=document.getElementById('console').innerHTML;
                gameData.stats={};
                gameData.stats.Strength=BaseS.valueAsNumber;
                gameData.stats.Perception=BaseP.valueAsNumber;
                gameData.stats.Endurance=BaseE.valueAsNumber;
                gameData.stats.Charisma=BaseC.valueAsNumber;
                gameData.stats.Intelligence=BaseI.valueAsNumber;
                gameData.stats.Agility=BaseA.valueAsNumber;
                gameData.stats.Luck=BaseL.valueAsNumber;
                gameData.totalP=totalP;
                gameData.CurrentHealth=CurrentHealth;
		gameData.Class=Class;
		firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
			gamedata: gameData
		});
            }
        }else{
            var gameData={};
            gameData.area=area;
            gameData.playerX=playerX;
            gameData.playerY=playerY;
            gameData.inventory=playerInventory;
            gameData.currentCaps=currentCaps;
            gameData.playerName=playerName;
            gameData.textHistory=document.getElementById('console').innerHTML;
            gameData.stats={};
            gameData.stats.Strength=BaseS.valueAsNumber;
            gameData.stats.Perception=BaseP.valueAsNumber;
            gameData.stats.Endurance=BaseE.valueAsNumber;
            gameData.stats.Charisma=BaseC.valueAsNumber;
            gameData.stats.Intelligence=BaseI.valueAsNumber;
            gameData.stats.Agility=BaseA.valueAsNumber;
            gameData.stats.Luck=BaseL.valueAsNumber;
	    gameData.totalP=totalP;
            gameData.CurrentHealth=CurrentHealth;
		gameData.Class=Class;
		firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
			gamedata: gameData
		});
        }
    };
    var loadGame=function(){
        if(checkStorage()){
		getData("gamedata");
            var loadData=loadedData;
		updatingSPEC=false;
            area=loadData.area;
            playerX=loadData.playerX;
            playerY=loadData.playerY;
            playerInventory=loadData.inventory;
            currentCaps=loadData.currentCaps;
            playerName=loadData.playerName;
            BaseS.value=loadData.stats.Strength;
            BaseP.value=loadData.stats.Perception;
            BaseE.value=loadData.stats.Endurance;
            BaseC.value=loadData.stats.Charisma;
            BaseI.value=loadData.stats.Intelligence;
            BaseA.value=loadData.stats.Agility;
            BaseL.value=loadData.stats.Luck;
            CurrentHealth=loadData.CurrentHealth;
		Class=loadData.Class;
            done=1;
            document.getElementById('command_line').value=loadData.playerName;
            $("form").submit();
            document.getElementById('console').innerHTML=loadData.textHistory;
            BaseS.value=loadData.stats.Strength;
            BaseP.value=loadData.stats.Perception;
            BaseE.value=loadData.stats.Endurance;
            BaseC.value=loadData.stats.Charisma;
            BaseI.value=loadData.stats.Intelligence;
            BaseA.value=loadData.stats.Agility;
            BaseL.value=loadData.stats.Luck;
		Class=loadData.Class;
        }else{
            alert("No save data available.");
        }
    };
    var removeGameData=function(){
        if(checkStorage()){
            if(confirm("Are you sure you want to delete you save data?"+checkData())){
                firebase.database().ref('/users/' + firebase.auth().currentUser.uid+"/gamedata").remove();
                alert('Save data deleted.');
            }
        }else{
            alert("No save data available.");
        }
    };
    /**
     * Reserved for combat
    **/
    if(enableCombat){
        eval("var inCombat=function(){}");
    }
    //"You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5]
    /** 
     * Reserved for combat
     **/
    $(document).ready(function() {
        $("#console").hide().fadeIn(1000);
        $("form").submit(function() {
            sellCheck = false;
            stopCounting = false;
            j = 0;
            var i = 0;
            var input = newInput;
            for (var i = 0; i < input.length; i++) {
                if (input.substr(i, 1) == " " && stopCounting == false) {
                    j = i;
                    stopCounting = true;
                } else {
                    if (input.substr(i, 1) !== " " && stopCounting == false) {
                        j += 1;
                    }
                }
            }
            prefix = input.substr(0, j);
            item = input.substr(j + 1, input.length);
            if (done !== 1) {
                playerName = input;
                startMSG.innerHTML = '>' + playerName + ' messed up this time, the overseer walked in on ' + playerName + ' sleeping with his daughter.\n' + 'That salty old ******* is kicking ' + playerName + ' out into the wasteland to be. As ' + playerName + ' approached\n' + 'the vault door. A dim beam of light from a crack in ceiling reveals a a wooden stick\n' + 'on the floor next to a note with the name ' + playerName + ' on it...';
                document.getElementById('start').hidden = false;
                sayMyName.innerHTML += playerName;
                done = 1;
            } else {
                if (prefix.toLowerCase() == "help") {
                    $("#message_help").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                }
                if (prefix.toLowerCase() == "read") {
                    if (item.toLowerCase() == "note" && note1 == true) {
                        $("#message_readnote1").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                    }
                }
                if (prefix.toLowerCase() == "look") {
                    if (item.toLowerCase() == "around") {
                        checkItem();
			    if(globalXY[playerY]!==undefined){
				    if(globalXY[playerY][playerX]!==undefined){
					for(var i in globalXY[playerY][playerX]){
						var deathRNG=rngA(Object.keys(globalXY[playerY][playerX]).length);
						if(deathRNG===rngA(Object.keys(globalXY[playerY][playerX]).length)){
							if(globalXY[playerY][playerX][i].deathText!==undefined){
								var checkDeadPlayer=function(){
									if(getPlayername(i)!=="undefined" && getPlayername(i)!=="null" && getPlayername(i)!==undefined && getPlayername(i)!==null){
										return true;
									}else{
										return false;
									}
								};
								setInterval(function(){
									getPlayername(i);
								},10,checkDeadPlayer());
								if(checkDeadPlayer()){
									var newElement4=document.createElement('p');
									newElement4.class="speakable";
									console.log(getPlayername(i));
									newElement4.innerHTML=">"+getPlayername(i)+": "+globalXY[playerY][playerX][i].deathText+".";
									$(newElement4).insertAfter("#place_holder").hide().fadeIn(1000);
								}
							}else{
								var newElement4=document.createElement('p');
								newElement4.class="speakable";
								newElement4.innerHTML=">No signs of other players.";
								$(newElement4).insertAfter("#place_holder").hide().fadeIn(1000);
							}
						}
					}
				    }
			    }
                    }
                }
                if (prefix.toLowerCase() == "take") {
                    if (item.toLowerCase() == "note" && area[playerY][playerX][0] === 100 && note1 == false) {
                        note1 = true;
                        $("#message_takenote1").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                    }
                    if (item.toLowerCase() == "") {
                        $("#message_take").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                    }
                    //for(var j=0;j<weapList.length;j++){
                    for (var i = 0; i < 4; i++) {
                        var fix = false;
                        if (area[playerY][playerX][1][i][0].name === undefined && area[playerY][playerX][1][i][0] !== 0) {
                            return false;
                        } else if (area[playerY][playerX][1][i][0].name === undefined && area[playerY][playerX][1][i][0] === 0 && area[playerY][playerX][1][i][1] !== 0) {
                            fix = item;
                        } else if (area[playerY][playerX][1][i][0] !== 0) {
                            fix = area[playerY][playerX][1][i][0].name.toLowerCase();
                        }
                        if (item.toLowerCase() == fix && area[playerY][playerX][1][i][1] > 0) {
                            var checkFix = false;
                            var mFix = 0;
                            $("#message_takeItem" + area[playerY][playerX][1][i][0].id).clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                            for (var m = 0; m < playerInventory.length; m++) {
                                if (playerInventory[m][0].name.toLowerCase() == item) {
                                    if (playerInventory[m][1] > 0) {
                                        checkFix = true;
                                        mFix = m;
                                    }
                                } else {
                                    checkFix = false;
                                }
                            }
                            if (checkFix) {
                                playerInventory[mFix][1]++;
                            } else {
                                playerInventory.push([area[playerY][playerX][1][i][0], 1]);
                            }
                            area[playerY][playerX][1][i][1] = 0;
                            area[playerY][playerX][1][i][0] = 0;
                        }
                    }
                    //}
                }
                if (prefix.toLowerCase() == "inventory") {
                    dispInv();
                }
                if(enterBattle==0){
                    if (prefix.toLowerCase() == "go") {
                        if (playerY !== 0) {
                            if (item.toLowerCase() == "north" || item.toLowerCase() == "up") {
                                playerY -= 1;
                                room();
                                if(area[playerY][playerX][0] !== 99){
                                    encounter();
                                }
                            }
                        }else{
                            if (item.toLowerCase() == "north" || item.toLowerCase() == "up") {
				createNewArea();
                                playerY = 9;
                                room();
                                if(area[playerY][playerX][0] !== 99){
                                    encounter();
                                }
                            }
			}
                        if (playerY !== 9) {
                            if (item.toLowerCase() == "south" || item.toLowerCase() == "down") {
                                playerY += 1;
                                room();
                                if(area[playerY][playerX][0] !== 99){
                                    encounter();
                                }
                            }
                        }else{
                            if (item.toLowerCase() == "south" || item.toLowerCase() == "down") {
				createNewArea();
                                playerY = 0;
                                room();
                                if(area[playerY][playerX][0] !== 99){
                                    encounter();
                                }
                            }
			}
                        if (playerX !== 9) {
                            if (item.toLowerCase() == "east" || item.toLowerCase() == "right") {
                                playerX += 1;
                                room();
                                if(area[playerY][playerX][0] !== 99){
                                    encounter();
                                }
                            }
                        }else{
                            if (item.toLowerCase() == "east" || item.toLowerCase() == "right") {
				createNewArea();
                                playerX = 0;
                                room();
                                if(area[playerY][playerX][0] !== 99){
                                    encounter();
                                }
                            }
			}
                        if (playerX !== 0) {
                            if (item.toLowerCase() == "west" || item.toLowerCase() == "left") {
                                playerX -= 1;
                                room();
                                if(area[playerY][playerX][0] !== 99){
                                    encounter();
                                }
                            }
                        }else{
                            if (item.toLowerCase() == "west" || item.toLowerCase() == "left") {
				createNewArea();
                                playerX = 9;
                                room();
                                if(area[playerY][playerX][0] !== 99){
                                    encounter();
                                }
                            }
			}
                    }
                }else{
                    if(prefix.toLowerCase() == "flee" && turn !== -1){
                        if(item.toLowerCase() == ""){
                            var tempRNG=rngA(100);
                            if(tempRNG>(70-(BaseA.value*4))){
                                enterBattle=0;
                                turn=1;
				var newElement3=document.createElement('p');
			    	newElement3.class="speakable";
	    			newElement3.innerHTML=">You successfully fled.";
	    			$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
                            }else{
				var newElement3=document.createElement('p');
			    	newElement3.class="speakable";
	    			newElement3.innerHTML=">You failed to flee.";
	    			$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
                                turn*=-1;
                            }
                        }
                    }
                    if(prefix.toLowerCase() == "attack" && turn !== -1){
                        if(item.toLowerCase() == ""){
                            var tempRNG=rngA(100);
                            if(tempRNG<=encounteredEnemy[3]+BaseL.valueAsNumber){
				var newElement3=document.createElement('p');
			    	newElement3.class="speakable";
	    			newElement3.innerHTML=">You hit the "+encounteredEnemy[0]+" for "+equipedWeapon.damage+" damage.";
				    if(equipedWeapon.damage===undefined){
					encounteredEnemy[1]-=equipedWeapon[0].damage;
				    }else{
				    	encounteredEnemy[1]-=equipedWeapon.damage;
				    }
	    			$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
                                turn*=-1;
                            }else{
				var newElement3=document.createElement('p');
			    	newElement3.class="speakable";
	    			newElement3.innerHTML=">You missed the "+encounteredEnemy[0]+".";
	    			$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
                                turn*=-1;
                            }
                        }
                    }
			
                    if(prefix.toLowerCase() == "burst" && turn !== -1){
			    if(equipedWeapon[0].type.toLowerCase() == "smg"){
                        	if(item.toLowerCase() == "2" || item.toLowerCase() == "3" || item.toLowerCase() == "4" || item.toLowerCase() == "5" || item.toLowerCase() == "6"){
					for(var smgLoop=0;smgLoop<parseInt(item.toLowerCase());smgLoop++){
					    var tempRNG=rngA(100);
					    if(tempRNG<=(encounteredEnemy[3]+BaseL.valueAsNumber)-(parseInt(item.toLowerCase())*2)){
						var newElement3=document.createElement('p');
						newElement3.class="speakable";
						newElement3.innerHTML=">You hit the "+encounteredEnemy[0]+" for "+equipedWeapon[0].damage+" damage.";
						    encounteredEnemy[1]-=equipedWeapon[0].damage;
						$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
					    }else{
						var newElement3=document.createElement('p');
						newElement3.class="speakable";
						newElement3.innerHTML=">You missed the "+encounteredEnemy[0]+".";
						$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
					    }
					}
                                	turn*=-1;
                        	}
		    	}else{
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML=">Equipped weapon is not an SMG.";
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
		    	}
		}
			if (prefix.toLowerCase() == "use" && turn !== -1) {
			    if (item.toLowerCase() == "bandage" && items[7][2] > 0) {
				items[7][2] -= 1;
				$("#useBandage").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
				CurrentHealth = constrain(CurrentHealth+HealAmount,0,MaxedHealth);
				turn*=-1;
			    }
			}
			if (prefix.toLowerCase() == "equip" && turn !== -1) {
			    for (var i = 0; i < playerInventory.length; i++) {
				if (item.toLowerCase() == playerInventory[i][0].name.toLowerCase() && playerInventory[i][1] > 0) {
				    $("#message_equipItem" + playerInventory[i][0].id).clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
				    equipItem = playerInventory[i];
					turn*=-1;
				}
				if (item.toLowerCase() == playerInventory[i][0].name.toLowerCase() && playerInventory[i][1] == 0) {
				    $("#message_noEquipItem" + playerInventory[i][0].id).clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
				}
			    }
			}
                }
                if (prefix.toLowerCase() == "stats") {
                    if (item.toLowerCase() == "") {
                        dispStats();
                    }
                }
                if (prefix.toLowerCase() == "done" && updatingSPEC == true) {
                    if (item.toLowerCase() == "") {
                        $("#display_stats").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                        $("#display_statsDone").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                        updatingSPEC = false;
                    }
                }
		if(enterBattle!==1){
			if (prefix.toLowerCase() == "use") {
			    if (item.toLowerCase() == "bandage" && items[7][2] > 0) {
				items[7][2] -= 1;
				$("#useBandage").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
				CurrentHealth += HealAmount;
			    }
			}
			if (prefix.toLowerCase() == "equip") {
			    for (var i = 0; i < playerInventory.length; i++) {
				if (item.toLowerCase() == playerInventory[i][0].name.toLowerCase() && playerInventory[i][1] > 0) {
				    $("#message_equipItem" + playerInventory[i][0].id).clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
				    equipItem = playerInventory[i];
				}
				if (item.toLowerCase() == playerInventory[i][0].name.toLowerCase() && playerInventory[i][1] == 0) {
				    $("#message_noEquipItem" + playerInventory[i][0].id).clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
				}
			    }
			}
		}
                if (input !== "done" && input !== "attack" && input !== "burst" && input !== "stats" && input !== "help" && prefixInputCheck() !== true && itemInputCheck() !== true && weapInputCheck() !== true) {
                    watList.push($("#message_wat").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000));
                }
                if (prefix.toLowerCase() == "done" && updatingSPEC == false) {
                    $("#2late").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                }
            }
            $("#command_line").val("");
            checkChange();
        });
    });
}
