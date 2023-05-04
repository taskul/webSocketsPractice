/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require('./Room');

/** ChatUser is a individual connection from client -> server to chat. */

class ChatUser {
  /** make chat: store connection-device, rooom */

  constructor(send, roomName) {
    this._send = send; // "send" function for this user
    this.room = Room.get(roomName); // room user will be in
    this.name = null; // becomes the username of the visitor
    console.log(`created chat in ${this.room.name}`);
  }

  /** send msgs to this client using underlying connection-send-function */

  send(data) {
    try {
      this._send(data);
    } catch {
      // If trying to send to a user fails, ignore it
    }
  }

  /** handle joining: add to room members, announce join */

  handleJoin(name) {
    this.name = name;
    this.room.join(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} joined "${this.room.name}".`
    });
  }

  /** handle a chat: broadcast to room. */

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: 'chat',
      text: text
    });
  }

  // Tastan added this
  handleJoke() {
    const data = {
      type: "chat",
      text: "What do you call eight hobbits? A hob-byte!",
      name: "Server"
    };
    this.room.displayCommands(this, data);
  }

  showRoomMembers() {
    const memberNames = [];
    this.room.members.forEach(m => memberNames.push(m.name));
    const data = {
      type: "chat",
      text: `Chat members are: ${memberNames}`,
      name: "Server"
    };
    this.room.displayCommands(this, data);
  }

  sendPrivMsg(reciever, text) {
    const data = {
      type: "chat",
      text: text,
      name: this.name
    };
    let sendTo;
    this.room.members.forEach(m => {
      if (m.name.toLowerCase() === reciever.toLowerCase()) {
        sendTo = m;
      }
    })
    this.room.sendPrivateMessage(this, sendTo, data)
  }

  /** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   */

  handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);
    // this.userCommands = {
    //   'joke': this.handleJoke,
    //   'members': this.showRoomMembers
    // }

    if (msg.type === 'join') this.handleJoin(msg.name);
    else if (msg.type === 'chat') this.handleChat(msg.text);
    else if (msg.type === 'joke') this.handleJoke();
    else if (msg.type === 'members') this.showRoomMembers();
    else if (msg.type === 'priv') this.sendPrivMsg(msg.reciever, msg.text);
    // else if (this.userCommands[msg.type]) this.userCommands[msg.type]();
    else throw new Error(`bad message: ${msg.type}`);
  }

  /** Connection was closed: leave room, announce exit to others */

  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} left ${this.room.name}.`
    });
  }
}

module.exports = ChatUser;
