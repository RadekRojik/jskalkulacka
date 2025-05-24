import { state, walkTroughArray, temata, rezimyUhlu } from './state.js';


// Přepínání mezi tématy, cyklicky pořád do kola
export function cyklickeTema(){
  const dalsi = walkTroughArray(temata, state.tema, 1);
  document.documentElement.setAttribute("data-theme", dalsi);
  state.tema = dalsi;
}

// Inicializační astavení tématu
document.documentElement.setAttribute("data-theme", state.tema);


// Nastavení trigonometrického režimu
export function nastavTrigRezim(pamet, rezim) {
  const primeFunkce = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'];
  const inverzniFunkce = ['asin', 'acos', 'atan', 'asec', 'acsc', 'acot'];

  const uhel = x => math.unit(x, rezim);

  // Přímé funkce: sin(x) → sin(unit(x, 'deg'))
  primeFunkce.forEach(jmeno => {
    pamet[jmeno] = x => math[jmeno](uhel(x));
  });

  // Inverzní funkce: asin(x) → unit(asin(x), 'deg').value
  inverzniFunkce.forEach(jmeno => {
    pamet[jmeno] = x => math.unit(math[jmeno](x), 'rad').toNumber(rezim);
  });

  // Dvouargumentová atan2
  pamet.atan2 = (y, x) => math.unit(math.atan2(y, x), 'rad').toNumber(rezim);

}


// Přepínání mezi úhly
export function mod_uhly(){
  const dalsi = walkTroughArray(rezimyUhlu, state.angle, 1);
  state.angle = dalsi;
  nastavTrigRezim(state.gfunkce, dalsi);
  return dalsi;
}


// Inicializace úhlu
nastavTrigRezim(state.gfunkce, state.angle);
