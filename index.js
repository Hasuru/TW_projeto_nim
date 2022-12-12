/*
const http = require('http');
//require('./script.js');

const server = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Olá mundo\n');
});

server.listen(8021);

var nick; // Nickname
var password; // Password
var group = 21; // Group Id
var size; // Number of columns
var initial; // Number of pieces
var jogo; // Game counter
var move; // Playing row
var erasedpieces; // Number of elements cut
var state; // Tells the player if a certain play if doable or not
var scoreboard; // Scoretable

function request(command, object) {

    const xhr = new XMLHttpRequest();

    xhr.open('POST','http://twserver.alunos.dcc.fc.up.pt:8021/'+command,true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            const data = JSON.parse(xhr.responseText);
            switch(command) {
                case 'join':
                    if (data.error) {
                        alert(JSON.stringify(data.error));
                    } else {
                        alert("Jogo criado com sucesso!");
                        jogo = data.game;
                        //update();
                    }

                    break;
                case 'leave':
                    if (data.error) {
                        alert(JSON.stringify(data.error));
                    } else {
                        alert("Desistiu!");
                        //openCity(event ,'config');
                    }
                    break;
                case 'notify':
                    //console.log(jogo);
                    //console.log(object);
                    if (data.error) {
                        alert(JSON.stringify(data.error));
                    } else {
                        
                    }
                    break;
                case 'ranking':
                    if (data.error) {
                        alert(JSON.stringify(data.error));
                    } else {
                        scoreboard = data.ranking;
                        //console.log(data.ranking);
                        //console.log(scoreboard);
                        let result = scoreboard.reduce((acc,cur) => 
                        acc.push(Object.values(cur)) && acc, [Object.keys(scoreboard[0])])
                        var html = '<table class="styled-table">';
                        html += '<tr class="active-row">';
                        html += '<th>' + "Nick" + '</th>';
                        html += '<th>' + "Vitorias" + '</th>';
                        html += '<th>' + "Jogos" + '</th>';
                        html += '</tr>';
                        for( var i = 1; i < result.length; i++) {
                        html += '<tr>';
                        for( var j in result[i] ) {
                        html += '<td>' + result[i][j] + '</td>';
                        }
                        html += '</tr>';
                        }
                        html += '</table>';
                        document.getElementById('tabelaClass').innerHTML = html;
                    }
                    break;
                case 'register':
                    if (data.error) {
                        alert("Password não correspondente ao utilizador");
                    } else {
                        alert("Login efetuado com sucesso!");
                        //openCity(event ,'config');
                    }
                    break;
                case 'update':
                    if (data.error) {
                        alert("Password não correspondente ao utilizador");
                    } else {
                    }
                    break;            
            }
        }
    }

    xhr.send(JSON.stringify(object));      

    //if(xhr.status == 200) {
    //    this.display.innerText = xhr.responseText;
    //()}
}

function register() {
    nick = document.getElementById('nick').value;
    password = document.getElementById('pass').value;

    let objt = { "nick": nick, "password": password };
    request('register', objt);
}

function ranking() {
    let objt = {};
    request('ranking', objt);
}*/



const http = require('http');

require('./script.js'); 

const server = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Olá mundo\n');
});

server.listen(8008);