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

var w, difficulty = 4, el = new Array(), game, execnt=0, maxcols, canclk = new Array(); 

window.addEventListener('load',() => {
    game = document.getElementsByClassName("board");
    let num = document.querySelector('#board_width');

    // Handle number changes
    w = num.valueAsNumber;
    num.addEventListener('input', function () {
        let val = num.valueAsNumber;
        w = val;
        //console.log(typeof val, val);
    });

    el[0] = 0; canclk[0] = 0;
    if(w>=4) maxcols=1;
        else maxcols=5;

    for(let i=1; i<=w; i++){
        el[i]=maxcols+i*2-2;
        canclk[i]=1;
    }

    if(execnt==0){
        var msz=2*w-1;
        for(let k=1; k<=w; k++){
            let row = document.createElement("div");
            row.className = "inner_game_piece";
            for(let l=1; l<=maxcols; l++){
                let elem = document.createElement("div");
                elem.className = "game_piece";
                elem.onclick = function(){
                    if(canclk[k]==1){
                        player_move(k);
                        row.removeChild(row.lastElementChild);
                        if(winCheck()) checkmate("P");
                    }
                }
                row.appendChild(elem);
            }
            game[0].appendChild(row);
            maxcols+=2;
        }
        execnt++;
    }
});

function disenabler(pile){
    for(let i=1; i<=w; i++){
        if(pile==-1) canclk[i]=-1;
        if(canclk[i]==2) canclk[i]--;
        if(i!=pile && canclk[i]!=0 && pile!=0) canclk[i]=2;
    }
}

function player_move(pile) {
    if(canclk[pile]==1){
        el[pile]--;
        if(el[pile]==0) canclk[pile] = 0;
        disenabler(pile);
        if(winCheck()) checkmate("P");
    }
}

function endOfTurn(){
    disenabler(-1);
    ai_move();
    disenabler(0);
}

function winCheck(){
    var activelems=0;
    for(let i=1; i<=w; i++){activelems += el[i] }
    console.log(activelems);
    if(activelems==0) return true;
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
    var pile = 0, qnt=0;
    while(el[pile]==0){
        pile = Math.floor(Math.random() * w) + 1;
    }
    qnt = Math.floor(Math.random() * el[ran]) + 1;

    var gm = game[0].getElementsByTagName("div");
    for(let i=1; i<gm.length; i++){
        if(i==pile){
            var rw = gm[i].getElementsByTagName("div");
            for(let j=1; j<=qnt; j++){
                el[pile]--;
                rw.removeChild(rw.lastElementChild);
            }
            break;
        }
    }
    if(winCheck()) checkmate("C");
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

function winner_move(){
    var pile=2, quantity=2, flag=0, counter=0;
    var pair = new Array();
    var pieces = new Array();
    for(let i=1; i<=w; i++){
        if(el[i]==0) continue;
        pieces = dec2bin(el[i]);
        for(let j=0; j<pieces.length; j++){
            var v = pieces.charCodeAt(j)-48; var op=0;
            if(v==1){
                if(pair[j]%2==0){
                    op = 1;
                    flag = i;
                    counter += Math.pow(2,j);
                } else{
                    op = -1;
                    flag = 0;
                    counter -= Math.pow(2,j);
                }
            }
            pair[j] += op*v;
        }
    }

    pile=flag; quantity=counter;
    if(quantity==0) random_play(); 

    var gm = game[0].getElementsByTagName("div");
    for(let i=1; i<gm.length; i++){
        if(i==pile){
            var rw = gm[i].getElementsByTagName("div");
            for(let j=1; j<=quantity; j++){
                el[pile]--;
                rw.removeChild(rw.lastElementChild);
            }
            break;
        }
    }
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
    document.location.reload();
}

function gb_update(elem){
    //how to manipulate a certain element for it to turn on another color and, if possible, taking out its clicking ability?
    console.log("here!");
    elem.style.backgroundColor = "rgb(131, 128, 135)";
    elem.onclick = null;
}