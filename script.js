function openLog() {
    document.getElementById('logNav').style.display = 'block';
}

function closeLog() {
    document.getElementById('logNav').style.display = 'none';
}

function openRules() {
    document.getElementById('ruleNav').style.display = 'block';
}

function closeRules() {
    document.getElementById('ruleNav').style.display = 'none';
}

var width;
var maxcols; 
var game;
var difficulty = 4;
var executionCount = 0;
var elementsAt = new Array();
var constBoard = new Array();
var cancelClick = new Array(); 
const baseurl = "http://twserver.alunos.dcc.fc.up.pt:8008";

window.addEventListener('load', createGame)

function createGame(){
    game = document.getElementsByClassName("board");
    let currentWidth = document.querySelector('#board_width');

    // Handle number changes
    width = currentWidth.valueAsNumber;

    /* DEBUG N Elementos ativos
    currentWidth.addEventListener('input', function () {
        let value = currentWidth.valueAsNumber;
        width = value;
        //console.log(typeof val, val);
    });*/

    elementsAt[0] = 0; cancelClick[0] = 0;
    if(width >= 4) maxcols=1;
    else maxcols=5;

    for(let i = 1; i <= width; i++){
        elementsAt[i] = maxcols+i*2-2;
        cancelClick[i] = 1;
    }


    // todas as rows vao virar cols entretanto
    if(executionCount == 0) {
        for(let k = 1; k <= width; k++){
            let row = document.createElement("div");
            row.className = "game_column";

            for(let l = 1; l <= maxcols ; l++){
                let piece = document.createElement("div");
                piece.id = "piece_" + k + "_" + l;
                if(width>5) piece.className = "small_column_piece";
                else piece.className = "column_piece";

                piece.onclick = function(){
                    if(cancelClick[k] == 1){
                        disabler(-1);
                        let quantity = l;
                        childRemover(k, quantity);
                        console.log("K:" + k + " quantity:" + l);

                        delay(1000).then(() => {
                            ai_move();
                            disabler(0);
                        });

                        //row.removeChild(row.lastElementChild);
                        //if(winCheck()) checkmate("P");
                    }
                } 
                
                row.appendChild(piece);
            }
            game[0].appendChild(row);
            maxcols+=2;
        }
        executionCount++;
    }
}

function childRemover(pile, quantity){
    var rw = game[0].children;
    
    var row = rw[pile-1];
    for(let j=1; j<=quantity; j++){
        elementsAt[pile]--;
        row.removeChild(row.lastElementChild);
    }
}

function disabler(pile){
    for(let i = 1; i <= width; i++){
        if(pile == -1) cancelClick[i] = -1;
        if(cancelClick[i] == 2) cancelClick[i]--;
        if(i != pile && cancelClick[i] != 0 && pile != 0) cancelClick[i] = 2;
    }
}

function player_move(pile) {
    if(cancelClick[pile]==1){
        if(elementsAt[pile]==0) cancelClick[pile] = 0;
        disabler(pile);
        if(winCheck()) checkmate("P");
    }

}

/*function endOfTurn(){
    // added board checker to see if the board was altered before disenabling the player
    disabler(-1);
    ai_move();
    disabler(0);
}*/

function winCheck(){
    var activeElements = 0;

    for(let i=1; i<=width; i++) {
        activeElements += elementsAt[i] 
    }

    console.log(activeElements);
    if(activeElements == 0) return true;
    else return false;
}

function ai_move(){
    if(winCheck()) checkmate("P");
    var chance = document.querySelector('input[name="diff"]:checked').value;
    var rn = Math.floor(Math.random() * 10) + 1;
    if(rn>chance) random_play();
    else winner_move();
}

function isWinning(){
    var an = elementsAt[i], or = elementsAt[i], res;
    if(width>1){
    for(let i=2; i<=width; i++){
        an = (an ^ elementsAt[i])==0;
        or = (or | elementsAt[i+1])==1;
    }
    res = an^or;
    }
    else res = (an==0) ^ (or==1);
    
    return res;
}

function random_play(){
    var pile = 0, qnt=0;
    while(elementsAt[pile]==0){
        pile = Math.floor(Math.random() * width) + 1;
    }
    qnt = Math.floor(Math.random() * elementsAt[pile]) + 1;
  
    childRemover(pile, qnt);
    if(winCheck()) checkmate("C");
  }
  
function dec2bin(dec) {
    var st = ((dec >>> 0).toString(2)).split("").reverse().join("");
    console.log(dec, st);
    return dec;
}

function winner_move(){
    var pile=0, counter=0;
    var pair = new Array();
    var pieces = new Array();
    for(let i=1; i<=width; i++){
        if(elementsAt[i]==0) continue;
        pieces = dec2bin(elementsAt[i]);
        for(let j=0; j<pieces.length; j++){
            var v = pieces.charCodeAt(j)-48;
            if(v==1){
                if(pair[j]%2==0){
                    pile = i;
                    counter += Math.pow(2,j);
                } else{
                    flag = 0;
                    counter -= Math.pow(2,j);
                }
            }
            pair[j]+=v;
        }
    }

    if(counter==0) random_play(); 
    else childRemover(pile, counter);

    if(winCheck()) checkmate("C");
}

function checkmate(winner){
    if(winner=="P"){
        //update win count on leaderboard table
        alert("YOU WON, CONGRATULATIONS!!");
    }
    if(winner=="C"){
        alert("Sorry, you lost :(");
    }

    window.removeEventListener('load', createGame);
    window.addEventListener('load', createGame)
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// SERVER
/* STAND-BY
do(command, value) {
    const xhr = new XMLHttpRequest();
    const display = this.display;

    // true -> async | false -> sync
    xhr.open('POST', 'http://'+host+':'+port+'/'+command, true);
    // cabecalhos => xhr.setRequestHeader('Content-Type','text/plain');
    // pedidos a outros dominios => xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) return;
        if (xhr.status == 200) {
            display.innerText = xhr.responseText;
        } else {
            console.log(xhr.status+' '+xhr.statusMessage);
        }
    }

    xhr.send(JSON.stringify({'command': command, 'value': value}));
}*/

function action_register() {
    var user = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    API_register(user, password);
}

function API_register(nick, password){
    var url = baseurl + "/register";
    var request = {'nick':nick, 'password':password};
    var response = fetch(url, {
        method:'POST',
        body: JSON.stringify(request)
    });
    response.then((resp)=>{
        var json = resp.json();
        console.log(json);
    })
    .catch((err)=>{
        alert(err);
    });
}