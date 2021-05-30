import "../css/style_chat.css";
import {getCookie} from "./helpers/cookieHelper";


const CHAR_RETURN = 13;

const socket = new WebSocket('ws://localhost:8081/chat');
const usr = document.getElementById('contacts');
const chat = document.getElementById('chat');
const msg = document.getElementById('message');
const btn = document.getElementById('btn');

const nickname = getCookie("nickName");
const token = getCookie("token");


const writeLineNickName = nickname => {
    const line = document.createElement('div');
    line.innerHTML = `<p>${nickname}</p>`;
    line.setAttribute("class", "nickName");
    chat.appendChild(line);
};

const writeLineTime = time => {
    time = new Date().toLocaleString('en-US', {timeZone: 'Europe/Kiev'});
    const line = document.createElement('div');
    line.setAttribute("class", "times");
    line.innerHTML = `<p>${time}</p>`;
    chat.appendChild(line);
};

const writeLine = text => {
    const line = document.createElement('div');
    line.setAttribute("class", "messageText");
    line.innerHTML = `<p>${text}</p>`;
    chat.appendChild(line);
};

socket.onopen = () => {
    msg.focus();
    writeLine('<div class="connect">Connected</div>');

    let envelope = {
        topic: 'auth',
        payload: JSON.stringify(token)
    };
    socket.send(JSON.stringify(envelope));
    displayConnectedUserMessage(nickname)
};

socket.onclose = () => {
    writeLine('<div class="close">Closed</div>');
};

btn.onclick = () => {
    const s = msg.value;
    msg.value = '';
    let envelope = {
        topic: 'message',
        payload: s
    };
    socket.send(JSON.stringify(envelope));
    displayMessage(nickname, s);

}

socket.onmessage = (event) => {
    let envelop = JSON.parse(event.data);
    switch (envelop.topic) {
        case "auth":
            displayConnectedUserMessage(nickname);
            break;
        case "message":
            displayMessage(nickname,envelop.payload);
            break;
    }
};

// msg.addEventListener('keydown', event => {
//     if (event.keyCode === CHAR_RETURN) {
//         const s = msg.value;
//         msg.value = '';
//         let payloadToken = {
//             nickname: nickname,
//             time: new Date(),
//             text: s
//         }
//
//         let envelope = {
//             topic: 'messages',
//             payload: JSON.stringify(payloadToken)
//         };
//         socket.send(JSON.stringify(envelope));
//     }
// });

// socket.onmessage = function (event) {
// let message = JSON.parse(event.data);
// if (message) {
//     let payload = JSON.parse(message.payload);
//     if (payload && payload.text) {
//         writeLineNickName(payload.nickname);
//         writeLineTime(payload.time);
//         writeLine(payload.text);
//     }
// }
//
// };

// socket.onmessage = function (event) {
//     displayMessage(nickname, msg.value);
// };

function displayMessage(username, text) {

        var sentByCurrentUer = nickname === username;

        var message = document.createElement("div");
        message.setAttribute("class", sentByCurrentUer === true ? "message sent" : "message received");
        message.dataset.sender = username;

        var sender = document.createElement("span");
        sender.setAttribute("class", "sender");
        sender.appendChild(document.createTextNode(sentByCurrentUer === true ? "You" : username));
        message.appendChild(sender);

        var content = document.createElement("span");
        content.setAttribute("class", "content");
        content.appendChild(document.createTextNode(text));
        message.appendChild(content);

        var messages = document.getElementById("messages");
        var lastMessage = messages.lastChild;
        if (lastMessage && lastMessage.dataset.sender && lastMessage.dataset.sender === username) {
            message.className += " same-sender-previous-message";
        }

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

function displayConnectedUserMessage(username) {

    var sentByCurrentUer = nickname === username;

    var message = document.createElement("div");
    message.setAttribute("class", "message event");

    var text = sentByCurrentUer === true ? "Welcome " + username : username + " joined the chat";
    var content = document.createElement("span");
    content.setAttribute("class", "content");
    content.appendChild(document.createTextNode(text));
    message.appendChild(content);

    var messages = document.getElementById("messages");
    messages.appendChild(message);
}

