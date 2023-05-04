/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];

const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username?");


/** called when connection opens, sends join info to server. */

ws.onopen = function (evt) {
  console.log("open", evt);

  let data = { type: "join", name: name };
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = function (evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  }

  else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  }

  else {
    return console.error(`bad message: ${msg}`);
  }

  $('#messages').append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. */

$('form').submit(function (evt) {
  evt.preventDefault();
  const inputValue = $('#m').val();
  const userEvents = {
    "/joke": { type: "joke" },
    "/members": data = { type: "members" },
  }
  let data;

  if (inputValue === '/joke') {
    data = { type: "joke" }
  } else if (inputValue === '/members') {
    data = { type: "members" }
  } else if (inputValue.startsWith('/priv')) {
    const valueArr = inputValue.split(' ');
    const message = valueArr.splice(2)
    data = { type: 'priv', reciever: valueArr[1], text: message }
  } else {
    data = { type: "chat", text: $("#m").val() };
  }
  ws.send(JSON.stringify(data));

  $('#m').val('');
});

