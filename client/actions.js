import { fromEvent, merge } from "rxjs";
import { map, filter, startWith, withLatestFrom } from "rxjs/operators";

const sendButton = document.querySelector(".send");
const inputBox = document.querySelector(".input");
const userSelect = document.querySelector(".users");

const sendButtonClick$ = fromEvent(sendButton, "click");

const enterKeyPress$ = fromEvent(inputBox, "keypress").pipe(
  filter((e) => e.keyCode === 13)
);

const userSelectChange$ = fromEvent(userSelect, "change").pipe(
  map((e) => e.target.value),
  startWith("everyone")
);

const sendMessage$ = merge(sendButtonClick$, enterKeyPress$).pipe(
  map(() => inputBox.value),
  filter((message) => message),
  withLatestFrom(userSelectChange$)
);

export default sendMessage$;
