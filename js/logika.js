/// <reference path="./types.d.ts" />

import { reloadstatus } from './statusbar.js';
import { initKeyboard, zmenLayout } from './keyboard.js';
import { cyklickeTema } from './theming.js';
import { initEventHandlers } from './events.js';
import { state, walkTroughArray, rezimyUhlu } from './state.js';


const math = window.math;

//math['√'] = math.sqrt;

// const state.pamet = {}; // globální scope
const vstup = document.getElementById("vstup");
const kontejner = document.getElementById("klavesnice");


// vkládá znaky na displej
function vlozText(hodnota) {
  const znamenka = ["+", "-", "*", "/", "✕"];
  const kvlstr = state.altSymbol ? hodnota?.str1 : hodnota?.str;
  const kvlnam = state.altSymbol ? hodnota?.name1 : hodnota?.name;
  const kvlozeni = kvlstr ? kvlstr : kvlnam;
  // znamenka.forEach((zn) => {
  //   if (zn == kvlozeni) state.mazat = false;
  // });
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


// funkce vyhodnocující výraz
function spocitej() {
//   const scope = {...state.pamet.default, ...state.gfunkce};
  const scope = state.pamet;
  try {
    const vyraz = vstup.textContent
      .replace(/\u00A0/g, ' ')
      .replace(/✕/g, '*')
      .replace(/√/g, 'sqrt')
      .trim();
    const node = math.parse(vyraz);
    let vysledek;
    if (node.type === 'BlockNode') {
      const blocks = node.blocks;
      for (let i = 0; i < blocks.length; i++) {
        const result = blocks[i].node.evaluate(scope);
        if (i === blocks.length - 1) {
          vysledek = result;
        }
      }
    } else {
      vysledek = node.evaluate(scope);
      if (node.type === 'AssignmentNode' || node.type === 'FunctionAssignmentNode') {
        pridejDoAns(state.vzorce, vyraz,100);
        // console.log('typ: ', node.type);
        vysledek = 0;
      }
    }
    if (vysledek && typeof vysledek.toString === 'function') {
      vysledek = math.format(vysledek, { precision: state.DES_MIST });
    }
    vstup.textContent = String(vysledek ?? 0);
    if (vstup.textContent != 0) pridejDoAns(state.ans, vstup.textContent, state.ANS_HISTORY);
    state.mazat = true;
  } catch (err) {
    vstup.textContent = `Chyba: ${err.message}`;
    state.mazat = true;
  }
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

function vratAns(){
  const tohle = {};
  tohle.name1 = state.ans[0];
  // console.log(state.ans);
  vlozText(tohle);
}

function pridejDoAns(pole, prvek, maxDelka) {
  pole.unshift(prvek);
  // console.log('přidávám ', prvek);
  while (pole.length > maxDelka) {
    pole.pop();
  }
}


const funkce = {
  vlozText,
  spocitej,
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