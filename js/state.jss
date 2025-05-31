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

// Mapa pro sledování všech proxy objektů, aby se nevytvářely duplicitně
const proxyMap = new WeakMap();

export function saveToLocal(key) {
  const val = innerState[key];
  console.log(`Ukládám ${key}:`, val); // Debug
  localStorage.setItem(key, serialize(val));
}

export function serialize(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'function') {
      return { __isFunction__: true, source: value.toString() };
    }
    return value;
  }, 2);
}

export function deserialize(json) {
  return JSON.parse(json, (key, value) => {
    if (value && value.__isFunction__ && value.source) {
      try {
        console.log(key, " *** ", value.source);
        return eval('(' + value.source + ')');
      } catch (e) {
        console.warn('Chyba při obnově funkce:', e.message);
        return undefined;
      }
    }
    return value;
  });
}

function deepProxy(obj, rootKey, saveFn, path = []) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  // Pokud už je objekt proxy, vrať ho
  if (proxyMap.has(obj)) {
    return proxyMap.get(obj);
  }

  const handler = {
    get(target, prop) {
      const value = target[prop];
      
      // Pro objekty/pole vytvoř proxy rekurzivně
      if (typeof value === 'object' && value !== null) {
        const newPath = [...path, prop];
        return deepProxy(value, rootKey, saveFn, newPath);
      }
      
      return value;
    },
    
    set(target, prop, value) {
      // Pro objekty/pole vytvoř proxy
      if (typeof value === 'object' && value !== null) {
        const newPath = [...path, prop];
        value = deepProxy(value, rootKey, saveFn, newPath);
      }
      
      target[prop] = value;
      saveFn(rootKey);
      return true;
    }
  };

  // Pro pole - zachyť array metody
  if (Array.isArray(obj)) {
    const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 
                         'sort', 'reverse', 'fill', 'copyWithin'];
    
    arrayMethods.forEach(methodName => {
      if (typeof obj[methodName] === 'function') {
        const originalMethod = obj[methodName];
        Object.defineProperty(obj, methodName, {
          value: function (...args) {
            // Pro nové prvky, které jsou objekty/pole, vytvoř proxy
            if (['push', 'unshift', 'splice'].includes(methodName)) {
              const newItems = methodName === 'splice' ? args.slice(2) : args;
              for (let i = 0; i < newItems.length; i++) {
                if (typeof newItems[i] === 'object' && newItems[i] !== null) {
                  newItems[i] = deepProxy(newItems[i], rootKey, saveFn, [...path, 'item']);
                }
              }
            }
            
            const result = originalMethod.apply(this, args);
            saveFn(rootKey);
            return result;
          },
          writable: true,
          configurable: true
        });
      }
    });
  }

  const proxiedObj = new Proxy(obj, handler);
  proxyMap.set(obj, proxiedObj);
  proxyMap.set(proxiedObj, proxiedObj); // i proxy sám na sebe
  
  return proxiedObj;
}

export function loadState(obj, keys) {
  keys.forEach(k => {
    const val = localStorage.getItem(k);
    if (val !== null && val !== 'undefined') {
      try {
        obj[k] = deserialize(val);
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

// Načti stav z localStorage
loadState(innerState, watchprops);

// Vytvoř proxy pro všechny existující objekty/pole
for (const k of watchprops) {
  if (typeof innerState[k] === 'object' && innerState[k] !== null) {
    innerState[k] = deepProxy(innerState[k], k, saveToLocal);
  }
}

// Hlavní proxy
export const state = new Proxy(innerState, {
  set(obj, prop, value) {
    // Pro objekty/pole vytvoř proxy
    if (watchprops.includes(prop) && typeof value === 'object' && value !== null) {
      value = deepProxy(value, prop, saveToLocal);
      localStorage.setItem(prop, serialize(value));
    } else if (watchprops.includes(prop)) {
      localStorage.setItem(prop, serialize(value));
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

// Funkce pro ruční přidání nového user scope s proxy
export function addUserScope(scopeName) {
  if (!state.user[scopeName]) {
    state.user[scopeName] = {};
    // Proxy se vytvoří automaticky díky deepProxy v user objektu
  }
}

// Debug funkce pro ověření proxy
export function debugProxyState() {
  console.log('innerState.user:', innerState.user);
  console.log('state.user:', state.user);
  console.log('Jsou stejné?', innerState.user === state.user);
  
  if (innerState.user.elektrika) {
    console.log('innerState.user.elektrika:', innerState.user.elektrika);
    console.log('state.user.elektrika:', state.user.elektrika);
  }
}

// Debug exports
window.scop = innerState;
window.des = deserialize;
