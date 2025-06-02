import { reloadstatus } from "./statusbar.js";

export const innerState = {
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
  vzorce: [],
  user: {
    basic: {}
  }
};

export const temata = ["light", "dark", "ocean"];
export const rezimyUhlu = ['rad', 'deg', 'grad'];

export const watchprops = ['activeUserScope', 'ans', 'ANS_HISTORY',
  'DES_MIST', 'tema', 'angle', 'treshold', 'timehold',
  'keyboardlayout', 'vzorce', 'user'];


export function saveToLocal(key) {
  const val = state[key];
  // console.log('ukládám: ', val);
  localStorage.setItem(key, serialize(val));
}


export function serialize(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'function') {
      return { __isFunction__: true, source: value.toString() };
    }
    return value;
  }, 2); // pěkně formátovaný JSON
}

export function deserialize(json) {
  return JSON.parse(json, (key, value) => {
    if (value && value.__isFunction__ && value.source) {
      try {
        // console.log(key, " *** ",value.source);
        return eval('(' + value.source + ')');
      } catch (e) {
        console.warn('Chyba při obnově funkce:', e.message);
        return undefined;
      }
    }
    return value;
  });
}


export function loadState(obj, keys) {
  keys.forEach(k => {
    const val = localStorage.getItem(k);
    if (val !== null && val !== 'undefined') {
      try {
        obj[k] = deserialize(val);
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
        obj[k] = isNaN(val) ? val : Number(val);
      }
    }
  });
}


loadState(innerState, watchprops);


export const state = createDeepProxy(innerState, saveToLocal);

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
window.scop = innerState;
window.des = deserialize;

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
