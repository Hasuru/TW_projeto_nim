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

//--------------------------------------------------------------//
var w;

const game = document.createElement("game");
let num = document.querySelector('board_width');

// Handle number changes
num.addEventListener('input', function () {
	let val = num.valueAsNumber;
    w = val;
	//console.log(typeof val, val);
});

var el = int(w+1);
el[0] = 0;

create_game();

function create_game(){
    for(let i=1; i<=w; i++){
        el[i] = Math.pow(2,i);
        let row = document.createElement("inner_game_piece")
        for(let j=1; j<=pow(2,i)-1; j+=2){
            let elem = document.createElement("game_piece")
            row.appendChild(elem);
        }
        game.appendChild(row)
    }
}

function player_move(line, elem) {
    el[line]--;
    gb_update(line, elem);
    if(el[0]+el[1]+el[2]+el[3]==0){
        checkmate("P");
    }
    else{
        ai_move();
    }
}

function ai_move(){
    //how to connect the difficulty chosen on the html?
}

function isWinning(){
    var an,or,res;
    for(let i=1; i<=w-1; i++){
        an = (el[i] ^ el[i+1])==0;
        or = (el[i] | el[i+1])==1;
    }
    res = an^or;
    return res;
}

function random_play(){
    var ran = 0;
    while(el[ran]==0){
        ran = Math.floor(Math.random() * w) + 1;
    }
    return Math.floor(Math.random() * el[ran]) + 1;
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

function winner_move(){
    var pair = int(w+1);
    var pieces;
    for(let i=1; i<=w; i++){
        if(el[i]==0) continue;
        pieces = dec2bin(el[i]);
        for(let j=0; j<pieces.length; j++){
            pair[j] += pieces[j];
        }
        //have to finish, lacks knowing which line and how many elems to take out
    }
}

function checkmate(winner){
    if(winner=="P"){
        //update win count on leaderboard table
        alert("YOU WON, CONGRATULATIONS!!");
    }
    if(winner=="C"){
        alert("Sorry, you lost :(");
    }
    create_game();
}

function gb_update(line, elem){
    //how to manipulate a certain element for it to turn on another color and, if possible, taking out its clicking ability?
    document.getElementById("").style.backgroundColor = rgba(51, 60, 74, 1);
}
