import { state } from "./state.js";
import { cyklickeTema, mod_uhly } from "./theming.js";
import { reloadstatus } from "./statusbar.js";

// Skok na index.html
function goToIndex(){
    window.location.href = "index.html";
}


// výpis paměti
function vypisPamet(scope) {
  const vysledek = [];
  for (const [jmeno, hodnota] of Object.entries(scope)) {
    let typ = typeof hodnota;
    let zobrazeni;
    if (typeof hodnota === 'function') {
      typ = 'funkce';
      zobrazeni = hodnota.toString();
    } else if (typeof hodnota === 'object' && hodnota?.isUnit) {
      typ = 'jednotka';
      zobrazeni = `${hodnota.toNumber(hodnota.units[0].unit.name)} ${hodnota.units[0].unit.name}`;
    } else {
      zobrazeni = String(hodnota);
    }
    vysledek.push(`${jmeno}: [${typ}] ${zobrazeni}`);
  }
  return vysledek.join('\n');
}


// mazání výrazu z paměti
function smazat(jmeno, scope) {
  if (jmeno in scope) {
    delete scope[jmeno];
    return `Smazáno: ${jmeno}`;
  } else {
    return `Proměnná nebo funkce '${jmeno}' neexistuje.`;
  }
}


function ukapamet (e) {
    e.target.nextElementSibling.textContent = vypisPamet(state.pamet);
    // console.log(state);
}


// dispatch tabulka na tlacitka
const tabulka = {
    btnTema: cyklickeTema,
    uhly: () => {mod_uhly(); reloadstatus();},
    ukapamet: ukapamet,
    zpet: goToIndex,
}

function dispatch(event, table) {
    if (Object.keys(table).includes(event.target.id)){
        table[event.target.id](event);
    }
}

document.addEventListener('click', e => {dispatch(e, tabulka);});

reloadstatus();