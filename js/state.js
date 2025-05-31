import { reloadstatus } from "./statusbar.js";

const innerState = {
  tema: 'light',
  keyboardlayout: 'default',
  treshold: 50,
  timehold: 400,
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
  const val = innerState[key];
  console.log(val);
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
        console.log(key, " *** ",value.source);
        return eval('(' + value.source + ')');
      } catch (e) {
        console.warn('Chyba při obnově funkce:', e.message);
        return undefined;
      }
    }
    return value;
  });
}


function deepProxy(obj, key, saveFn) {
  if (typeof obj !== 'object' || obj === null) return obj;

  const handler = {
    get(target, prop) {
      const value = target[prop];
      return typeof value === 'object' && value !== null
        ? deepProxy(value, key, saveFn)
        : value;
    },
    set(target, prop, value) {
      target[prop] = deepProxy(value, key, saveFn);
      saveFn(key);
      return true;
    }
  };

  if (Array.isArray(obj)) {
    ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(fn => {
      handler.get = (target, prop) => {
        if (fn === prop) {
          return (...args) => {
            const result = Array.prototype[fn].apply(target, args);
            saveFn(key);
            return result;
          };
        }
        const value = target[prop];
        return typeof value === 'object' && value !== null
          ? deepProxy(value, key, saveFn)
          : value;
      };
    });
  }

  return new Proxy(obj, handler);
}


export function loadState(obj, keys) {
  keys.forEach(k => {
    const val = localStorage.getItem(k);
    if (val !== null && val !== 'undefined') {
      try {
        obj[k] = deserialize(val);  // Použij přímo deserialize()
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

for (const k of watchprops) {
  if (typeof innerState[k] === 'object' && innerState[k] !== null) {
    innerState[k] = deepProxy(innerState[k], k, saveToLocal);
  }
}

export const state = new Proxy(innerState, {
  set(obj, prop, value) {
    if (watchprops.includes(prop)) {
      if (typeof value === 'object' && value !== null) {
        value = deepProxy(value, prop, saveToLocal);
        saveToLocal(prop);
      } else {
        localStorage.setItem(prop, JSON.stringify(value));
      }
    }
    if (['angle'].includes(prop)) {
      reloadstatus();
    }
    obj[prop] = value;
    return true;
  },
  get(obj, prop) {
    return obj[prop];
  }
});

export function walkTroughArray(array, item, step) {
  const index = array.indexOf(item);
  const pozice = index !== -1 ? index : 0;
  return array[(pozice + step) % array.length];
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
