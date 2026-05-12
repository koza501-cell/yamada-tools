export const FAQS = [
  {
    q: "What is a Zengin code?",
    a: "A Zengin code (全銀コード) is Japan's domestic interbank routing code system managed by the Japanese Bankers Association (全国銀行協会). It consists of a 4-digit bank code (金融機関コード) and a 3-digit branch code (支店コード). Together they uniquely identify any branch of any bank in Japan. The Zengin system is used for domestic wire transfers (振込), payroll (給与振込), and utility auto-debit (口座振替).",
  },
  {
    q: "What is the format of a Japan bank code?",
    a: "Japanese bank codes are always 4 digits, zero-padded (e.g., 0001 for Mizuho Bank, 0005 for MUFG, 9900 for Japan Post Bank). Branch codes are always 3 digits (e.g., 001). When providing banking details, you need both: the bank code plus the branch code. Some forms also ask for the account type (普通 = savings, 当座 = current) and the 7-digit account number (口座番号).",
  },
  {
    q: "What is the difference between a Zengin code and a SWIFT/BIC code?",
    a: "Zengin codes are used for domestic transfers within Japan only. SWIFT/BIC codes (e.g., MHCBJPJT for Mizuho) are used for international wire transfers. If you are sending money TO Japan from overseas, your bank will ask for the recipient's SWIFT/BIC code, IBAN equivalent (not used in Japan — use account number instead), and sometimes the Zengin branch code for internal routing. This tool shows both Zengin codes and SWIFT codes for major Japanese banks.",
  },
  {
    q: "What is the MUFG bank code?",
    a: "MUFG Bank (三菱UFJ銀行, Mitsubishi UFJ Bank) has bank code 0005. Its full name in Japanese is 三菱ＵＦＪ銀行. The SWIFT/BIC code for international transfers to MUFG is BOTKJPJT. For domestic transfers, you need both the bank code (0005) and the specific branch code where the recipient's account is held.",
  },
  {
    q: "What is the Mizuho bank code?",
    a: "Mizuho Bank (みずほ銀行) has bank code 0001. It is Japan's oldest and one of the three megabanks. The SWIFT code for Mizuho is MHCBJPJT. For domestic transfers, use bank code 0001 plus the recipient's 3-digit branch code. Note: Mizuho also has a trust bank subsidiary (みずほ信託銀行, bank code 0289) which has different codes.",
  },
  {
    q: "What is the SMBC (Sumitomo Mitsui) bank code?",
    a: "SMBC (三井住友銀行, Sumitomo Mitsui Banking Corporation) has bank code 0009. SMBC is one of Japan's three megabanks (三大メガバンク) along with MUFG and Mizuho. The SWIFT code is SMBCJPJT. SMBC also has a trust bank (三井住友信託銀行, code 0294) and a consumer finance arm (SMBCモビット) with separate codes.",
  },
  {
    q: "What is the Japan Post Bank code?",
    a: "Japan Post Bank (ゆうちょ銀行, Yuucho Ginko) has bank code 9900 and SWIFT code JPPYJPJT. However, Japan Post Bank uses a different account numbering system internally: accounts are identified by a 5-digit 'store code' (店番) and 8-digit account number format unique to ゆうちょ. When transferring FROM another bank TO Japan Post Bank, use bank code 9900. When transferring FROM Japan Post Bank, the process is different — see the Japan Post Bank website for details.",
  },
  {
    q: "How do I find a Japan bank code by name in English?",
    a: "Use the search tab on this page. Type the bank name in English (e.g., 'mizuho'), romaji (e.g., 'sumitomo'), or Japanese (e.g., 'みずほ' or '三菱'). The tool searches across all registered banks in the Zengin dataset. If you know the bank code already, you can use the dropdown to select it and browse all branches. The Zengin dataset covers all Japanese financial institutions including city banks, regional banks (地方銀行), shinkin banks (信用金庫), and credit unions.",
  },
  {
    q: "What is a Japan branch code (店番)?",
    a: "A branch code (支店番号, 店番) is a 3-digit code identifying a specific branch of a Japanese bank. Every bank branch has a unique code within that bank. For example, Mizuho Bank's Tokyo Main Branch has branch code 001. When filling out a bank transfer form or providing payment details, you need both the bank code (4 digits) and the branch code (3 digits) to uniquely identify where the account is held.",
  },
  {
    q: "How do I send a wire transfer to a Japanese bank account?",
    a: "For domestic transfers (from inside Japan): you need (1) bank code 金融機関コード (4 digits), (2) branch code 支店コード (3 digits), (3) account type 口座種別 (普通=savings, 当座=current), (4) account number 口座番号 (7 digits). For international transfers (from outside Japan): contact your bank and provide the recipient's SWIFT/BIC code, their bank name and address in Japanese and English, account number, and account holder name in full. Japan does not use IBAN.",
  },
  {
    q: "What is the Japan account number format?",
    a: "Japanese bank account numbers are 7 digits (口座番号), zero-padded on the left if shorter. They are always associated with a specific branch — the same 7-digit number can exist at two different branches of the same bank for two different people. Together with the bank code (4 digits) and branch code (3 digits), the full reference for any Japanese bank account is: XXXX (bank) + XXX (branch) + XXXXXXX (account) = 14 digits total.",
  },
  {
    q: "Is this tool free? Where does the data come from?",
    a: "Yes, completely free with no registration required. Bank and branch data comes from the ZenginCode project (MIT license), which maintains a regularly updated dataset of all Japanese financial institution codes based on the official Zengin format published by the Japanese Bankers Association. SWIFT/BIC codes are sourced from public BIC directories and cover major Japanese banks. For time-sensitive transfers, always confirm the recipient's exact bank code, branch code, account type, and account number with them directly before sending.",
  },
  {
    q: "What is a SWIFT/BIC code and do I need one for transfers to Japan?",
    a: "A SWIFT code (also called a BIC — Bank Identifier Code) is an internationally standardized 8 or 11 character code that identifies a specific bank for international wire transfers. It follows the format: 4-letter bank code + 2-letter country code (JP for Japan) + 2-letter location code + optional 3-letter branch code. You need a SWIFT/BIC code when sending money TO Japan from another country. Your overseas bank will ask for the recipient's bank SWIFT code plus the account number. You do NOT need a SWIFT code for domestic transfers within Japan — those use the Zengin bank code (4 digits) and branch code (3 digits) instead.",
  },
  {
    q: "What is Mizuho Bank's SWIFT code?",
    a: "Mizuho Bank's SWIFT/BIC code is MHCBJPJT. The full 11-character version is MHCBJPJTXXX (XXX denotes the head office). This code is used when sending international wire transfers to any Mizuho Bank account in Japan. When filling out an international wire form, provide: SWIFT code MHCBJPJT, bank name 'Mizuho Bank, Ltd.', and the recipient's branch code plus 7-digit account number. Mizuho's trust bank subsidiary (みずほ信託銀行) has a different SWIFT code — confirm with the recipient which entity holds their account.",
  },
  {
    q: "Do all Japanese banks have a SWIFT code for international transfers?",
    a: "No — only banks that are active members of the SWIFT network have a SWIFT/BIC code. Japan's three megabanks (Mizuho: MHCBJPJT, MUFG: BOTKJPJT, SMBC: SMBCJPJT), major regional banks, and trust banks typically do. However, many smaller regional banks, shinkin banks (信用金庫), and credit cooperatives (信用組合) are not SWIFT members and cannot directly receive international wires. In those cases, the recipient may need to use an intermediary/correspondent bank, or the sender may need to wire to a major Japanese bank first. Always ask the recipient how to receive international transfers before sending.",
  },
];
