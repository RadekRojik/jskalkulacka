import { layouty } from './layout.js';

const layoutNazvy = Object.keys(layouty);
let aktivniIndex = 0;
let DES_MIST = 4;

// ======== FUNKCE =========

function vlozText(hodnota) {
  const vstup = document.getElementById("vstup");
  vstup.value += hodnota.name;
  vstup.scrollLeft = vstup.scrollWidth;
};

function spocitej() {
  const vstup = document.getElementById("vstup");
  try {
    let vysledek  = math.evaluate(vstup.value);
    vstup.value = formatVysledek(vysledek, DES_MIST);
  } catch {
    vstup.value = "ERR";
  }
};

function smaz() {
  const vstup = document.getElementById("vstup");
  vstup.value = "";
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
};


const kontejner = document.getElementById("klavesnice");

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

  //   btn.addEventListener("pointerdown", () => {
  //   try {
  //     // funkce[def.fn](def.name); // přímé volání jako ve slovníku
  //     funkce[def.fn](def); // přímé volání jako ve slovníku
  //   } catch (err) {
  //     console.error("Chyba při volání funkce:", def.fn, err);
  //   };

  // });
    kontejner.appendChild(btn);
  });
};

function zpracujTap(target) {
  const def = target?.def;
  if (!def) return;
  const f = funkce[def.fn];
  if (typeof f === "function") f(def);
}

function swipe(element, treeshold){
  let startX, startY;
  element.addEventListener("pointerdown", e => {
  // startX = e.touches[0].clientX;
  // startY = e.touches[0].clientY;
  startX = e.clientX;
  startY = e.clientY;
  }, { passive: false });

// element.addEventListener("touchmove", e => {
//   e.preventDefault();
// }, { passive: false });

  element.addEventListener("pointerup", e => {
    // const endX = e.changedTouches[0].clientX;
    // const endY = e.changedTouches[0].clientY;
    const endX = e.clientX;
    const endY = e.clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    if (Math.abs(Math.hypot(deltaX, deltaY)) < treeshold) {
      zpracujTap(e.target);
      return;};
    // const pomer = Math.abs(deltaY / deltaX);
    // if (pomer < 1){
    if (Math.abs(deltaX) > Math.abs(deltaY)){
        // console.log(deltaX < 0 ? "vlevo" : "vpravo");
        zmenLayout(deltaX < 0 ? -1 : 1);
        return;
      // }else{
      //   console.log(deltaY < 0 ? "nahoru" : "dolu");
      //   return;
      };
  }, { passive: false });
};

// ======== START =========
vykresliKlavesnici("default");
swipe(kontejner, 50);

// test objektů
// console.log("********", Object.keys(layouty)[1]);
// console.log("############", layouty[1]);
