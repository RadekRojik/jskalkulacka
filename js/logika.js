import { reloadstatus } from './statusbar.js';
import { initKeyboard, zmenLayout } from './keyboard.js';
import { cyklickeTema } from './theming.js';
import { initEventHandlers } from './events.js';
import { state, walkTroughArray, rezimyUhlu } from './state.js';
import { makeResult } from './makeresult.js';

//math['√'] = math.sqrt;

// const state.pamet = {}; // globální scope
const vstup = document.getElementById("vstup");
const kontejner = document.getElementById("klavesnice");


// vkládá znaky na displej
function insertText(hodnota) {
  const znamenka = ["+", "-", "*", "/", "✕"];
  const kvlstr = state.altSymbol ? hodnota?.str1 : hodnota?.str;
  const kvlnam = state.altSymbol ? hodnota?.name1 : hodnota?.name;
  const kvlozeni = kvlstr ? kvlstr : kvlnam;
  if (znamenka.includes(kvlozeni)) state.mazat = false;
  state.mazat ? smaz() : (() => { })();
  if (vstup.textContent.trim() == "0") {
    vstup.textContent = "";
  }
  vstup.textContent += kvlozeni;
  vstup.textContent = vstup.textContent.replace(/([✕+\*/^])\1+/g, '$1');
  vstup.scrollLeft = vstup.scrollWidth;
  state.altSymbol = false;
};


// wraper na skok do nastavení
function goToNastaveni() {
  window.location.href = "nastaveni.html";
}

// mazání posledního znaku
function del() {
  vstup.textContent = vstup.textContent.trim() != "0" ? vstup.textContent.slice(0, -1) : "0";
  if (state.mazat) smaz();
}


// Smazání displeje
function smaz() {
  vstup.textContent = "0";
  state.mazat = false;
}

export function vratAns(){
  const tohle = {};
  tohle.name1 = state.ans[0];
  // console.log(state.ans);
  insertText(tohle);
}



const funkce = {
  insertText,
  makeResult,
  smaz,
  del,
  cyklickeTema,
  goToNastaveni,
  vratAns,
};

initEventHandlers({
  container: kontejner,
  dispatchTable: funkce,
  zmenLayout,
});

// kontejner ? vykresliKlavesnici("default", kontejner) : null;
initKeyboard(kontejner); // místo přímého vykreslení
// nastavTrigRezim(state.pamet, state.angle);
reloadstatus();