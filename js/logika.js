import { layouty } from './layout.js';


let aktivniIndex = 0;
let ctrlPressed = false;
let isSimulatedDown = false;
let DES_MIST = 4;
let treshold = 50;
let startX, startY = null;
let holdTimeout;
let stopTimeout;
let alt = false;
let tapAktivni = true;
let aktivniBtn = null;
let aktualniTema = 0;

const math = window.math;
const pamet = {};
const layoutNazvy = Object.keys(layouty);
const vstup = document.getElementById("vstup");
const kontejner = document.getElementById("klavesnice");
const temata = ["light", "dark", "ocean"];


// ======== Přepínání témat ========

function cyklickeTema() {
  aktualniTema = (aktualniTema + 1) % temata.length;
  document.documentElement.setAttribute("data-theme", temata[aktualniTema]);
  localStorage.setItem("tema", temata[aktualniTema]);
}

const ulozene = localStorage.getItem("tema");
if (ulozene && temata.includes(ulozene)) {
  aktualniTema = temata.indexOf(ulozene);
  document.documentElement.setAttribute("data-theme", ulozene);
}

function zmenLayout(smer) {
  aktivniIndex = (aktivniIndex + smer + layoutNazvy.length) % layoutNazvy.length;
  vykresliKlavesnici(layoutNazvy[aktivniIndex]);
}

// ======== Konec témat ========



// ======== Listenery na HW klávesnici ========

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    spocitej();
  };
  if (e.key === "Control") ctrlPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Control") ctrlPressed = false;
});

// ======== Konec HW klávesnice listenerů ========



// ======== FUNKCE =========

function vlozText(hodnota) {
  if (vstup.textContent.trim() == "0") {
    vstup.textContent = "";
  }
  vstup.textContent += alt ? hodnota?.name1 : hodnota.name;
  vstup.scrollLeft = vstup.scrollWidth;
  alt = false;
};

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

function smazat(jmeno, scope) {
  if (jmeno in scope) {
    delete scope[jmeno];
    return `Smazáno: ${jmeno}`;
  } else {
    return `Proměnná nebo funkce '${jmeno}' neexistuje.`;
  }
}


function spocitej() {
  try {
    const vyraz = vstup.textContent
      .replace(/\u00A0/g, ' ')
      .replace(/✕/g, '*')
      .trim();
    const node = math.parse(vyraz);
    let vysledek;
    if (node.type === 'BlockNode') {
      const blocks = node.blocks;
      for (let i = 0; i < blocks.length; i++) {
        const result = blocks[i].node.evaluate(pamet);
        // pokud je to poslední výraz, ulož ho jako výsledek
        if (i === blocks.length - 1) {
          vysledek = result;
        }
      }
    } else {
      vysledek = node.evaluate(pamet);
      if (node.type === 'AssignmentNode' || node.type === 'FunctionAssignmentNode') {
        vysledek = 0; // potlačení výstupu
      }
    }
    if (vysledek && typeof vysledek.toString === 'function') {
      vysledek = math.format(vysledek, { precision: DES_MIST });
    }
    vstup.textContent = String(vysledek ?? 0);
  } catch (err) {
    vstup.textContent = `Chyba: ${err.message}`;
  }
}

function del() {
  vstup.textContent = vstup.textContent.trim() != "0" ? vstup.textContent.slice(0, -1) : "0";
}

function smaz() {
  vstup.textContent = "0";
}

// ======== Konec funkcí =========




// dispatch tabulka :)
const funkce = {
  vlozText,
  spocitej,
  smaz,
  del,
  cyklickeTema,
}



function vykresliKlavesnici(layoutNazev) {
  kontejner.innerHTML = "";
  const layout = layouty[layoutNazev];
  kontejner.style.gridTemplateColumns = `repeat(${layout.columns}, 1fr)`;

  layout.keys.forEach((def) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<span class="key-main">${def.name}</span>`;
    btn.innerHTML += def.name1 ? `<span class="key-alt">${def.name1}</span>` : "";
    btn.classList.add("key-button", def.cssClass);
    btn.style.gridRow = `span ${def.rowSpan ?? 1}`;
    btn.style.gridColumn = `span ${def.colSpan ?? 1}`;
    if (def.colSpan > 1) btn.classList.add("wide");
    btn.def = def;

    // btn.addEventListener("pointerleave", () => {
    //   clearTimeout(btn.holdTimeout);
    //   btn.classList.remove("show-alt");
    // });

    // btn.addEventListener("pointercancel", () => {
    //   clearTimeout(btn.holdTimeout);
    //   btn.classList.remove("show-alt");
    // });

    kontejner.appendChild(btn);
  });
};


function zpracujTap(target) {
  const btn = target.closest("button");
  const def = btn?.def;
  if (!def) return;
  if (!tapAktivni) return;
  const f = funkce[def.fn];
  if (typeof f === "function") f(def);
}

function zpracujPodrzeni(target) {
  const btn = target.closest("button");
  const def = btn?.def;
  if (!def) return;
  const f = funkce[def.fn1 ? def.fn1 : def.fn];
  alt = def.name1 ? true : false;
  if (typeof f === "function") f(def);
}


kontejner.addEventListener("pointermove", (e) => {
  if (!ctrlPressed) return;

  if (!isSimulatedDown) {
    emitSimulatedEvent("pointerdown", e);
    isSimulatedDown = true;
  }

  clearTimeout(stopTimeout);
  stopTimeout = setTimeout(() => {
    if (isSimulatedDown) {
      emitSimulatedEvent("pointerup", e);
      isSimulatedDown = false;
    }
  }, 200);
});

function emitSimulatedEvent(type, original) {
  const simulated = new PointerEvent(type, {
    bubbles: true,
    ctrlKey: true,
    clientX: original.clientX,
    clientY: original.clientY,
    pointerId: original.pointerId,
    pointerType: original.pointerType,
    buttons: original.buttons,
  });

  original.target.dispatchEvent(simulated);
}


// #######################################
// fce swipe
// –––––––––––––––––––––––––––––––––––––––

kontejner.addEventListener("pointerdown", e => {
  startX = e.clientX;
  startY = e.clientY;
  tapAktivni = true;
  aktivniBtn = e.target.closest("button");
  holdTimeout = setTimeout(() => {
    tapAktivni = false;
    aktivniBtn.classList.add("show-alt");
    zpracujPodrzeni(aktivniBtn);
  }, 400);
},
  { passive: false }
);


kontejner.addEventListener("pointerup", e => {
  clearTimeout(holdTimeout);
  const endX = e.clientX;
  const endY = e.clientY;
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  aktivniBtn.classList.remove("show-alt");

  if ((Math.abs(Math.hypot(deltaX, deltaY)) < treshold) && !ctrlPressed) {
    zpracujTap(aktivniBtn);
    return;
  };

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // console.log(deltaX < 0 ? "vlevo" : "vpravo");
    zmenLayout(deltaX < 0 ? -1 : 1);
    return;
  } else {
    //   console.log(deltaY < 0 ? "nahoru" : "dolu");
    deltaY < 0 ? spocitej() : vlozText({ name: '+' });
    return;
  };
},
  { passive: false }
);

// ======== START =========
vykresliKlavesnici("default");
// swipe(kontejner, 50);

