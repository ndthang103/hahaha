import { of } from "rxjs";
import { withLatestFrom } from "rxjs/operators";
import {
  getUsername,
  addUser,
  clearUsers,
  removeUser,
  addMessage,
  clearUserInput,
} from "./utilities";
import { emitOnConnect, listenOnConnect } from "./connection";
import sendMessage$ from "./actions";

const username$ = of(getUsername());

// Send username to server
emitOnConnect(username$).subscribe(({ socket, data }) => {
  const username = data;
  socket.emit("save username", username);
});

listenOnConnect("new user").subscribe(({ id, username }) => {
  addUser(id, username); // <-- We'll create this soon
});

listenOnConnect("all users").subscribe((users) => {
  clearUsers(); // <-- We'll create this soon
  addUser("everyone", "Everyone");
  users.forEach(({ id, username }) => addUser(id, username));
});

listenOnConnect("remove user").subscribe((id) => {
  removeUser(id); // <-- We'll create this soon
});

emitOnConnect(sendMessage$)
  .pipe(withLatestFrom(username$))
  .subscribe(([{ socket, data }, username]) => {
    const [message, id] = data;
    clearUserInput(); // <-- We'll create this soon
    addMessage(username, message); // <-- We'll create this soon
    socket.emit("chat message", { id, message });
  });

listenOnConnect("chat message").subscribe(({ from, message }) => {
  addMessage(from, message);
});
