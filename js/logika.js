import { layouty } from './layout.js';

const layoutNazvy = Object.keys(layouty);
let aktivniIndex = 0;

// ======== FUNKCE =========

function vlozText(hodnota) {
  const vstup = document.getElementById("vstup");
  vstup.value += hodnota;
  vstup.scrollLeft = vstup.scrollWidth;
};

function spocitej() {
  const vstup = document.getElementById("vstup");
  try {
    vstup.value = math.evaluate(vstup.value);
  } catch {
    vstup.value = "ERR";
  }
};

function smaz() {
  const vstup = document.getElementById("vstup");
  vstup.value = "";
};

// ======== Konec funkcí =========


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

    btn.addEventListener("click", () => {
    try {
      funkce[def.fn](def.name); // přímé volání jako ve slovníku
    } catch (err) {
      console.error("Chyba při volání funkce:", def.fn, err);
    };

  });
    kontejner.appendChild(btn);
  });
};
  
function swipe(element, treeshold){
  let startX, startY;
  element.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  }, { passive: true });

  element.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    if (Math.abs(Math.hypot(deltaX, deltaY)) < treeshold) return;
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
  }, { passive: true });
};

// ======== START =========
vykresliKlavesnici("default");
swipe(kontejner, 50);

// test objektů
// console.log("********", Object.keys(layouty)[1]);
// console.log("############", layouty[1]);
