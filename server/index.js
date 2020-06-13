const server = require("./server");
const { connection$, disconnect$, listenOnConnect } = require("./connection");

server.listen(process.env.PORT || 3000, () =>
  console.log("listening on port: 3000")
);

connection$.subscribe(({ io, client }) => {
  const allSockets = io.sockets.sockets;

  const allUsers = Object.entries(allSockets)
    .map(([id, socket]) => ({ id, username: socket.username }))
    .filter(({ username }) => username);

  client.emit("all users", allUsers);
});

disconnect$.subscribe((client) => {
  console.log("disconnected: ", client.id);
});

listenOnConnect("save username").subscribe(({ io, client, data }) => {
  const allSockets = io.sockets.sockets;
  const id = client.id;
  const username = data;

  allSockets[id].username = username;

  client.broadcast.emit("new user", { id, username });
});

disconnect$.subscribe((client) => {
  client.broadcast.emit("remove user", client.id);
});

listenOnConnect("chat message").subscribe(({ client, data }) => {
  const from = client.username;
  const { id, message } = data;

  if (!id) return;

  if (id === "everyone") {
    client.broadcast.emit("chat message", { from, message });
  } else {
    client.broadcast.to(id).emit("chat message", { from, message });
  }
});
