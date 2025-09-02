# JS Kalkulačka (PWA)

[🇨🇿 Čeština](#cz) | [🇩🇪 Deutsch](#de)

---

<a name="cz"></a>
## 🇨🇿 CZ

Praktická kalkulačka pro „pracující lidi“, která umožní tvořit vlastní **scopy** (prostory) s proměnnými a vzorci, rychle je používat, sdílet a mít je vždy po ruce i **offline**.

---

### 1) Přehled
- **PWA**: funguje offline, lze „nainstalovat“ do telefonu/PC.
- **Vlastní scopy**: libovolné sady proměnných a funkcí.
- **Virtuální klávesnice**: gesta, dlouhé podržení, přepínatelné layouty.
- **HW klávesnice**: Enter = výpočet, Ctrl+šipky přepínají layouty.
- **Úhly**: přepínání deg / rad / grad.
- **Témata**: light / dark / ocean.
- **Paměti M1/M2**: rychlé uložení/vložení.
- **Historie Ans**: práce jen s posledním výsledkem.

---

### 2) Instalace & spuštění

[Kalkulačka](https://radekrojik.github.io/jskalkulacka/index.html)

#### Android
1. Otevři kalkulačku v **Chrome** nebo **Edge**.
2. V nabídce vyber **Přidat na plochu**.
3. Potvrď. Ikona se objeví mezi aplikacemi.

#### iPhone / iPad (Safari)
1. Otevři v **Safari**.
2. Klepni na ikonu sdílení.
3. Vyber **Přidat na plochu**.
4. Potvrď. Ikona se přidá na plochu.

#### PC
- V Chrome/Edge použij tlačítko **Instalovat aplikaci** v adresním řádku.

---

### 3) Uživatelské rozhraní
- **Displej**: nahoře scope a mód úhlů.
- **Virtuální klávesnice**: tap = akce, podržení = alternativa, swipe vlevo/vpravo = přepínání layoutů, swipe nahoru/dolů = `*`/`+`.
- **HW klávesnice**: Enter = výpočet, Esc = smazat, Backspace/Delete = mazání, Ctrl+šipky = přepínání layoutů.

---

### 4) Scopy, proměnné a funkce
- Scope = pojmenovaný prostor s proměnnými/vzorci.
- **Sc**: krátký tap přepíná scopy, dlouhý tap (**Set**) přejde do nastavení.
- Proměnná: `a = 5`.
- Funkce: `f(x,y) = x*y + 3`.
- Uživatelská klávesnice se generuje z obsahu scope.

---

### 5) Paměti M1/M2
- Tap = vložit hodnotu.
- Podržení = uložit aktuální vstup.

---

### 6) Historie a `Ans`
- Ukládá se jen poslední výsledek.
- **Ans** (dlouhý tap na `=`) vloží tento výsledek.

---

### 7) Úhly
- Přepínání mění chování trigonometrických funkcí.

---

### 8) Témata
- **light**, **dark**, **ocean**.

---

### 9) Výstup, přesnost, jednotky
- Zaokrouhlení na 4 desetinná místa.
- Při chybě: `ERR: ...`.
- Příklad: `2 m + 30 cm` → `2.3 m`.

---

### 10) Nastavení
- Přepínání témat a úhlů.
- Správa položek ve scope.
- Import/Export ve formátu JSON, JSON5 nebo jednoduchý text.

---

### 11) Ukládání dat
- Všechno se ukládá do localStorage.

---

### 12) Sdílení scope s kolegy
1. Exportuj scope.
2. Pošli JSON/JSON5 kolegům.
3. Oni provedou import.

---

### 13) FAQ
- **Offline?** Ano, po instalaci.
- **Sdílení?** Export/import.
- **Úhly?** V nastavení.
- **Paměť M1?** Podrž M1 pro uložení.

---

<a name="de"></a>
## 🇩🇪 DE

Praktischer Rechner für „arbeitende Menschen“, mit dem man eigene **Scopes** (Bereiche) mit Variablen und Formeln erstellen, schnell benutzen, teilen und auch **offline** verfügbar haben kann.

---

### 1) Übersicht
- **PWA**: funktioniert offline, kann auf Handy/PC installiert werden.
- **Eigene Scopes**: beliebige Sätze von Variablen und Funktionen.
- **Virtuelle Tastatur**: Gesten, langes Drücken, wechselbare Layouts.
- **Hardware-Tastatur**: Enter = Berechnung, Ctrl+Pfeile wechseln Layout.
- **Winkel**: deg / rad / grad.
- **Themen**: light / dark / ocean.
- **Speicher M1/M2**: schnelles Speichern/Abrufen.
- **Ans-Verlauf**: nur letztes Ergebnis nutzbar.

---

### 2) Installation & Start

[Rechner](https://radekrojik.github.io/jskalkulacka/index.html)

#### Android
1. Rechner in **Chrome** oder **Edge** öffnen.
2. Im Menü **Zum Startbildschirm hinzufügen** wählen.
3. Bestätigen. Symbol erscheint unter den Apps.

#### iPhone / iPad (Safari)
1. In **Safari** öffnen.
2. Auf Teilen-Symbol tippen.
3. **Zum Home-Bildschirm** wählen.
4. Bestätigen. Symbol wird auf dem Homescreen hinzugefügt.

#### PC
- In Chrome/Edge die Schaltfläche **App installieren** in der Adressleiste nutzen.

---

### 3) Benutzeroberfläche
- **Anzeige**: oben Scope und Winkelmodus.
- **Virtuelle Tastatur**: Tippen = Aktion, langes Drücken = Alternative, Swipe links/rechts = Layoutwechsel, Swipe hoch/runter = `*`/`+`.
- **Hardware-Tastatur**: Enter = Berechnung, Esc = löschen, Backspace/Delete = löschen, Ctrl+Pfeile = Layoutwechsel.

---

### 4) Scopes, Variablen und Funktionen
- Scope = benannter Bereich mit Variablen/Formeln.
- **Sc**: kurzes Tippen wechselt Scopes, langes Tippen (**Set**) öffnet Einstellungen.
- Variable: `a = 5`.
- Funktion: `f(x,y) = x*y + 3`.
- Benutzer-Tastatur wird aus Scope-Inhalt generiert.

---

### 5) Speicher M1/M2
- Tippen = Wert einfügen.
- Lang drücken = aktuellen Eingang speichern.

---

### 6) Verlauf und `Ans`
- Nur letztes Ergebnis wird gespeichert.
- **Ans** (langes Drücken auf `=`) fügt dieses Ergebnis ein.

---

### 7) Winkel
- Umschalten verändert das Verhalten der trigonometrischen Funktionen.

---

### 8) Themen
- **light**, **dark**, **ocean**.

---

### 9) Ausgabe, Genauigkeit, Einheiten
- Rundung auf 4 Dezimalstellen.
- Bei Fehler: `ERR: ...`.
- Beispiel: `2 m + 30 cm` → `2.3 m`.

---

### 10) Einstellungen
- Themen und Winkel umschalten.
- Verwaltung der Elemente im Scope.
- Import/Export im Format JSON, JSON5 oder einfacher Text.

---

### 11) Datenspeicherung
- Alles wird im localStorage gespeichert.

---

### 12) Scope mit Kollegen teilen
1. Scope exportieren.
2. JSON/JSON5 senden.
3. Kollegen importieren die Datei.

---

### 13) FAQ
- **Offline?** Ja, nach Installation.
- **Teilen?** Export/Import.
- **Winkel?** In den Einstellungen.
- **Speicher M1?** Lang drücken zum Speichern.

---
