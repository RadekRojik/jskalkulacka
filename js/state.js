import { reloadstatus } from "./statusbar.js";

// const READONLY = Symbol("Read only object");

// const USER_DEFAULT = Object.freeze({basic: {READONLY: true}});

const innerState = {
  tema: 'light',
  keyboardlayout: 'default',
  treshold: 50,
  timehold: 400,
  mem: 100,
  outFormat:{fraction: 'ratio'},
  altSymbol: false,
  DES_MIST: 4,
  mazat: false,
  angle: 'deg',
  ANS_HISTORY: 10,
  activeUserScope: 'basic',
  ans: [],
  pamet: {},
  memory: {},
  user: {
    // ...USER_DEFAULT,
    basic: {}
    //   [READONLY]: true
    // }
  }
};

// console.log(innerState.user.basic);

export const temata = ["light", "dark", "ocean"];
export const rezimyUhlu = ['rad', 'deg', 'grad'];

export const watchprops = ['activeUserScope', 'ans', 'ANS_HISTORY',
  'DES_MIST', 'tema', 'angle', 'treshold', 'timehold',
  'keyboardlayout', 'memory', 'user'];


export function saveToLocal(key) {
  const val = state[key];
  localStorage.setItem(key, serialize(val));
}


export function serialize(obj) {
  return JSON.stringify(obj, null, 2);
 }

export function deserialize(json) {
  return JSON.parse(json);
}


export function loadState(obj, keys) {
  keys.forEach(k => {
    const val = localStorage.getItem(k);
    if (val !== null && val !== 'undefined') {
      try {
        Reflect.set(obj, k, deserialize(val));
        // math.import(obj[k]);
        if (k === 'vzorce' && Array.isArray(obj[k])) {
          obj[k].forEach(expr => {
            try {
              math.evaluate(expr, obj.pamet);
            } catch (e) {
              console.warn(`Nepodařilo se načíst výraz "${expr}":`, e.message);
            }
          });
        }

      } catch {
        Reflect.set(obj, k, isNaN(val) ? val : Number(val));
      }
    }
  });
}


export const state = createDeepProxy(innerState, saveToLocal);
// Object.freeze(state.user.basic);
loadState(state, watchprops);


export function walkTroughArray(array, item, step) {
  const index = array.indexOf(item);
  const pozice = index !== -1 ? index : 0;
  return array[(pozice + step) % array.length];
}

export function walkTroughObject(obj, item, step) {
  const klice = Object.keys(obj);
  const aktualni = klice.indexOf(item);
  const a = (aktualni + step + klice.length)%klice.length;
  return klice[a];
}

/* testovací objekt
elektrika: {
   proud: 10,
   napeti: 230,
   vykon: 'vykon(proud, napeti) = proud*napeti'
}
*/

function createDeepProxy(obj, callback, rootKey = null) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      // Pro metody polí (push, pop, splice atd.)
      if (typeof value === 'function' && Array.isArray(target)) {
        return function(...args) {
          const result = Reflect.apply(value, target, args);
          if (rootKey && watchprops.includes(rootKey)) {
            callback(rootKey); // zavoláme callback pro správný klíč
          }
          return result;
        };
      }

      // Pro objekty zanoříme dál a zachováme rootKey
      if (typeof value === 'object' && value !== null) {
        return createDeepProxy(value, callback, rootKey || prop);
      }

      return value;
    },
    set(target, prop, value) {
      const result = Reflect.set(target, prop, value);
      const key = rootKey || prop;
      if (watchprops.includes(key)) callback(key);
      if (['angle', 'activeUserScope'].includes(prop)) reloadstatus();
      return result;
    },
    deleteProperty(target, prop) {
      const result = Reflect.deleteProperty(target, prop);
      const key = rootKey || prop;
      if (watchprops.includes(key)) callback(key);
      return result;
    }
  });
}

window.scop = innerState;
window.des = deserialize;
window.state = state;