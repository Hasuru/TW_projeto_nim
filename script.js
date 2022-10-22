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

var w, difficulty = 4, el = new Array(), game, execnt=0, canclk = new Array(); 

window.addEventListener('load',() => {
    game = document.getElementsByClassName("board");
    let num = document.querySelector('#board_width');

    // Handle number changes
    w = num.valueAsNumber;
    num.addEventListener('input', function () {
        let val = num.valueAsNumber;
        w = val;
        console.log(typeof val, val);
    });

    el[0] = 0;

    for(let i=1; i<=w; i++){
        el[i]=w+1-i;
        canclk[i]=1;
    }

    if(execnt==0){
        create_game();
        execnt++;
    }

    console.log(canclk[1], el[2]);
});

function create_game(){
    var maxcols=1, wr=9;
    //9 as a limit for a better gameplay
    for(let i=1; i<wr; i++){
        let col = document.createElement("div");
        col.className = "inner_game_piece";
        for(let j=1; j<=maxcols; j++){
            let elem = document.createElement("div");
            elem.className = "game_piece";
            elem.onclick = function(){player_move(j,elem);}
            col.appendChild(elem);
        }
        game[0].appendChild(col);
        if(maxcols<w) maxcols++;
    }
}

function disenabler(col){
    for(let i=1; i<=w; i++){
        if(canclk[i]==2) canclk[i]--;
        if(i!=col && canclk[i]!=0 && col!=0) canclk[i]=2;
    }
}

function player_move(col, elem) {
    if(canclk[col]==1){
        el[col]--;
        disenabler(col);
        gb_update(elem);
        var activelems = 0; 
        for(let i=1; i<=w; i++){activelems += i }
        if(activelems==0){
            checkmate("P");
        }
        else{
            ai_move();
        }
    }
}

function diff_select(){
    var subm;
    subm = document.getElementsByName('diff');

    for(let i=0; i<4; i++){
        if(subm[i] = checked){
            diff = subm[i].value;
            break;
        }
    }

    console.log(difficulty);
}

function ai_move(){
    var activelems = 0; 
    for(let i=1; i<=w; i++){activelems += i }
    if(activelems==0){
        checkmate("P");
    }
    var chance;
    //to finish
}

function isWinning(){
    var an = el[i], or = el[i], res;
    if(w>1){
    for(let i=2; i<=w; i++){
        an = (an ^ el[i])==0;
        or = (or | el[i+1])==1;
    }
    res = an^or;
    }
    else res = (an==0) ^ (or==1);
    
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
    document.location.reload();
}

function gb_update(elem){
    //how to manipulate a certain element for it to turn on another color and, if possible, taking out its clicking ability?
    elem.style.backgroundColor = "rgb(131, 128, 135)";
    elem.onclick = null;
}