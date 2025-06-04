import { state, serialize, deserialize } from "./state.js";


const JSON5 = window.JSON5;

// Export uživatelského scope do JSON (pro textarea)
export function exportUserScope(scopeName) {
  const scope = state.user?.[scopeName];
  if (!scope) {
    console.warn(`Scope '${scopeName}' neexistuje.`);
    return '';
  }
  const obj = { [scopeName]: scope };
  return serialize(obj);
}


export function importUserScope(text) {
  text = '{ ' + text + ' }';
  console.log(text);
  const vstup = JSON5.parse(text);
  // const scope = state.user?.[scopeName];
  try {
    Object.entries(vstup).forEach(([name, scope]) => {
    state.user[name] = scope;
  });
    // state.user += vstup;
  }
  catch (err) {
    console.warn('ERROR na: ', err);
    }
}