// Zodiac (干支) unit tests — run with: node zodiac.test.js

const ZODIAC_ANIMALS  = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const ZODIAC_READINGS = ["ね","うし","とら","う","たつ","み","うま","ひつじ","さる","とり","いぬ","い"];

function getZodiac(year) {
  const idx = (year + 8) % 12;
  return { kanji: ZODIAC_ANIMALS[idx], reading: ZODIAC_READINGS[idx] };
}

const tests = [
  { year: 1980, kanji: "申", reading: "さる" },
  { year: 1984, kanji: "子", reading: "ね"   },
  { year: 1990, kanji: "午", reading: "うま" },
  { year: 2000, kanji: "辰", reading: "たつ" },
  { year: 2019, kanji: "亥", reading: "い"   },
  { year: 2020, kanji: "子", reading: "ね"   },
];

let passed = 0, failed = 0;
for (const { year, kanji, reading } of tests) {
  const result = getZodiac(year);
  const ok = result.kanji === kanji && result.reading === reading;
  if (ok) {
    console.log(`PASS  ${year} → ${result.kanji}（${result.reading}）`);
    passed++;
  } else {
    console.error(`FAIL  ${year} → got ${result.kanji}（${result.reading}）, expected ${kanji}（${reading}）`);
    failed++;
  }
}
console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
