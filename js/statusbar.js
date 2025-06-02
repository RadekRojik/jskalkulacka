import { state, innerState } from "./state.js";

export function reloadstatus (){
  const statusbar = document?.getElementById("statusbar");
  const scope = document?.getElementById("scope");
  const uhly = document?.getElementById("uhly");
  // console.log('přepisuju statusbar');
  if (uhly) uhly.innerText = 'Mod: ' + state.angle;
  if (scope) scope.innerText = 'Scope: ' + state.activeUserScope;
}
