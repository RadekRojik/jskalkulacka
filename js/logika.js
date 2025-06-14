import { reloadstatus } from './statusbar.js';
import { initKeyboard, zmenLayout } from './keyboard.js';
import { cyklickeTema } from './theming.js';
import { initEventHandlers } from './events.js';
import { state, walkTroughArray, rezimyUhlu, walkTroughObject, loadState, watchprops } from './state.js';
import { makeResult } from './makeresult.js';

//math['√'] = math.sqrt;

// const state.pamet = {}; // globální scope
const vstup = document.getElementById("vstup");
const kontejner = document.getElementById("klavesnice");


// vkládá znaky na displej
function insertText(hodnota) {
  const znamenka = ["+", "-", "*", "/", "✕", ","];
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


function saveToObjekt(hod){
  // state.user[state.activeUserScope][hod.name] = vstup.textContent.trim();
  Reflect.set(state.user[state.activeUserScope], hod.name, vstup.textContent.trim());
  initKeyboard(kontejner);
}


function insertValue(hod){
  if (/\d$/.test(vstup.textContent.trim())) smaz();
  insertText(hod);
}


function insertAndMakeResult(hod){
  if (vstup.textContent.trim() == 0 || vstup.textContent.trim() == ''){
    insertValue(hod);
    makeResult();
    return;
  }
  const scope = {};
  const vzorec = state.user[state.activeUserScope][hod.name];
  const node = math.parse(vzorec);
  node.compile().evaluate(scope);
  const pocetarg = node.params.length;
  const pole = vstup.textContent.split(',').map(s => s.trim());
  if (pole.length == pocetarg){
    vstup.textContent = `${hod.name}(${pole})`;
  } else {
    insertValue(hod);
  }
  makeResult();
}


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

function saveMemory(x){
  state.memory[x.name] = vstup.textContent;
  initKeyboard(kontejner);
}

function loadMemory(x) {
  const kuk = {};
  vstup.textContent = state.memory[x.name];
}

export function vratAns(){
  const tohle = {};
  tohle.name1 = state.ans[0];
  insertText(tohle);
}

export function zmenScope(){
  state['activeUserScope'] = walkTroughObject(state.user, state.activeUserScope, 1);
}


const funkce = {
  insertText,
  insertValue,
  insertAndMakeResult,
  saveToObjekt,
  makeResult,
  smaz,
  del,
  cyklickeTema,
  goToNastaveni,
  vratAns,
  zmenScope,
  saveMemory,
  loadMemory
};

initEventHandlers({
  container: kontejner,
  dispatchTable: funkce,
  zmenLayout,
});

initKeyboard(kontejner); // místo přímého vykreslení
reloadstatus();