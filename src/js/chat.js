import "../css/style_chat.css";
import {getCookie} from "./helpers/cookieHelper";

const CHAR_RETURN = 13;

const socket = new WebSocket('ws://servlet-chat-pinklink.herokuapp.com/chat');
// const socket = new WebSocket('ws://localhost:8081/chat');
const usr = document.getElementById('contacts');
const chat = document.getElementById('chat');
const msg = document.getElementById('message');
const btn = document.getElementById('btn');

const nickname = getCookie("nickName");
const token = getCookie("token");

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
        nickName: nickname,
        payload: token
    };
    socket.send(JSON.stringify(envelope));
};

socket.onclose = () => {
    writeLine('<div class="close">Closed</div>');
};

btn.onclick = () => {
    const s = msg.value;
    msg.value = '';
    let envelope = {
        topic: 'message',
        nickName: nickname,
        payload: s
    };
    socket.send(JSON.stringify(envelope));
}

socket.onmessage = (event) => {
    console.debug("WebSocket message received:", event);
    let envelop = JSON.parse(event.data);
    switch (envelop.topic) {
        case "auth":
            displayConnectedUserMessage(envelop.nickName);
            break;
        case "message":
            displayMessage(envelop.nickName, envelop.payload);
            break;
        case "allUsersOnLine":
            addAvailableUsers(envelop.payload);
            break;
    }
};

msg.addEventListener('keydown', event => {
    if (event.keyCode === CHAR_RETURN) {
        event.preventDefault();
        // Trigger the button element with a click
        btn.click();
    }
});

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

    let sentByCurrentUer = nickname === username;

    let message = document.createElement("div");
    message.setAttribute("class", "message event");

    let text = sentByCurrentUer === true ? "Welcome " + username : username + " joined the chat";
    let content = document.createElement("span");
    content.setAttribute("class", "content");
    content.appendChild(document.createTextNode(text));
    message.appendChild(content);

    let messages = document.getElementById("messages");
    messages.appendChild(message);
}

function addAvailableUsers(userlist) {
    const parent = document.getElementById("online")
    while (parent.firstChild) {
        parent.firstChild.remove()
    }
    let cont = JSON.parse(userlist)
    for (let i = 0; i < cont.length; i++) {
        let username = cont[i].nickName;
        let avatar = cont[i].avatar;
        let contact = document.createElement("div");
        contact.setAttribute("class", "contact");
        const myIcon = new Image();
        if (avatar !== null) {
            myIcon.src = 'data:image/png;base64,' + avatar;
        } else {
            myIcon.src = 'img/defaul_icon.png';
        }
        contact.appendChild(myIcon);

        let status = document.createElement("div");
        status.setAttribute("class", "status");
        contact.appendChild(status);

        let content = document.createElement("span");
        content.setAttribute("class", "name");
        content.appendChild(document.createTextNode(username));
        contact.appendChild(content);

        let contacts = document.getElementById("online");
        contacts.appendChild(contact);
    }
}

