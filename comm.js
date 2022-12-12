// server & communication
const baseurl = "http://twserver.alunos.dcc.fc.up.pt:8008/";
const group = 21;

var nick;           // nome de usuario
var password;       // password do usuario
var size;           // tamanho do jogo
var game;           // id do jogo criado
var pieces;         // n de pecas numa stack
var rack;           // representacao do tabuleiro (array com n stacks)
var stack;          // cada stack com pieces do jogo
var turn;           // determina quem tem permissao para jogar
var winner;         // determina vencedor da partida (pode returnar NULL se nao forem emparelhados 2 jogadores)
var ranking;        // info presenta na tabela de classificacoes


// FETCH REQUESTS
function request(command, object) {
    const response = fetch(baseurl+command, {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(object)
    })
        .then((response) => {
            if (!response.ok) {
                // verificar se nao houve problemas com o envio do servidor
                response.text().then((text) => {throw new Error(text)});
            }
            // retornar traducao do json para o campo data
            return response.json(); 
        })
        .then((data) => {
            switch (command) {
                case 'join':
                    if (data.error) {
                        alert(data.error.text);
                        throw new Error(data.error);
                    } else {
                        alert("Game created!");
                        game = data.game;
                        //dar update dentro da funcao
                        createGame(game);
                        //console.log(game.text);
                    }
                    break;
                case 'leave':
                    if (data.error) {
                        alert(data.error.text);
                        throw new Error(data.error);
                    } else {
                        alert("Left current game!");
                        // reset a Board
                    }
                    break;
                case 'notify':
                    if (data.error) {
                        alert(data.error.text);
                        throw new Error(data.error);
                    }
                    break;
                case 'ranking':
                    if (data.error) {
                        alert(data.error.text);
                        throw new Error(data.error);
                    } else {
                        ranking = data.ranking;

                        let result = ranking.reduce((acc,cur) => 
                        acc.push(Object.values(cur)) && acc, [Object.keys(ranking[0])])

                        var html = '<table class=result_box>';
                        html += '<tr>';
                        html += '<th>' + "Nick" + '</th>';
                        html += '<th>' + "Wins" + '</th>';
                        html += '<th>' + "Games" + '</th>';
                        html += '</tr>';

                        for (let i = 1; i < result.length; i++) {
                            html += '<tr>';
                            for (let j in result[i]) {
                                html += '<td>' + result[i][j] + '</td>';
                            }
                            html += '</tr>';
                        }
                        html += '</table>';
                        document.getElementById('result_box').innerHTML = html;
                        
                        break;
                    }
            }
        })
        .catch((err) => {
            console.error("Fetch error: " + err);
        });
}

function register() {
    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let object = {'nick':nick, 'password': password};
    request('register', object); // nao precisamos de fazer nada aqui

    // mostrar user na pagina
    document.getElementById('auth').innerHTML = nick;
    document.getElementById('auth').style.pointerEvents = "none";
    closeLog();
}

async function join() {
    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let size = document.getElementById('board_width').valueAsNumber;

    if (size < 2 || size > 7) {
        alert("Invalid width value!");
        throw new Error("Invalid width value!");
    }

    let object = {'group':group, 'nick':nick, 'password':password, 'size':size};
    request('join', object);
}

async function leave(game) {
    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let object = {'nick':nick, 'password':password, 'game':game};
    request('leave', object);
}

function notify(game, stack, pieces) {
    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (stack < 0 || pieces <= 0) {
        alert("Oops! Something went wrong! Going back!");
        leave(game);
    }

    let object = {'nick':nick, 'password':password, 'game':game, 'stack':stack, 'pieces':pieces};
    request('notify', object);
}

function ranking() {
    let size = document.getElementById('board_width').valueAsNumber;

    let object = {'group':group, 'size':size};
    request('ranking', object);
}

function update(nick, game) {
    const event = new EventSource(baseurl+'update'+'?nick='+nick+'&game='+game);
    event.onmessage = function(eventData) {
        const data = JSON.parse(eventData.data);

        var winner = data.winner;
        var turn = data.turn;
        var rack = data.rack;
        var stack = data.stack;
        var pieces = data.pieces;

        if (winner) {
            if (winner == nick) checkmate('P');
            else if (winner == 'null') alert("Lost connection!");
            else checkmate('C');
        }

        if (turn) {
            // usar o rack, stack e pieces aqui para atualizar board
            if (turn == nick) {
                //jogador que esta a ver o browser efetua a jogada
            } else {
                //o adversarion joga
            }
        }
    }
}