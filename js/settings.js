import { cyklickeTema } from "./theming.js";

// Skok na index.html
function goToIndex(){
    window.location.href = "index.html";
}

document.getElementById("btnTema").addEventListener("click", cyklickeTema);
document.getElementById("zpet").addEventListener("click", goToIndex);
