/** Chat rooms that can be joined/left/broadcast to. */

// in-memory storage of roomNames -> room
// the Map object holds key-value pairs and remembers the original insertion order of the keys.
const ROOMS = new Map();

/** Room is a collection of listening members; this becomes a "chat room"
 *   where individual users can join/leave/broadcast to.
 */

class Room {
  /** get room by that name, creating if nonexistent
   *
   * This uses a programming pattern often called a "registry" ---
   * users of this class only need to .get to find a room; they don't
   * need to know about the ROOMS variable that holds the rooms. To
   * them, the Room class manages all of this stuff for them.
   **/

  static get(roomName) {
    if (!ROOMS.has(roomName)) {
      // setting a key/value pair in a Map object
      // roomName is key, value is a new Room instance.
      ROOMS.set(roomName, new Room(roomName));
    }

    // after we add an instasnce of a Room to a Map object
    // we call on it
    return ROOMS.get(roomName);
  }

  /** make a new room, starting with empty set of listeners */

  constructor(roomName) {
    this.name = roomName;
    this.members = new Set();
  }

  /** member joining a room. */

  join(member) {
    this.members.add(member);
  }

  /** member leaving a room. */

  leave(member) {
    this.members.delete(member);
  }

  /** send message to all members in a room. */

  broadcast(data) {
    for (let member of this.members) {
      member.send(JSON.stringify(data));
    }
  }

  // Tastan added function
  messageUser(member, data) {
    member.send(JSON.stringify(data))
  }

  showMembers(member) {
    const memberNames = [];
    this.members.forEach(m => memberNames.push(m.name));
    const data = {type: "chat", text: `Chat members are: ${memberNames}`, name: "Server"};
    member.send(JSON.stringify(data));
  }
}

module.exports = Room;
