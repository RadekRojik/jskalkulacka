import { state, walkTroughArray, temata } from './state.js';


export function cyklickeTema(){
  const dalsi = walkTroughArray(temata, state.tema, 1);
  document.documentElement.setAttribute("data-theme", dalsi);
  state.tema = dalsi;
}

document.documentElement.setAttribute("data-theme", state.tema);

const mozneRezimy = ['rad', 'deg', 'grad'];
let aktualniIndexUhlu = 0;
// let aktualniRezimUhlu = mozneRezimy[aktualniIndexUhlu];

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

  state.angle = rezim;
}


export function mod_uhly() {
  // posuň index cyklicky
  aktualniIndexUhlu = (aktualniIndexUhlu + 1) % mozneRezimy.length;
  aktualniRezimUhlu = mozneRezimy[aktualniIndexUhlu];
  nastavTrigRezim(state.pamet, aktualniRezimUhlu);
  // return aktualniRezimUhlu;
}

const uhel = localStorage.getItem("angle");
if (uhel && mozneRezimy.includes(uhel)) {
  aktualniIndexUhlu = mozneRezimy.indexOf(uhel);
  nastavTrigRezim(state.pamet, uhel);
} else {
  nastavTrigRezim(state.pamet, state.angle)
}
