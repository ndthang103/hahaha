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

emitOnConnect(username$).subscribe(({ socket, data }) => {
  const username = data;
  socket.emit("save username", username);
});

listenOnConnect("new user").subscribe(({ id, username }) => {
  addUser(id, username);
});

listenOnConnect("all users").subscribe((users) => {
  clearUsers();
  addUser("everyone", "Everyone");
  users.forEach(({ id, username }) => addUser(id, username));
});

listenOnConnect("remove user").subscribe((id) => {
  removeUser(id);
});

emitOnConnect(sendMessage$)
  .pipe(withLatestFrom(username$))
  .subscribe(([{ socket, data }, username]) => {
    const [message, id] = data;
    clearUserInput();
    addMessage(username, message);
    socket.emit("chat message", { id, message });
  });

listenOnConnect("chat message").subscribe(({ from, message }) => {
  addMessage(from, message);
});
