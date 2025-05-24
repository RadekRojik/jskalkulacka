// events.js
import { state } from './state.js';

let kontejner;
let funkce = {};
let zmenLayoutRef;

let ctrlPressed = false;
let isSimulatedDown = false;
// let state.treshold = 50;
let startX, startY = null;
let holdTimeout;
let stopTimeout;
let tapAktivni = true;
let aktivniBtn = null;

export function initEventHandlers({ container, dispatchTable, zmenLayout }) {
  kontejner = container;
  funkce = dispatchTable;
  zmenLayoutRef = zmenLayout;
  const vstup = document.getElementById('vstup');
  document.getElementById('swipleft').addEventListener('click', () => { zmenLayoutRef(-1); });
  document.getElementById('swipright').addEventListener('click', () => { zmenLayoutRef(1); });


  vstup.addEventListener('pointerleave', () => {
    if (document.activeElement === vstup) {
      vstup.blur();
    }
  });

  // HW klávesnice
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      funkce.spocitej();
    }
    if (e.key === "Control") ctrlPressed = true;
    if (document.activeElement === vstup) return;
    if (e.key.length === 1) {
      const kuk = { name: e.key };
      funkce.vlozText(kuk);
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Control") ctrlPressed = false;
    if (document.activeElement === vstup) return;
    if (e.key === "Backspace") funkce.del();
    if (e.key === "Delete") funkce.del();
    if (e.key === "Escape") funkce.smaz();
    if (e.key === "ArrowLeft") zmenLayoutRef(-1);
    if (e.key === "ArrowRight") zmenLayoutRef(1);
  });

  // pohyb
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

  kontejner.addEventListener("pointerdown", e => {
    startX = e.clientX;
    startY = e.clientY;
    tapAktivni = true;
    aktivniBtn = e.target.closest("button");
    holdTimeout = setTimeout(() => {
      tapAktivni = false;
      aktivniBtn.classList.add("show-alt");
      zpracujPodrzeni(aktivniBtn);
    }, state.timehold);
  }, { passive: false });

  ["pointerup", "pointercancel", "pointerleave"].forEach((typ) => {
    kontejner.addEventListener(typ, (e) => {
      clearTimeout(holdTimeout);
      aktivniBtn?.classList.remove("show-alt");

      const endX = e.clientX;
      const endY = e.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (typ === "pointerup" && (Math.abs(Math.hypot(deltaX, deltaY)) < state.treshold) && !ctrlPressed) {
        zpracujTap(aktivniBtn);
        return;
      }

      if (typ === "pointerup") {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          zmenLayoutRef(deltaX < 0 ? -1 : 1);
        } else {
          deltaY < 0 ? funkce.spocitej() : funkce.vlozText({ name: '+' });
        }
      }
    }, { passive: false });
  });
}

export function emitSimulatedEvent(type, original) {
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

export function zpracujTap(target) {
  const btn = target.closest("button");
  const def = btn?.def;
  if (!def) return;
  if (!tapAktivni) return;
  const f = funkce[def.fn];
  if (typeof f === "function") f(def);
}


export function zpracujPodrzeni(target) {
  const btn = target.closest("button");
  const def = btn?.def;
  if (!def) return;
  const f = funkce[def.fn1 ? def.fn1 : def.fn];
  // setAltSymbol(!!def.name1);
  state.altSymbol = !!def.name1;
  if (typeof f === "function") f(def);
}
