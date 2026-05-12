export const FAQS = [
  {
    q: "What does this Japan property due diligence report include?",
    a: "The report covers six data points for any Japanese address: hazard risks (flood, landslide, liquefaction, tsunami, storm surge), zoning classification (land-use category, building coverage ratio, FAR), official land prices with year-on-year trend, recent transaction prices in the area, nearest school districts, and 50-year population projections. All data is sourced from MLIT REINFOLIB — Japan's official real estate information library. Results are fully in English.",
  },
  {
    q: "How do I check a Japanese address before buying property?",
    a: "Enter the full Japanese address — in kanji, hiragana, or postal code format — into the search field above. The tool geocodes your address using Japan's official GSI (Geospatial Information Authority) and then pulls six property data layers in parallel. You'll receive hazard risk levels, zoning rules, land price benchmarks, transaction history, school catchment areas, and population trends within about 5–10 seconds. No account required.",
  },
  {
    q: "What is akiya due diligence and what should foreigners check?",
    a: "Akiya (空き家) are Japan's vacant or abandoned properties — often cheap but carrying hidden risks. Key due diligence checks for akiya include: (1) Hazard zone status — many rural akiya sit in flood or landslide warning zones. (2) Zoning classification — some rural areas are zoned 'exclusively industrial,' restricting residential renovation. (3) Land price trends — akiya in depopulating areas often have near-zero land value. (4) Population projections — a municipality projecting >30% population decline by 2050 signals structural demand risk. Use this report as the first step, then commission a 建物状況調査 (building condition survey) from a licensed inspector.",
  },
  {
    q: "What are Japan's zoning regulations in English?",
    a: "Japan uses 13 land-use zones (用途地域, youto chiiki) defined under the City Planning Act. From most to least residential: (1) Category 1 Low-rise Residential, (2) Category 2 Low-rise Residential, (3) Category 1 Mid/High-rise Residential, (4) Category 2 Mid/High-rise Residential, (5) Category 1 Residential, (6) Category 2 Residential, (7) Quasi-Residential, (8) Garden Residential, (9) Neighborhood Commercial, (10) Commercial Zone, (11) Quasi-Industrial, (12) Industrial Zone, (13) Exclusively Industrial. Each zone specifies maximum building coverage ratio (建蔽率, kenpei-ritsu) and floor-area ratio (容積率, youseki-ritsu). This report shows the zone and key ratios for your address.",
  },
  {
    q: "How do I check flood risk for a Japanese address in English?",
    a: "This report checks five flood-related hazards for your address using official MLIT REINFOLIB tile data: (1) Flood inundation depth (洪水浸水想定区域 — expected depth if a designed river overflows), (2) Landslide warning zones (土砂災害警戒区域), (3) Liquefaction risk (液状化危険度), (4) Tsunami inundation zones, (5) Storm surge zones. Each hazard is rated None / Low / Medium / High in English. The data matches the official hazard maps (ハザードマップ) that Japanese municipalities publish.",
  },
  {
    q: "Is this address in Japan safe to buy?",
    a: "This report gives you the factual data to assess safety — it does not make a buy/don't-buy recommendation. Key signals: Hazard section showing 'High' on any flood, landslide, or tsunami layer means the site is in a government-designated danger zone and requires serious structural mitigation. Zoning 'Exclusively Industrial' (Zone 13) legally prohibits housing. Land price declining >5% year-on-year in a depopulating area signals long-term value risk. For a complete safety assessment, supplement this report with a physical building inspection (建物調査) and a soil survey (地盤調査).",
  },
  {
    q: "What is the hazard map (ハザードマップ) for a Japan address in English?",
    a: "Japan's hazard maps (ハザードマップ) are government-published risk overlays showing expected flood depths, landslide warning zones, tsunami inundation areas, and liquefaction risk for every address in Japan. This report pulls those exact maps in English via the MLIT REINFOLIB API. The data is the same used by Japanese municipalities in their official hazard map portals. Hazard disclosure is legally required at the time of property purchase (宅地建物取引業法 Sec. 35).",
  },
  {
    q: "What is the floor-area ratio (容積率) and building coverage ratio (建蔽率) for my address?",
    a: "Building Coverage Ratio (建蔽率 / kenpei-ritsu) is the maximum footprint of the building as a percentage of land area — e.g., 60% means you can cover 60% of the lot. Floor Area Ratio (容積率 / youseki-ritsu) is the total floor area across all floors as a percentage of land area — e.g., 200% on a 100㎡ lot means up to 200㎡ of total floor space. Both ratios are set by the zoning classification and limit what can be built. This report shows both the address-specific values recorded in MLIT data and the typical values for that zone.",
  },
  {
    q: "Can a foreign buyer purchase property in any Japan zoning category?",
    a: "Japan has no restrictions on foreign ownership of real estate — a non-resident foreigner can legally purchase land and buildings in any zone. However, zoning determines what you can build or operate. Zones 1–8 (residential zones) restrict large-scale commercial use. Zone 13 (exclusively industrial) prohibits housing. If you plan to operate a business from the property, zones 9–11 (commercial/quasi-industrial) are generally most permissive. Always confirm specific use restrictions with a 宅地建物取引士 (licensed real estate agent) before purchasing.",
  },
  {
    q: "How accurate is the land price data in this report?",
    a: "Land prices shown are from the MLIT Official Land Price Survey (地価公示) or Prefectural Land Price Survey (地価調査) — Japan's authoritative annual benchmark surveys conducted at thousands of sample points nationwide. The figure shown is for the nearest sample point, which may be hundreds of meters from your address. Use it as a benchmark, not a precise appraisal. For a formal property valuation, commission a 不動産鑑定士 (licensed real estate appraiser).",
  },
  {
    q: "What do the transaction price statistics mean?",
    a: "Transaction price data comes from MLIT's Real Estate Transaction Price Survey (不動産取引価格情報), a mandatory reporting system covering actual completed sales. The statistics shown cover the most recent 5 quarters in the surrounding tile grid. 'Average per ㎡' is the mean price per square meter across all transactions of the dominant land type. Use this to sanity-check whether a listing price is in line with actual recent market transactions. Note: land areas differ, building ages vary — treat these as ranges, not exact comparables.",
  },
  {
    q: "What is liquefaction risk (液状化) and why does it matter for property buyers?",
    a: "Liquefaction (液状化 / ekijoka) occurs when saturated sandy soil loses strength during an earthquake and behaves like a liquid. Buildings on liquefaction-prone soil can tilt, sink, or have utilities rupture — even if the structure itself survives the shaking. Japan grades liquefaction risk on a 5-level scale. This report shows the risk level for your address from MLIT's national liquefaction hazard dataset. High liquefaction risk areas typically require ground improvement (地盤改良) engineering, which adds significant cost to new construction.",
  },
  {
    q: "How does the school district (学区) data work?",
    a: "School district data comes from MLIT's administrative boundary datasets (XKT004/XKT005) covering elementary and junior high school catchment areas. The report identifies which public school the address falls within based on the boundary polygons. School districts can change — always verify with the relevant municipal Board of Education (教育委員会) before making a purchase decision based on school preferences. This data is provided for personal reference only; commercial redistribution may be restricted under some prefectural terms.",
  },
  {
    q: "What does the 50-year population projection mean for property investment?",
    a: "Japan's National Institute of Population and Social Security Research (国立社会保障・人口問題研究所) projects population at the 500m mesh level through 2070. A 'Declining significantly' result means the local population is projected to fall more than 20% by 2070 — indicating structural demand weakness for rental income, retail, and resale value. 'Growing' areas (typically major city cores and suburban commuter belts) suggest sustained demand. Population trend is one of the most important long-horizon factors for Japan property investment.",
  },
  {
    q: "Is this tool free? Does it require sign-up?",
    a: "Yes, completely free — no registration, no account, no credit card. The tool calls Japan's official MLIT Real Estate Information Library (REINFOLIB) Web-API, which is a public government data service. Responses are cached for 24 hours per address to respect the API's rate limits. There are no usage limits for normal individual use. This is a v1 release; PDF export and saved report features are planned for v2.",
  },
];
