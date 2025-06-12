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

// Import uživatelovo scope
export function importUserScope(text) {
  const vstup = SmartDataParser.parse(text);
  try {
    Object.entries(vstup).forEach(([name, scope]) => {
      Reflect.set(state.user, name, scope);
    });
  }
  catch (err) {
    console.warn('ERROR na: ', err);
  }
}


// ******************
// Třída na parsování uřivatelského scope
// ******************
export class SmartDataParser {

  // Parsování obsahu objektu (s čárkami jako oddělovači)
  parseObjectContent(content) {
    const result = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Odstranit trailing čárku pokud existuje
      const cleanLine = trimmed.endsWith(',') ? trimmed.slice(0, -1).trim() : trimmed;
      if (!cleanLine) continue;

      // Speciální případ: jen funkce bez klíče "vykon(napeti,proud)=napeti*proud"
      if (this.isFunctionDefinition(cleanLine) && !cleanLine.includes(':')) {
        const funcName = this.extractFunctionName(cleanLine);
        result[funcName] = cleanLine;
        continue;
      }

      const colonIndex = cleanLine.indexOf(':');
      if (colonIndex === -1) continue;

      const key = cleanLine.substring(0, colonIndex).trim();
      const valueStr = cleanLine.substring(colonIndex + 1).trim();
      const cleanKey = this.removeQuotes(key);

      result[cleanKey] = this.parseValue(valueStr);
    }

