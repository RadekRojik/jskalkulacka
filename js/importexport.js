import { state, serialize, deserialize } from "./state.js";

// Export uživatelského scope do JSON (pro textarea)
export function exportUserScope(scopeName) {
  const scope = state.user?.[scopeName];
  if (!scope) {
    // console.warn(`Scope '${scopeName}' neexistuje.`);
    return '';
  }
  const obj = { [scopeName]: scope };
  return serialize(obj);
}

// Import uživatelského scope z JSON (textarea)
export function importUserScope(text) {
  let obj = null;

  // Zkusíme JSON
  try {
    obj = deserialize(text);
    // console.log('Načteno jako JSON/deserialize.');
  } catch (jsonErr) {
    // Pokud JSON selže, zkusíme JS objekt literal
    try {
      obj = (new Function('return {' + text + '}'))();
      // console.log('Načteno jako JavaScript literal.');
    } catch (jsErr) {
      // console.error('Chyba při importu:', jsErr.message);
      return false;
    }
  }

  if (typeof obj !== 'object' || obj === null) {
    // console.warn('Neplatný formát.');
    return false;
  }

  Object.entries(obj).forEach(([name, scope]) => {
    state.user[name] = scope;
  });

  // console.log('Import úspěšný:', Object.keys(obj));
  return true;
}
