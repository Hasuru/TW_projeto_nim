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
var board;
var difficulty = 4;
var executionCount = 0;

var elementsAt = new Array();
var constBoard = new Array();
var cancelClick = new Array(); 

var game //game id retornado pelo servidor

// flags
var modeFlag;
var diffFlag;

function selectedDiff(easy, medium, hard, extreme) {
    if (easy) return 1;
    if (medium) return 2;
    if (hard) return 3;
    if (extreme) return 4;
    return 0;

}

function verifyGameSettings() {
        // verificar board
        board = document.getElementsByClassName("board");
        width = document.querySelector('#board_width').valueAsNumber;

        //verificar modo
        let singlePlayer = document.getElementById('single_player').checked;
        let multiPlayer = document.getElementById('multi_player').checked;
    
        //verificar diff
        let easy = document.getElementById('easy_diff').checked;
        let medium = document.getElementById('medium_diff').checked;
        let hard = document.getElementById('hard_diff').checked;
        let extreme = document.getElementById('extreme_diff').checked;

        if (width == 0) {
            alert("Invalid width value");
            return false;
        }
    
        if (singlePlayer) {
            diffFlag = selectedDiff(easy, medium, hard, extreme);
            if (diffFlag == 0) {
                alert("No difficulty selected");
                return false;
            }

            modeFlag = 1;
        }
    
        if (!multiPlayer && !singlePlayer) {
            alert("No mode selected");
            return false;
        }

        if (multiPlayer) modeFlag = 2;

        return true;
}

function createGame() {
    //console.log("entrou createGame");
    if (!verifyGameSettings()) return false;
    createBoard();
}

function createBoard(){
    //console.log("entrou createBoard")


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
            board[0].appendChild(row);
            maxcols+=2;
        }
        executionCount++;
    }
}

function childRemover(pile, quantity){
    var rw = board[0].children;
    
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


// server & communication
const baseurl = "http://twserver.alunos.dcc.fc.up.pt:8008";
const group = 21;

function action_register() {
    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log("Register -> nick:"+nick+" |password:"+password);

    // Nao ha data para autenticacao
    if (!nick || !password) throw new TypeError("User not registered");

    // esta tudo bem, podemos fazer pedido
    API_register(nick, password);
}

async function API_register(nick, password) {
    let url = baseurl + '/register'
    let object = {nick: nick, password: password};
    let request = JSON.stringify(object);

    await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: request
    })
        .then((response) => {
            if (!response.ok) {
                // verificar se nao houve problemas com o envio do servidor
                throw new TypeError("SERVER ERROR:" + response.status);
            } else  {
                const ContentType = response.headers.get('content-type');
                if (!ContentType || !ContentType.includes('application/json')) throw new TypeError("JSON not found");
                // retornar traducao do json para o campo data
                response.json();
            }
        })
        .then((data) => {
            // fazer coisas com a data
            console.log(data);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        })
}

function action_join() {
    if (!action_register()) return; // user nao esta autenticado

    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let size = document.getElementById('board_width').valueAsNumber;
    console.log("Group:"+group+" |nick:"+nick+" |pass:"+password+" |size:"+size);

    if (!size) throw new TypeError("Board Size not selected");

    API_join(group, nick, password, size);
}

async function API_join(group, nick, password, size) {
    let url = baseurl + '/join';
    let object = {group: group, nick: nick, password: password, size: size};
    let request = JSON.stringify(object);

    await fetch(url,  {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: {
            request
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new TypeError("SERVER SIDE ERROR:" + response.status);
            } else {
                const ContentType = response.headers.get('content-type');
                if (!ContentType || !ContentType.includes('application/json')) throw new TypeError("JSON not found");
                response.json();
            }
        })
        .then((data) => {
            game = data.game;
            if (!createGame()) {
                alert("Could not create Game");
                location.reload();
            }
            alert("Game created successfully");
        })
        .catch((error) => {
            console.error("Fetch error:" + error);
        })
}

function action_leave() {
    if (!action_register() || !game) return;

    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    API_leave(nick, password, game);
}

async function API_leave(nick, password, game) {
    let url = baseurl + '/leave';
    let object = {nick:nick, password:password, game:game};
    let request = JSON.stringify(object);

    await fetch(url, {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: request
    })
        .then((response) => {
            if (!response.ok) {
                throw new TypeError("SERVER SIDE ERROR:" + response.status);
            } else {
                const ContentType = response.headers.get('content-type');
                if (!ContentType || !ContentType.includes('application/json')) throw new TypeError("JSON not found");
                response.json();
            }
        })
        .then((data) => {
            console.log(data);
            // dar update para determinar winner:null ou winner:outro player
            action_update()
            // leave sucesso -> dar refresh a pagina
            location.reload();
        })
        .catch((error) => {
            console.error("Fetch error:" + error)
        })
}

function action_notify(stack, pieces) {
    if (!action_register() || !game) return;

    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    API_notify(nick, password, game, stack, pieces);
}

async function API_notify(nick, password, game, stack, pieces) {
    let url = baseurl + '/notify';
    let object = {nick:nick, password:password, game:game, stack:stack, pieces:pieces};
    let request = JSON.stringify(object);

    await fetch(url, {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: request
    })
        .then((response) => {
            if (!response.ok) {
                throw new TypeError("SERVER SIDE ERROR:" + response.statusText);
            } else {
                const ContentType = response.headers.get('content-type');
                if (!ContentType || !ContentType.includes('application/json')) throw new TypeError("JSON not found");
                response.json();
            }
        })
        .then((data) => {
            console.log(data);
            // dar update para atualizar board
            action_update()
        })
        .catch((error) => {
            console.error("Fetch error:" + error)
        })
}

function action_ranking() {
    if (width < 2 || width > 7) return;

    API_ranking();
}