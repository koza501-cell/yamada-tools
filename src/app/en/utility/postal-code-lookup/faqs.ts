export const FAQS = [
  {
    q: "What format are Japanese postal codes?",
    a: "Japanese postal codes (郵便番号, yūbin bangō) are 7 digits, written as XXX-XXXX — for example, 100-0001. The first 3 digits identify the regional area and the last 4 digits identify the specific street block or district. Japan introduced the 7-digit system in 1998, replacing the older 3-digit and 5-digit formats. The 〒 symbol (derived from 'T' for 'Teishin', the old Postal Ministry) is the official postal code prefix.",
  },
  {
    q: "Are Japan postal codes 5 or 7 digits?",
    a: "Modern Japanese postal codes are always 7 digits (since 1998). You may still see older 5-digit codes on some printed materials or legacy systems, but Japan Post requires 7 digits for all current mail processing. The format is always XXX-XXXX with a hyphen between the 3rd and 4th digits. This tool accepts both 1000001 (no hyphen) and 100-0001 (with hyphen).",
  },
  {
    q: "How do I find the postal code for a Japanese address?",
    a: "Use the 'Address → Postal code' tab above. Enter the Japanese address including the ward/city (区/市) and town name. For example, enter '東京都千代田区千代田' to find postal code 100-0001. You can also check Japan Post's official search at japanpost.jp/zipcode/. Note that one town district may have multiple postal codes for large areas, and one postal code may cover multiple small towns.",
  },
  {
    q: "What is 郵便番号 (yūbin bangō)?",
    a: "郵便番号 (yūbin bangō) literally means 'postal number' and is Japan's postal code system. 郵便 (yūbin) means 'postal mail' and 番号 (bangō) means 'number'. The symbol 〒 appears on all Japanese address fields and envelopes. When writing a Japanese address in Japan, the postal code always goes first, followed by the prefecture, city, ward, town, block number, and building name — the reverse of the English address order.",
  },
  {
    q: "How do Japan postal code regions work?",
    a: "The first digit of a Japanese postal code indicates the broad geographic region: 0 = Hokkaido, Tohoku North; 1 = Tokyo area; 2 = Kanagawa, Chiba, Ibaraki area; 3 = Kanto, Tokai; 4 = Chubu, Hokuriku; 5 = Kansai (Osaka, Kyoto); 6 = Kinki (Hyogo, Nara, Shiga); 7 = Chugoku (Hiroshima, Okayama); 8 = Kyushu (Fukuoka, Kumamoto); 9 = Kyushu South + Okinawa. The 2nd and 3rd digits narrow down to a city or ward.",
  },
  {
    q: "Can one postal code cover multiple towns?",
    a: "Yes. In rural areas, one postal code often covers a large area encompassing multiple towns or hamlets. In dense urban areas like central Tokyo, the granularity is much finer — a single large building (such as Tokyo Metropolitan Government Office) or a city block may have its own dedicated postal code. This tool shows all towns mapped to a given postal code, which may be one or several depending on the area density.",
  },
  {
    q: "What is the postal code for Tokyo?",
    a: "There is no single postal code for all of Tokyo — each ward (区) and district has its own codes. Central Tokyo (千代田区) uses codes in the 100–102 range, Shinjuku-ku uses 160–162, Shibuya-ku uses 150–151, and Minato-ku uses 105–108. Tokyo's outer municipalities like Hachioji and Machida have codes starting with 192–195. The first two digits '10' generally indicate central Tokyo's 23 wards.",
  },
  {
    q: "How do I write a Japanese address in English for international shipping?",
    a: "For international shipping TO Japan, reverse the Japanese address order and romanize it: (1) Recipient name, (2) Building/room number, (3) Block-Street number (番地 / ban-chi), (4) Town (丁目/町), (5) City/ward (市区), (6) Prefecture, (7) JAPAN, (8) Postal code. Example: Taro Yamada, 101 Sunshine Building, 1-1 Chiyoda, Chiyoda-ku, Tokyo 100-0001, JAPAN. Japan Post delivers without diacritics (Romaji is fine). The postal code can go at the end for international mail.",
  },
  {
    q: "How do I ship to Japan? What postal code should I use?",
    a: "For shipping to Japan: (1) Use the 7-digit postal code in XXX-XXXX format, (2) Write 'JAPAN' clearly as the country, (3) Most international carriers (DHL, FedEx, EMS) require the postal code to route the package to the correct regional sorting facility. Use this tool to confirm the postal code before shipping. For EMS (Express Mail Service via Japan Post), the postal code is especially important as it routes directly to the local post office for final delivery.",
  },
  {
    q: "Why do some Japanese addresses not have a postal code?",
    a: "All Japanese addresses have a postal code under the current system. If you receive an address without one, it may be: (1) An old address written before 1998 using a 5-digit code, (2) A PO Box address (私書箱, shishobako) with a special prefix, (3) An address in a newly developed area where the code was recently assigned. You can look up any current address using this tool or Japan Post's official search.",
  },
  {
    q: "What is the difference between 市 (shi), 区 (ku), 町 (cho/machi), and 村 (mura)?",
    a: "These are Japan's municipality types under the Local Autonomy Act. 市 (shi = city) is a municipality with 50,000+ residents. 区 (ku = ward) refers to the 23 special wards of Tokyo or designated city wards. 町 (cho/machi = town) is a smaller municipality or urban district within a city. 村 (mura = village) is the smallest municipality type, typically rural. In postal addresses, 区 is used both for Tokyo's special wards (e.g., 千代田区) and for wards within designated cities (e.g., 大阪市中央区).",
  },
  {
    q: "Is this postal code lookup free? How current is the data?",
    a: "Yes, completely free with no registration required. The lookup data comes from zipcloud, which aggregates Japan Post's Ken-All (全国一括) CSV file — the official master database of all Japanese postal codes published by Japan Post. The data is updated periodically when Japan Post releases updates (typically when municipalities merge or new developments are assigned codes). For time-sensitive shipping, always verify the current code at japanpost.jp/zipcode/ or call the recipient to confirm.",
  },
];
