const http = require('http');
const url = require('url');
const baseURL = "http://twserver.alunos.dcc.fc.up.pt:8021/";
const reg = require ('./regiServ.js');
const cnfg = require ('./configs.js');
//require('script.js');
//import {action_register} from './comm.js';

const server = http.createServer(function (request, response) {
    const parsedUrl = url.parse(request.url, true);

    var clientmsg;
    var msg = "";
    var error;
    var body = '';
    var nick;
    var pass;

    switch (request.method) {
        case 'POST':
            request
                .on('data', (chunk) => { body += chunk; })
                .on('end', () => {

                    try {
                        clientmsg = JSON.parse(body);

                        switch (parsedUrl.pathname) {

                            case '/register':
                                
                                error = { "error": "User registered with a different password" };
                                nick = clientmsg.nick;
                                pass = clientmsg.pass;

                                console.log("Nick: " + nick);
                                console.log("Pass: " + pass);

                                const newReg = new reg.ClassReg(nick, pass);

                                if (reg.checkNick(nick)) {
                                     register.push(newReg);
                                     msg = 'Registration completed!\nNick: \"' + nick + "\" Pass: \"" + pass + "\"";
                                     response.writeHead(200, cnfg.headers.txt);
                                }
                                else {
                                     response.writeHead(401, cnfg.headers.txt);
                                     msg = JSON.stringify(error);

                                }

                                console.log(register);
                                break;

                            case '/ranking':

                                response.writeHead(200, cnfg.headers.json);
                                //lacks leaderboard connection
                                break;

                            case '/join':

                                //unfinished
                                break;

                            default:

                                response.writeHead(404, cnfg.headers.txt);
                                msg = "command not defined";
                                break;
                        }

                        console.log(msg);
                        response.end(msg);
                    }
                    catch (err) { 
                        console.log(err); 
                    }
                })
                .on('error', (err) => { 
                    console.log(err.message); 
                });

        case 'GET':
            break;

        default:
            break;
    }
    //response.end("All Done")
});

server.listen(8021, () => {
    console.log("Server running on port " + 8021);
});