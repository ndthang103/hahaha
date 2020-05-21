import { of, fromEvent } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import io from "socket.io-client";

const socket$ = of(io());

const connect$ = socket$.pipe(
  switchMap((socket) => fromEvent(socket, "connect").pipe(map(() => socket)))
);

export function listenOnConnect(event) {
  return connect$.pipe(switchMap((socket) => fromEvent(socket, event)));
}

export function emitOnConnect(observable$) {
  return connect$.pipe(
    switchMap((socket) => observable$.pipe(map((data) => ({ socket, data }))))
  );
}
