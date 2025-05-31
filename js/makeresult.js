/// <reference path="./types.d.ts" />

import { state, loadState, watchprops } from "./state.js";

const math = window.math;
math.config({number: 'BigNumber'});


// funkce vyhodnocující výraz
export function makeResult() {
  const activeScope = state.activeUserScope ? state.user[state.activeUserScope] : {};
  const scope = { ...state.pamet, ...activeScope };

  try {
    const vyraz = vstup.textContent
      .replace(/\u00A0/g, ' ')
      .replace(/✕/g, '*')
      .replace(/√/g, 'sqrt')
      .trim();
    const node = math.parse(vyraz);
    let vysledek;
 
    switch (node.type) {
      case 'SymbolNode':
        vysledek = node.evaluate(scope);
        vysledek = math.format(vysledek, { fraction: 'ratio' });
        vysledek = math.evaluate(vysledek, scope);
        if (typeof activeScope[node.name] === 'string') {
          vysledek = math.evaluate(activeScope[node.name], scope);
          vysledek = math.format(vysledek, { fraction: 'ratio' });
          vysledek = math.evaluate(vysledek, scope);
          }
        break;
      case 'AssignmentNode':
        testAns(node.toString(), state.vzorce, 100);
        vysledek = node.evaluate(scope);
        if (vysledek && typeof vysledek.toString === 'function') {
          vysledek = math.format(vysledek, { fraction: 'ratio' });
          math.evaluate(vysledek, scope);
          }
        vysledek = 0;
        break;
      case 'FunctionAssignmentNode':
        testAns(node.toString(), state.vzorce, 100);
        vysledek =  math.evaluate(vyraz, scope);
        vysledek = math.format(vysledek, { fraction: 'ratio' });
        vysledek = 0;
        break;
      case 'FunctionNode':
        vysledek =  node.toString();
        if (activeScope[node.name]) {
          math.evaluate(activeScope[node.name], scope);
          vysledek = math.format(vysledek, { fraction: 'ratio' });
          vysledek = math.evaluate(vysledek, scope);
          }
        vysledek = math.evaluate(vysledek, scope);
        break;
      case 'BlockNode':
        const blocks = node.blocks;
        for (let i = 0; i < blocks.length; i++) {
          const result = blocks[i].node.evaluate(scope);
          if (i === blocks.length - 1) {
            vysledek = math.format(result, {fraction: 'ratio'});
          }
        }
        break;
      default:  vysledek = node.evaluate(scope);
    }
    vstup.textContent = String(vysledek ?? 0);
    if (vstup.textContent != 0) pridejDoAns(state.ans, vstup.textContent, state.ANS_HISTORY);
    state.mazat = true;
    loadState(state, watchprops);
  } catch (err) {
    vstup.textContent = `ERR: ${err.message}`;
    state.mazat = true;
  }
}


function pridejDoAns(pole, prvek, maxDelka) {
  pole.unshift(prvek);
  // console.log('přidávám ', prvek);
  while (pole.length > maxDelka) {
    pole.pop();
  }
}


// Funkce na zpracování zásobníku
function testAns(str, pole, maxDelka) {
  // Najde klíčové slovo (od začátku stringu, obsahující a-z, 0-9)
  const match = str.match(/^[a-z\d]+/i);
  if (!match) return pole; // Pokud není klíčové slovo, nic se nemění

  const klic = match[0];

  // Projdi pole a případně nahraď prvek, pokud začíná na klíčové slovo
  for (let i = 0; i < pole.length; i++) {
    const poleMatch = pole[i].match(/^[a-z\d]+/i);
    if (poleMatch && poleMatch[0] === klic) {
      pole.splice(i, 1);
      break;
    }
  }

  pridejDoAns(pole, str, maxDelka);

  return pole;
}
