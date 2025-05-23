import { reloadstatus } from "./statusbar.js";

const innerState = {
  tema: 'light',
  keyboardlayout: 'default',
  treshold: 50,  // práh mezi tapem a swipem
  timehold: 400,  // čas na přidržení
  altSymbol: false,  // pomocná proměnná jestli se má aktivovat alternativní symbol
  DES_MIST: 4,  // počet platných desetinných míst
  mazat: false,  // pomocná proměnná jestli se má mazat displej
  angle: 'deg',  // preferované úhlové jednotky
  ANS_HISTORY: 10,  // Jak velká historie výsledků
  ans: [],  // Pole výsledků
  pamet: {
    default: {},
  },  // globální paměť
  vzorce: {},  // globální vzorce
  gfunkce: {},
};

export const temata = ["light", "dark", "ocean"];  //Barevná schémata. Později možná generováno z objektu
export const rezimyUhlu = ['rad', 'deg', 'grad'];

const watchprops = ['ans', 'ANS_HISTORY', 'DES_MIST', 'tema', 'angle', 'treshold', 'timehold', 'keyboardlayout', 'pamet'];  // pole hlídaných vlastností

// Proxy na automatické čtení a ukládání proměnných v objektu
export const state = new Proxy(innerState, {
  set(obj, prop, value) {
    if (watchprops.includes(prop)) {
      localStorage.setItem(prop, value);
    }
    if (['angle', 'pamet'].includes(prop)) {
      reloadstatus();
    }
    obj[prop] = value;
    return true;
  },
  get(obj, prop){
    if (watchprops.includes(prop)){
      return localStorage.getItem(prop) || obj[prop];
    }
    return obj[prop];
  },
});


// Přijme pole, hledaný prvek a krok k dalšímu prvku
// Vrací hodnotu prvku o 'step' kroků dál
export function walkTroughArray(array, item, step){
  const index = array.indexOf(item);  // načte pozici hledaného prvku
  const pozice = index !== -1 ? index : 0;  // pokud se prvek v poli nenachází vrátí pozici prvního prvku
  return array[(pozice + step)%array.length];  // podle kroku vrátí název dalšího|předchozího prvku
}

// Natáhne hodnoty z localStorage do objektu
function loadState(obj, keys) {
  keys.forEach(k => {
    const val = localStorage.getItem(k);
    if (val !== null && val !== 'undefined') {
      obj[k] = isNaN(val) ? val : Number(val);
    }
  });
}

loadState(innerState, watchprops);