    return result;
  }

  // Statická metoda pro rychlé použití
  static parse(input) {
    const parser = new SmartDataParser();
    return parser.parse(input);
  }

  // // Statická metoda pro export
  // static export(data, format = 'json') {
  //   const parser = new SmartDataParser();
  //   return parser.export(data, format);
  // }

  // Hlavní metoda - automaticky detekuje formát a parsuje
  parse(input) {
    if (!input || typeof input !== 'string') {
      throw new Error('Vstup musí být neprázdný string');
    }

    const trimmed = input.trim();

    // 1. Zkusit standardní JSON (vyexportovaná data)
    if (this.isValidJson(trimmed)) {
      console.log('Detekován JSON formát');
      return JSON.parse(trimmed);
    }

    // 2. Zkusit JSON5 (uživatelský vstup)
    if (this.isValidJson5(trimmed)) {
      console.log('Detekován JSON5 formát');
      return JSON5.parse(trimmed);
    }

    // Předchozí selhalo. Zaparsujem jednoduchý formát
    return this.parseSimpleFormat(trimmed);
  }

  // Detekce validního JSON
  isValidJson(str) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  // Detekce validního JSON5
  isValidJson5(str) {
    try {
      JSON5.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  // Detekce jednoduchého formátu (klíč: hodnota nebo funkce)
  // isSimpleFormat(str) {
  //   const lines = str.split('\n').filter(line => {
  //     const trimmed = line.trim();
  //     return trimmed && !trimmed.startsWith('#');
  //   })

  //   if (lines.length === 0) return false;

  //   // Kontrola, zda to vypadá jako jednoduchý formát
  //   let hasValidLines = false;

  //   for (const line of lines) {
  //     const trimmed = line.trim();
  //     if (!trimmed) continue;

  //     // Řádek s dvojtečkou (klíč: hodnota)
  //     if (trimmed.includes(':')) {
  //       hasValidLines = true;
  //       continue;
  //     }

  //     // Definice funkce bez klíče (obsahuje = a název funkce)
  //     if (this.isFunctionDefinition(trimmed)) {
  //       hasValidLines = true;
  //       continue;
  //     }

  //     // Řádek který začíná mezerou (indentace) je také OK
  //     if (line.match(/^\s+/)) {
  //       hasValidLines = true;
  //       continue;
  //     }

  //     // Pokud najdeme řádek který nepatří, není to jednoduchý formát
  //     return false;
  //   }

  //   return hasValidLines;
  // }

  // Parser pro pseudo-JSON formát (složené závorky s jednoduchým obsahem)
  parsePseudoJson(text) {
    // Odstranit vnější složené závorky
    const content = text.slice(1, -1).trim();

    // Parsovat obsah jako jednoduchý formát
    return this.parseSimpleFormat(content);
  }

  // Parser pro jednoduchý formát s podporou vnořených objektů
  parseSimpleFormat(text) {
    const lines = text.split('\n');
    return this.parseLines(lines, 0).result;
  }

  // Parsuje řádky a vrací výsledek s indexem posledního zpracovaného řádku
  parseLines(lines, startIndex) {
    const result = {};
    let currentIndex = startIndex;

    while (currentIndex < lines.length) {
      const line = lines[currentIndex];
      const trimmed = line.trim();

      // Prázdný řádek nebo komentář
      if (!trimmed || trimmed.startsWith('#')) {
        currentIndex++;
        continue;
      }

      const indent = this.getIndentLevel(line);

      // Pokud je indentace menší než očekávaná, ukončit tento blok
      if (startIndex > 0 && indent < this.getExpectedIndent(startIndex)) {
        break;
      }

      // Speciální případ: jen funkce bez klíče "calc(a,b)=a+b"
      if (this.isFunctionDefinition(trimmed) && !trimmed.includes(':')) {
        const funcName = this.extractFunctionName(trimmed);
        result[funcName] = trimmed;
        currentIndex++;
        continue;
      }

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) {
        currentIndex++;
        continue;
      }

      const key = trimmed.substring(0, colonIndex).trim();
      const valueStr = trimmed.substring(colonIndex + 1).trim();
      const cleanKey = this.removeQuotes(key);

      // Pokud hodnota začíná složenou závorkou, může být víceřádkový objekt
      if (valueStr.startsWith('{')) {
        const objectResult = this.parseMultilineObject(lines, currentIndex, colonIndex + 1);
        result[cleanKey] = objectResult.value;
        currentIndex = objectResult.lastIndex;
        continue;
      }

      // Pokud je hodnota prázdná, může to být začátek vnořeného objektu
      if (!valueStr) {
        // Zkontrolovat další řádky pro vnořený obsah
        const nextLineIndex = currentIndex + 1;
        if (nextLineIndex < lines.length) {
          const nextLine = lines[nextLineIndex];
          const nextIndent = this.getIndentLevel(nextLine);

          // Pokud je další řádek více odsazený, parsovat jako vnořený objekt
          if (nextIndent > indent) {
            const nested = this.parseLines(lines, nextLineIndex);
            result[cleanKey] = nested.result;
            currentIndex = nested.lastIndex;
            continue;
          }
        }

        // Jinak prázdná hodnota
        result[cleanKey] = null;
      } else {
        // Normální hodnota
        result[cleanKey] = this.parseValue(valueStr);
      }

      currentIndex++;
    }

    return { result, lastIndex: currentIndex };
  }

  // Získá úroveň odsazení řádku
  getIndentLevel(line) {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  // Získá očekávanou minimální úroveň odsazení pro daný startIndex
  getExpectedIndent(startIndex) {
    // Jednoduchá heuristika - každá úroveň má 2 mezery
    return startIndex * 2;
  }

  // Parsuje víceřádkový objekt začínající složenou závorkou
  parseMultilineObject(lines, startLineIndex, startCharIndex) {
    const startLine = lines[startLineIndex];
    const afterColon = startLine.substring(startCharIndex).trim();

    // Pokud je celý objekt na jednom řádku: "key: { a: 1, b: 2 }"
    if (afterColon.endsWith('}')) {
      return {
        value: this.parseInlineObject(afterColon),
        lastIndex: startLineIndex + 1
      };
    }

    // Víceřádkový objekt - najít uzavírací závorku a extrahovat obsah
    let braceDepth = 1; // začínáme s jednou otevřenou závorkou
    let objectLines = [];
    let currentIndex = startLineIndex + 1;

    // Přidat obsah z prvního řádku (bez úvodní závorky)
    const firstLineContent = afterColon.substring(1).trim(); // odstranit úvodní '{'
    if (firstLineContent) {
      objectLines.push(firstLineContent);
    }

    while (currentIndex < lines.length && braceDepth > 0) {
      const line = lines[currentIndex];
      let lineToAdd = line;

      // Počítat závorky a najít uzavírací
      let foundClosing = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '{') braceDepth++;
        else if (char === '}') {
          braceDepth--;
          if (braceDepth === 0) {
            // Nalezena uzavírací závorka - vzít jen část před ní
            lineToAdd = line.substring(0, i).trim();
            foundClosing = true;
            break;
          }
        }
      }

      if (lineToAdd.trim()) {
        objectLines.push(lineToAdd.trim());
      }

      currentIndex++;

      if (foundClosing) break;
    }

    // Nyní parsovat obsah objektu pomocí speciální metody
    const objectContent = objectLines.join('\n');

    return {
      value: this.parseObjectContent(objectContent),
      lastIndex: currentIndex
    };
  }

  // Konverze objektu zpět na jednoduchý formát
  // toSimpleFormat(obj, indent = 0) {
  //   const spaces = '  '.repeat(indent)
  //   let result = ''

  //   for (const [key, value] of Object.entries(obj)) {
  //     if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
  //       result += `${spaces}${key}:\n`
  //       result += this.toSimpleFormat(value, indent + 1)
  //     } else {
  //       result += `${spaces}${key}: ${this.valueToString(value)}\n`
  //     }
  //   }

  //   return result
  // }

  // Parsování jednotlivých hodnot
  parseValue(valueStr) {
    // Objekt ve složených závorkách
    if (valueStr.startsWith('{') && valueStr.endsWith('}')) {
      return this.parseInlineObject(valueStr);
    }

    // Pole
    if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
      return this.parseArray(valueStr);
    }

    // String v uvozovkách - odstraň uvozovky
    if ((valueStr.startsWith('"') && valueStr.endsWith('"')) ||
      (valueStr.startsWith("'") && valueStr.endsWith("'"))) {
      return valueStr.slice(1, -1);
    }

    // Boolean
    if (valueStr === 'true') return true;
    if (valueStr === 'false') return false;
    if (valueStr === 'null') return null;

    // Číslo
    const num = Number(valueStr);
    if (!isNaN(num)) return num;

    // Funkce nebo string bez uvozovek - vrátit jako string
    return valueStr;
  }

  // Konverze hodnoty zpět na string
  valueToString(value) {
    if (typeof value === 'string') {
      // Pokud obsahuje mezery nebo dvojtečku, dát do uvozovek
      return value.includes(' ') || value.includes(':') ? `"${value}"` : value;
    }
    if (Array.isArray(value)) {
      return '[' + value.map(v => this.valueToString(v)).join(', ') + ']';
    }
    return String(value);
  }

  // Detekce definice funkce
  isFunctionDefinition(str) {
    return str.includes('=') && (str.includes('(') || /[a-zA-Z_]\w*\s*=/.test(str));
  }

  // Extrakce názvu funkce z definice
  extractFunctionName(str) {
    // Pro "calc(a, b) = a + b" vrátí "calc"
    // Pro "calc = a + b" vrátí "calc"
    const equalIndex = str.indexOf('=');
    const leftSide = str.substring(0, equalIndex).trim();

    const parenIndex = leftSide.indexOf('(');
    if (parenIndex !== -1) {
      return leftSide.substring(0, parenIndex).trim();
    } else {
      return leftSide.trim();
    }
  }

  // Odstranění uvozovek ze stringu
  removeQuotes(str) {
    if ((str.startsWith('"') && str.endsWith('"')) ||
      (str.startsWith("'") && str.endsWith("'"))) {
      return str.slice(1, -1);
    }
    return str;
  }

  // Parsování inline objektu ve složených závorkách
  parseInlineObject(str) {
    const content = str.slice(1, -1).trim();
    if (!content) return {};

    // Rozdělení obsahu na jednotlivé klíč-hodnota páry pomocí chytrého splitu
    const pairs = this.smartSplit(content, ',');
    const result = {};

    for (const pair of pairs) {
      const trimmedPair = pair.trim();
      if (!trimmedPair) continue;

      // Speciální případ: jen funkce bez klíče "vykon(napeti,proud)=napeti*proud"
      if (this.isFunctionDefinition(trimmedPair) && !trimmedPair.includes(':')) {
        const funcName = this.extractFunctionName(trimmedPair);
        result[funcName] = trimmedPair;
        continue;
      }

      const colonIndex = trimmedPair.indexOf(':');
      if (colonIndex === -1) continue;

      const key = trimmedPair.substring(0, colonIndex).trim();
      const valueStr = trimmedPair.substring(colonIndex + 1).trim();
      const cleanKey = this.removeQuotes(key);

      result[cleanKey] = this.parseValue(valueStr);
    }

    return result;
  }

  // Parsování pole
  parseArray(str) {
    const content = str.slice(1, -1).trim();
    if (!content) return [];

    const items = this.smartSplit(content, ',');
    return items.map(item => this.parseValue(item.trim()));
  }

  // Chytrý split (respektuje uvozovky, závorky a funkce)
  smartSplit(str, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    let parenDepth = 0;
    let braceDepth = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (!inQuotes) {
        if (char === '(') parenDepth++;
        else if (char === ')') parenDepth--;
        else if (char === '{') braceDepth++;
        else if (char === '}') braceDepth--;
        else if (char === delimiter && parenDepth === 0 && braceDepth === 0) {
          result.push(current.trim());
          current = '';
          continue;
        }
      }

      current += char;
    }

    if (current.trim()) result.push(current.trim());
    return result;
  }
}