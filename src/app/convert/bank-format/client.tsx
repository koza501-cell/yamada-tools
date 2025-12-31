"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface BankFormatClientProps {
  faq?: FAQ[];
  seoContent?: SeoContent;
}

interface TransferData {
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
  recipientName: string;
  amount: string;
}

interface HeaderData {
  transferType: "21" | "11" | "12"; // 21:総合振込, 11:給与, 12:賞与
  clientCode: string;
  clientName: string;
  transferDate: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
}

export default function BankFormatClient({ faq, seoContent }: BankFormatClientProps) {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("振込データを入力してね！");

  const [headerData, setHeaderData] = useState<HeaderData>({
    transferType: "21",
    clientCode: "",
    clientName: "",
    transferDate: "",
    bankCode: "",
    bankName: "",
    branchCode: "",
    branchName: "",
    accountType: "1",
    accountNumber: "",
  });

  const [transfers, setTransfers] = useState<TransferData[]>([
    {
      bankCode: "",
      bankName: "",
      branchCode: "",
      branchName: "",
      accountType: "1",
      accountNumber: "",
      recipientName: "",
      amount: "",
    },
  ]);

  const [result, setResult] = useState<string>("");
  const [csvInput, setCsvInput] = useState<string>("");
  const [inputMode, setInputMode] = useState<"manual" | "csv">("manual");

  useEffect(() => {
    setMounted(true);
    // Set default date to today
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setHeaderData((prev) => ({ ...prev, transferDate: mm + dd }));
  }, []);

  // Convert to Zengin character set (half-width katakana uppercase)
  const toZenginKana = (str: string): string => {
    // Full-width to half-width katakana
    let result = str
      .replace(/[ァ-ン]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60))
      .replace(/[ぁ-ん]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60 + 0x60))
      // Convert hiragana to katakana first
      .replace(/[ぁ-ん]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0x60));

    // Lowercase to uppercase
    result = result.toUpperCase();

    // Small kana to large kana
    const smallToLarge: { [key: string]: string } = {
      ァ: "ア", ィ: "イ", ゥ: "ウ", ェ: "エ", ォ: "オ",
      ッ: "ツ", ャ: "ヤ", ュ: "ユ", ョ: "ヨ",
      ｧ: "ｱ", ｨ: "ｲ", ｩ: "ｳ", ｪ: "ｴ", ｫ: "ｵ",
      ｯ: "ﾂ", ｬ: "ﾔ", ｭ: "ﾕ", ｮ: "ﾖ",
    };
    for (const [small, large] of Object.entries(smallToLarge)) {
      result = result.replace(new RegExp(small, "g"), large);
    }

    // Only allow valid Zengin characters
    // A-Z, ｱ-ﾝ, 0-9, space, ., \, (, ), -, /, ｢, ｣, ﾞ, ﾟ
    result = result.replace(/[^A-Z0-9ｱ-ﾝﾞﾟ\s.\\\(\)\-\/｢｣ ]/g, "");

    return result;
  };

  // Pad string to specific byte length
  const padRight = (str: string, len: number): string => {
    const bytes = new TextEncoder().encode(str);
    if (bytes.length >= len) {
      return new TextDecoder().decode(bytes.slice(0, len));
    }
    return str + " ".repeat(len - bytes.length);
  };

  const padLeft = (str: string, len: number, char: string = "0"): string => {
    return str.padStart(len, char);
  };

  // Generate header record (120 bytes)
  const generateHeader = (): string => {
    let record = "";
    record += "1"; // Data type: 1 = Header
    record += headerData.transferType; // Transfer type: 21=総合, 11=給与, 12=賞与
    record += "0"; // Code type: 0=JIS
    record += padLeft(headerData.clientCode, 10, "0"); // Client code
    record += padRight(toZenginKana(headerData.clientName), 40); // Client name
    record += padLeft(headerData.transferDate, 4, "0"); // Transfer date MMDD
    record += padLeft(headerData.bankCode, 4, "0"); // Bank code
    record += padRight(toZenginKana(headerData.bankName), 15); // Bank name
    record += padLeft(headerData.branchCode, 3, "0"); // Branch code
    record += padRight(toZenginKana(headerData.branchName), 15); // Branch name
    record += headerData.accountType; // Account type: 1=普通, 2=当座
    record += padLeft(headerData.accountNumber, 7, "0"); // Account number
    record += " ".repeat(17); // Dummy

    return record;
  };

  // Generate data record (120 bytes)
  const generateDataRecord = (data: TransferData, index: number): string => {
    let record = "";
    record += "2"; // Data type: 2 = Data
    record += padLeft(data.bankCode, 4, "0"); // Recipient bank code
    record += padRight(toZenginKana(data.bankName), 15); // Recipient bank name
    record += padLeft(data.branchCode, 3, "0"); // Recipient branch code
    record += padRight(toZenginKana(data.branchName), 15); // Recipient branch name
    record += " ".repeat(4); // Clearing house number (dummy)
    record += data.accountType; // Account type
    record += padLeft(data.accountNumber, 7, "0"); // Account number
    record += padRight(toZenginKana(data.recipientName), 30); // Recipient name
    record += padLeft(data.amount.replace(/[^0-9]/g, ""), 10, "0"); // Amount
    record += "0"; // New code
    record += " ".repeat(20); // EDI info
    record += " "; // Transfer designation
    record += " ".repeat(7); // Dummy

    return record;
  };

  // Generate trailer record (120 bytes)
  const generateTrailer = (): string => {
    const totalCount = transfers.length;
    const totalAmount = transfers.reduce(
      (sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "") || "0"),
      0
    );

    let record = "";
    record += "8"; // Data type: 8 = Trailer
    record += padLeft(String(totalCount), 6, "0"); // Total count
    record += padLeft(String(totalAmount), 12, "0"); // Total amount
    record += " ".repeat(101); // Dummy

    return record;
  };

  // Generate end record (120 bytes)
  const generateEnd = (): string => {
    let record = "";
    record += "9"; // Data type: 9 = End
    record += " ".repeat(119); // Dummy

    return record;
  };

  const handleConvert = () => {
    // Validation
    if (!headerData.clientCode || !headerData.clientName) {
      setMascotState("error");
      setMascotMessage("委託者情報を入力してください");
      return;
    }

    const validTransfers = transfers.filter(
      (t) =>
        t.bankCode &&
        t.branchCode &&
        t.accountNumber &&
        t.recipientName &&
        t.amount
    );

    if (validTransfers.length === 0) {
      setMascotState("error");
      setMascotMessage("振込先データを入力してください");
      return;
    }

    try {
      setMascotState("working");
      setMascotMessage("変換中...");

      let output = "";
      output += generateHeader() + "\r\n";

      validTransfers.forEach((transfer, index) => {
        output += generateDataRecord(transfer, index) + "\r\n";
      });

      output += generateTrailer() + "\r\n";
      output += generateEnd();

      setResult(output);
      setMascotState("success");
      setMascotMessage(`${validTransfers.length}件の振込データを変換しました！`);
    } catch (error) {
      setMascotState("error");
      setMascotMessage("変換エラーが発生しました");
    }
  };

  const handleDownload = () => {
    if (!result) return;

    // Convert to Shift-JIS for Japanese bank compatibility
    const blob = new Blob([result], { type: "text/plain;charset=shift_jis" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zengin_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCsvParse = () => {
    if (!csvInput.trim()) {
      setMascotState("error");
      setMascotMessage("CSVデータを入力してください");
      return;
    }

    try {
      const lines = csvInput.trim().split("\n");
      const parsed: TransferData[] = [];

      for (const line of lines) {
        const cols = line.split(",").map((c) => c.trim().replace(/"/g, ""));
        if (cols.length >= 7) {
          parsed.push({
            bankCode: cols[0] || "",
            bankName: cols[1] || "",
            branchCode: cols[2] || "",
            branchName: cols[3] || "",
            accountType: cols[4] || "1",
            accountNumber: cols[5] || "",
            recipientName: cols[6] || "",
            amount: cols[7] || "",
          });
        }
      }

      if (parsed.length > 0) {
        setTransfers(parsed);
        setMascotState("success");
        setMascotMessage(`${parsed.length}件のデータを読み込みました`);
      } else {
        setMascotState("error");
        setMascotMessage("有効なデータが見つかりません");
      }
    } catch (error) {
      setMascotState("error");
      setMascotMessage("CSV解析エラー");
    }
  };

  const addTransferRow = () => {
    setTransfers([
      ...transfers,
      {
        bankCode: "",
        bankName: "",
        branchCode: "",
        branchName: "",
        accountType: "1",
        accountNumber: "",
        recipientName: "",
        amount: "",
      },
    ]);
  };

  const removeTransferRow = (index: number) => {
    if (transfers.length > 1) {
      setTransfers(transfers.filter((_, i) => i !== index));
    }
  };

  const updateTransfer = (
    index: number,
    field: keyof TransferData,
    value: string
  ) => {
    const updated = [...transfers];
    updated[index] = { ...updated[index], [field]: value };
    setTransfers(updated);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-kon">
                ホーム
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/convert" className="hover:text-kon">
                変換ツール
              </Link>
            </li>
            <li>/</li>
            <li className="text-kon font-medium">全銀フォーマット変換</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🏦</div>
          <h1 className="text-3xl font-bold text-kon mb-2">
            全銀フォーマット変換
          </h1>
          <p className="text-gray-600 text-lg">
            振込データを全銀協規定形式に変換
          </p>
        </header>

        <div className="mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setInputMode("manual")}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              inputMode === "manual"
                ? "bg-kon text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            手動入力
          </button>
          <button
            onClick={() => setInputMode("csv")}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              inputMode === "csv"
                ? "bg-kon text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            CSV入力
          </button>
        </div>

        {/* Header Information */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-kon mb-4">
            委託者情報（依頼元）
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                振込種別
              </label>
              <select
                value={headerData.transferType}
                onChange={(e) =>
                  setHeaderData({
                    ...headerData,
                    transferType: e.target.value as "21" | "11" | "12",
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="21">総合振込</option>
                <option value="11">給与振込</option>
                <option value="12">賞与振込</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                委託者コード
              </label>
              <input
                type="text"
                value={headerData.clientCode}
                onChange={(e) =>
                  setHeaderData({ ...headerData, clientCode: e.target.value })
                }
                placeholder="10桁"
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                委託者名（カナ）
              </label>
              <input
                type="text"
                value={headerData.clientName}
                onChange={(e) =>
                  setHeaderData({ ...headerData, clientName: e.target.value })
                }
                placeholder="カブシキガイシャ ヤマダ"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                振込指定日（MMDD）
              </label>
              <input
                type="text"
                value={headerData.transferDate}
                onChange={(e) =>
                  setHeaderData({ ...headerData, transferDate: e.target.value })
                }
                placeholder="0115"
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                仕向銀行コード
              </label>
              <input
                type="text"
                value={headerData.bankCode}
                onChange={(e) =>
                  setHeaderData({ ...headerData, bankCode: e.target.value })
                }
                placeholder="0001"
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                仕向銀行名（カナ）
              </label>
              <input
                type="text"
                value={headerData.bankName}
                onChange={(e) =>
                  setHeaderData({ ...headerData, bankName: e.target.value })
                }
                placeholder="ミズホ"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                仕向支店コード
              </label>
              <input
                type="text"
                value={headerData.branchCode}
                onChange={(e) =>
                  setHeaderData({ ...headerData, branchCode: e.target.value })
                }
                placeholder="001"
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                仕向支店名（カナ）
              </label>
              <input
                type="text"
                value={headerData.branchName}
                onChange={(e) =>
                  setHeaderData({ ...headerData, branchName: e.target.value })
                }
                placeholder="ホンテン"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                預金種目
              </label>
              <select
                value={headerData.accountType}
                onChange={(e) =>
                  setHeaderData({ ...headerData, accountType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="1">普通</option>
                <option value="2">当座</option>
                <option value="4">貯蓄</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                口座番号
              </label>
              <input
                type="text"
                value={headerData.accountNumber}
                onChange={(e) =>
                  setHeaderData({
                    ...headerData,
                    accountNumber: e.target.value,
                  })
                }
                placeholder="1234567"
                maxLength={7}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* CSV Input Mode */}
        {inputMode === "csv" && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-kon mb-4">CSVデータ入力</h2>
            <p className="text-sm text-gray-600 mb-3">
              形式: 銀行コード,銀行名,支店コード,支店名,預金種目,口座番号,受取人名,金額
            </p>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder={`0001,ミズホ,001,ホンテン,1,1234567,ヤマダタロウ,100000
0005,ミツビシユーエフジェイ,002,シブヤ,1,7654321,タナカハナコ,50000`}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm"
            />
            <button
              onClick={handleCsvParse}
              className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              CSVを解析して下に反映
            </button>
          </section>
        )}

        {/* Transfer Data */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-kon">
              振込先データ（{transfers.length}件）
            </h2>
            <button
              onClick={addTransferRow}
              className="px-3 py-1 bg-kon text-white rounded-lg text-sm hover:bg-kon/90"
            >
              + 行を追加
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left">銀行コード</th>
                  <th className="px-2 py-2 text-left">銀行名</th>
                  <th className="px-2 py-2 text-left">支店コード</th>
                  <th className="px-2 py-2 text-left">支店名</th>
                  <th className="px-2 py-2 text-left">種目</th>
                  <th className="px-2 py-2 text-left">口座番号</th>
                  <th className="px-2 py-2 text-left">受取人名</th>
                  <th className="px-2 py-2 text-left">金額</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-1 py-2">
                      <input
                        type="text"
                        value={transfer.bankCode}
                        onChange={(e) =>
                          updateTransfer(index, "bankCode", e.target.value)
                        }
                        maxLength={4}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-1 py-2">
                      <input
                        type="text"
                        value={transfer.bankName}
                        onChange={(e) =>
                          updateTransfer(index, "bankName", e.target.value)
                        }
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-1 py-2">
                      <input
                        type="text"
                        value={transfer.branchCode}
                        onChange={(e) =>
                          updateTransfer(index, "branchCode", e.target.value)
                        }
                        maxLength={3}
                        className="w-14 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-1 py-2">
                      <input
                        type="text"
                        value={transfer.branchName}
                        onChange={(e) =>
                          updateTransfer(index, "branchName", e.target.value)
                        }
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-1 py-2">
                      <select
                        value={transfer.accountType}
                        onChange={(e) =>
                          updateTransfer(index, "accountType", e.target.value)
                        }
                        className="w-14 px-1 py-1 border rounded"
                      >
                        <option value="1">普通</option>
                        <option value="2">当座</option>
                      </select>
                    </td>
                    <td className="px-1 py-2">
                      <input
                        type="text"
                        value={transfer.accountNumber}
                        onChange={(e) =>
                          updateTransfer(index, "accountNumber", e.target.value)
                        }
                        maxLength={7}
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-1 py-2">
                      <input
                        type="text"
                        value={transfer.recipientName}
                        onChange={(e) =>
                          updateTransfer(index, "recipientName", e.target.value)
                        }
                        placeholder="カナ"
                        className="w-28 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-1 py-2">
                      <input
                        type="text"
                        value={transfer.amount}
                        onChange={(e) =>
                          updateTransfer(index, "amount", e.target.value)
                        }
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-1 py-2">
                      <button
                        onClick={() => removeTransferRow(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={transfers.length === 1}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all mb-6"
        >
          全銀フォーマットに変換
        </button>

        {/* Result */}
        {result && (
          <section className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-kon">変換結果</h3>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-kon text-white rounded-lg text-sm hover:bg-kon/90"
              >
                📥 ダウンロード
              </button>
            </div>
            <div className="bg-white rounded-xl p-4 overflow-x-auto">
              <pre className="text-xs font-mono whitespace-pre">{result}</pre>
            </div>
          </section>
        )}

        {/* Usage Info */}
        <section className="bg-sakura/20 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-kon mb-3">使い方</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>・委託者情報（依頼元の口座情報）を入力</li>
            <li>・振込先データを手動入力またはCSVで入力</li>
            <li>・「全銀フォーマットに変換」をクリック</li>
            <li>・ダウンロードしてネットバンキングにアップロード</li>
          </ul>
        </section>

        {/* Format Info */}
        <section className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-kon mb-3">全銀フォーマットとは</h3>
          <p className="text-sm text-gray-600 mb-3">
            全銀フォーマット（全銀協規定形式）は、全国銀行協会が定めた
            銀行間データ伝送の標準形式です。1レコード120バイトの固定長形式で、
            ヘッダ・データ・トレーラ・エンドの4種類のレコードで構成されます。
          </p>
          <p className="text-sm text-gray-600">
            楽天銀行、住信SBIネット銀行、PayPay銀行など多くのネットバンキングで
            そのままアップロードして一括振込が可能です。
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/convert" className="text-kon hover:text-ai">
            ← 変換ツール一覧に戻る
          </Link>
        </div>

        {/* SEO Content */}
        {seoContent && (
          <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-kon mb-4 text-lg">全銀フォーマット変換について</h2>
            <p className="text-gray-600 mb-4">{seoContent.intro}</p>
            {seoContent.useCases && (
              <div className="grid sm:grid-cols-2 gap-3 my-4">
                {seoContent.useCases.map((uc, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-800">{uc.title}</p>
                    <p className="text-sm text-gray-600">{uc.desc}</p>
                  </div>
                ))}
              </div>
            )}
            {seoContent.tips && (
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-kon">Q.</span>
                      {item.question}
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                    <span className="text-kon font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
