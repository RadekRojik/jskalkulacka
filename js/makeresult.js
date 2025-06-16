/// <reference path="./types.d.ts" />

import { state, loadState, watchprops } from "./state.js";
import { SmartDataParser } from "./importexport.js";

const math = window.math;
math.config({number: 'BigNumber'});


// funkce vyhodnocující výraz
export function makeResult() {
  const activeScope = state.activeUserScope ? state.user[state.activeUserScope] : {};
  const scope = { ...state.pamet, ...state.user.basic, ...activeScope };
  // console.log(scope);
  let node = {};
  let vysledek;

  try {
    const vyraz = vstup.textContent
      .replace(/\u00A0/g, ' ')
      .replace(/✕/g, '*')
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'pi')
      .trim();
      node = math.parse(vyraz);
  //  Přidat později na parsování vstup sady hodnot
  //   }catch(e){
  // console.log("je to na prd", node);
  //   console.log(e);
  // };
  // try {
    switch (node.type) {
      case 'SymbolNode':
        if (typeof activeScope[node.name] === 'string') {
          vysledek = math.evaluate(activeScope[node.name], scope);
        } else {
          vysledek = node.evaluate(scope);
        }
        vysledek = math.format(vysledek, state.outFormat);
        vysledek = math.evaluate(vysledek, scope);
        
        break;
      case 'AssignmentNode':
        insertAssigmentToObjekt(node.toString(), state.user);
        // testAns(node.toString(), state.vzorce, state.mem);
        vysledek = node.evaluate(scope);
        vysledek = math.format(vysledek, state.outFormat);
        math.evaluate(vysledek, scope);
        vysledek = 0;
        break;
      case 'FunctionAssignmentNode':
        insertFnToObjekt(node.toString(), state.user);
        // testAns(node.toString(), state.vzorce, state.mem);
        vysledek = math.evaluate(vyraz, scope);
        vysledek = math.format(vysledek, state.outFormat);
        vysledek = 0;
        break;
      case 'FunctionNode':
        vysledek =  node.toString();
        if (activeScope[node.name]) {
          math.evaluate(activeScope[node.name], scope);
          vysledek = math.format(vysledek, state.outFormat);
          vysledek = math.evaluate(vysledek, scope);
        }
        vysledek = math.evaluate(vysledek, scope);
        break;
      case 'BlockNode':
        const blocks = node.blocks;
        for (let i = 0; i < blocks.length; i++) {
          const result = blocks[i].node.evaluate(scope);
          if (i === blocks.length - 1) {
            vysledek = math.format(result, state.outFormat);
          }
        }
        break;
      default:  vysledek = node.evaluate(scope);
    }
    vysledek = myEvaluate(vysledek, state.DES_MIST);
    vysledek = vysledek.toString();
    vstup.textContent = vysledek;
    if (vstup.textContent != 0) pridejDoAns(state.ans, vstup.textContent, state.ANS_HISTORY);
    state.mazat = true;
  } catch (err) {
    vstup.textContent = `ERR: ${err.message}`;
    state.mazat = true;
  }
}

function myEvaluate(result, precision) {
        if (result && result.units) {
        const str = result.toString();
        const unit = str.match(/[a-zA-Z]+$/)?.[0];
        if (unit) {
            result = math.round(result, precision, math.unit(unit));
        }} else {
          result = math.round(result, precision);
        }
  return result;
    }


function pridejDoAns(pole, prvek, maxDelka) {
  pole.unshift(prvek);
  while (pole.length > maxDelka) {
    pole.pop();
  }
}

function insertFnToObjekt(str, objekt){
  const scope = state.activeUserScope;
  str = str.trim();
  const parser = new SmartDataParser();
  const nazevVzorce = parser.extractFunctionName(str);
  try {
    Reflect.set(objekt[scope], nazevVzorce, str);
    math.evaluate(str, state.pamet);
  } catch(err) {
    console.warn('Chybný vzorec ', err.message);
  }
}

function insertAssigmentToObjekt(str, objekt){
  const scope = state.activeUserScope;
  let [key, value] = str.split('=');
  key = key.trim();
  value = value.trim();
  // if (value === 'null') {
  //   if ( key in objekt[scope]){
  //     delete objekt[scope][key];
  //     return;}
  // }
  try {
    // if (scope === 'basic') {
    //   testAns(str, state.vzorce, state.mem);
    //   return;
    // }
    Reflect.set(objekt[scope], key, value);
    math.evaluate(str, state.pamet);
  } catch (err) {
    console.warn('Chybný výraz ', err.message);
  }
}


function testAns(str, pole, maxDelka) {
  const match = str.match(/^[a-z\d]+/i);
  if (!match) return pole;
  const klic = match[0];

  for (let i = 0; i < pole.length; i++) {
    const poleMatch = pole[i].match(/^[a-z\d]+/i);
    if (poleMatch && poleMatch[0] === klic) {
      pole.splice(i, 1);
      break;
    }
  }

  pridejDoAns(pole, str, maxDelka);

  try {
     math.evaluate(str, state.pamet); // <<< přidej evaluaci sem
   } catch (e) {
     console.warn(`Nepodařilo se vyhodnotit výraz "${expr}":`, e.message);
    }
  return pole;
}

