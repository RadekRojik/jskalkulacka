import { layouty } from './layout.js';

const layoutNazvy = Object.keys(layouty);
let aktivniIndex = 0;
let ctrlPressed = false;
let isSimulatedDown = false;
let stopTimeout;
let DES_MIST = 4;
let treshold = 50;
let startX, startY = null;
let holdTimeout;
const vstup = document.getElementById("vstup");
const kontejner = document.getElementById("klavesnice");


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

// ======== FUNKCE =========

function vlozText(hodnota) {
  vstup.textContent += hodnota.name;
  vstup.scrollLeft = vstup.scrollWidth;
};

function spocitej() {
  try {
    let vysledek = math.evaluate(vstup.textContent);
    vstup.textContent = formatVysledek(vysledek, DES_MIST);
  } catch {
    vstup.textContent = "ERR";
  }
};

function del() {
  vstup.textContent = vstup.textContent.slice(0, -1);
}

function smaz() {
  vstup.textContent = "0";
};

// ======== Konec funkcí =========

function formatVysledek(vysledek, desMist) {
  if (Number.isInteger(vysledek)) return vysledek;
  return +vysledek.toFixed(desMist);
}


function zmenLayout(smer) {
  aktivniIndex = (aktivniIndex + smer + layoutNazvy.length) % layoutNazvy.length;
  vykresliKlavesnici(layoutNazvy[aktivniIndex]);
}

// dispatch tabulka :)
const funkce = {
  vlozText,
  spocitej,
  smaz,
  del,
};



function vykresliKlavesnici(layoutNazev) {
  kontejner.innerHTML = "";

  const layout = layouty[layoutNazev];
  kontejner.style.gridTemplateColumns = `repeat(${layout.columns}, 1fr)`;

  layout.keys.forEach((def) => {
    const btn = document.createElement("button");
    btn.textContent = def.name;
    btn.className = def.cssClass;
    btn.style.gridRow = `span ${def.rowSpan ?? 1}`;
    btn.style.gridColumn = `span ${def.colSpan ?? 1}`;
    btn.def = def;
    kontejner.appendChild(btn);
  });
};

function zpracujTap(target) {
  const def = target?.def;
  if (!def) return;
  const f = funkce[def.fn];
  if (typeof f === "function") f(def);
}

function zpracujPodrzeni(target) {
  // console.log(target.textContent);
  const def = target?.def;
  if (!def) return;
  const f = funkce[def.fn1];
  if (typeof f === "function") f(def);
  // console.log("fn1:", def.fn1);
  // console.log("funkce[fn1]:", funkce[def.fn1]);

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
    clientX: original.clientX,
    clientY: original.clientY,
    pointerId: original.pointerId,
    pointerType: original.pointerType,
    ctrlKey: true,
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
  // let tapAktivni = true;

  holdTimeout = setTimeout(() => {
    // tapAktivni = false;
    zpracujPodrzeni(e.target);
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

  if ((Math.abs(Math.hypot(deltaX, deltaY)) < treshold) && !ctrlPressed) {
    zpracujTap(e.target);
    return;
  };

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // console.log(deltaX < 0 ? "vlevo" : "vpravo");
    zmenLayout(deltaX < 0 ? -1 : 1);
    return;
    }else{
    //   console.log(deltaY < 0 ? "nahoru" : "dolu");
    deltaY < 0 ? spocitej() : vlozText({name: '+'});
      return;
  };
},
  { passive: false }
);

// ======== START =========
vykresliKlavesnici("default");
// swipe(kontejner, 50);

