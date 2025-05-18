/// <reference path="./types.d.ts" />

import { initKeyboard, zmenLayout } from './keyboard.js';
import { cyklickeTema } from './theming.js';
import { initEventHandlers } from './events.js';
import { state } from './state.js';

// let state.DES_MIST = 4;
// let state.mazat = false;

const math = window.math;
// const state.pamet = {}; // globální scope
const vstup = document.getElementById("vstup");
const kontejner = document.getElementById("klavesnice");

function vlozText(hodnota) {
  const znamenka = ["+","-","*","/","✕"];
  const kvlozeni = state.altSymbol ? hodnota?.name1 : hodnota.name;
  znamenka.forEach((zn) => {
    if (zn == kvlozeni) state.mazat=false;
  });
  state.mazat ? smaz() : (()=>{})();
  if (vstup.textContent.trim() == "0") {
    vstup.textContent = "";
  }
  vstup.textContent += kvlozeni;
  vstup.scrollLeft = vstup.scrollWidth;
  state.altSymbol = false;
};

function vypisPamet(scope) {
  const vysledek = [];
  for (const [jmeno, hodnota] of Object.entries(scope)) {
    let typ = typeof hodnota;
    let zobrazeni;
    if (typeof hodnota === 'function') {
      typ = 'funkce';
      zobrazeni = hodnota.toString();
    } else if (typeof hodnota === 'object' && hodnota?.isUnit) {
      typ = 'jednotka';
      zobrazeni = `${hodnota.toNumber(hodnota.units[0].unit.name)} ${hodnota.units[0].unit.name}`;
    } else {
      zobrazeni = String(hodnota);
    }
    vysledek.push(`${jmeno}: [${typ}] ${zobrazeni}`);
  }
  return vysledek.join('\n');
}

function smazat(jmeno, scope) {
  if (jmeno in scope) {
    delete scope[jmeno];
    return `Smazáno: ${jmeno}`;
  } else {
    return `Proměnná nebo funkce '${jmeno}' neexistuje.`;
  }
}

function nastaveni(){
  window.location.href = "nastaveni.html";
}

function spocitej() {
  try {
    const vyraz = vstup.textContent
      .replace(/\u00A0/g, ' ')
      .replace(/✕/g, '*')
      .trim();
    const node = math.parse(vyraz);
    let vysledek;
    if (node.type === 'BlockNode') {
      const blocks = node.blocks;
      for (let i = 0; i < blocks.length; i++) {
        const result = blocks[i].node.evaluate(state.pamet);
        if (i === blocks.length - 1) {
          vysledek = result;
        }
      }
    } else {
      vysledek = node.evaluate(state.pamet);
      if (node.type === 'AssignmentNode' || node.type === 'FunctionAssignmentNode') {
        vysledek = 0;
      }
    }
    if (vysledek && typeof vysledek.toString === 'function') {
      vysledek = math.format(vysledek, { precision: state.DES_MIST });
    }
    vstup.textContent = String(vysledek ?? 0);
    state.mazat = true;
  } catch (err) {
    vstup.textContent = `Chyba: ${err.message}`;
    state.mazat = true;
  }
}

function del() {
  vstup.textContent = vstup.textContent.trim() != "0" ? vstup.textContent.slice(0, -1) : "0";
  if (state.mazat) smaz();
}

function smaz() {
  vstup.textContent = "0";
  state.mazat = false;
}


function nastavTrigRezim(pamet, rezim) {
  const primeFunkce = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'];
  const inverzniFunkce = ['asin', 'acos', 'atan', 'asec', 'acsc', 'acot'];

  const uhel = x => math.unit(x, rezim);

  // Přímé funkce: sin(x) → sin(unit(x, 'deg'))
  primeFunkce.forEach(jmeno => {
    pamet[jmeno] = x => math[jmeno](uhel(x));
  });

  // Inverzní funkce: asin(x) → unit(asin(x), 'deg').value
  inverzniFunkce.forEach(jmeno => {
    pamet[jmeno] = x => math.unit(math[jmeno](x), rezim).value;
  });

  // Dvouargumentová atan2
  pamet.atan2 = (y, x) => math.unit(math.atan2(y, x), rezim).value;
}

const mozneRezimy = ['rad', 'deg', 'grad'];
let aktualniIndexUhlu = 0;
let aktualniRezimUhlu = mozneRezimy[aktualniIndexUhlu];

function mod_uhly() {
  // posuň index cyklicky
  aktualniIndexUhlu = (aktualniIndexUhlu + 1) % mozneRezimy.length;
  aktualniRezimUhlu = mozneRezimy[aktualniIndexUhlu];
  nastavTrigRezim(pamet, aktualniRezimUhlu);
  return aktualniRezimUhlu;
}


const funkce = {
  vlozText,
  spocitej,
  smaz,
  del,
  cyklickeTema,
  nastaveni,
};

initEventHandlers({
  container: kontejner,
  dispatchTable: funkce,
  zmenLayout,
});

// kontejner ? vykresliKlavesnici("default", kontejner) : null;
initKeyboard(kontejner); // místo přímého vykreslení
// nastavTrigRezim(state.pamet, state.angle);
