import { state } from "./state.js";

const statusbar = document?.getElementById("statusbar");
const scope = document?.getElementById("scope");
const uhly = document?.getElementById("uhly");

export function reloadstatus (){
    if (uhly) uhly.innerText = 'Mod: ' + state.angle;
    // if (scope) scope.innerText = 'Scope: ' + Object.keys(state.pamet);
}
