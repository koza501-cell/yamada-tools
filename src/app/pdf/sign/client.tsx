"use client";
import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface SignClientProps {
  faq?: FAQ[];
}

export default function SignClient({ faq }: SignClientProps) {
  const tool = pdfTools.find(t => t.id === "sign")!;

  return (
    <>
      {/* Legal Disclaimer Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-4 mt-4 rounded-r-lg">
        <div className="flex items-start">
          <span className="text-blue-500 text-xl mr-3">ℹ️</span>
          <div>
            <h3 className="font-bold text-blue-800 mb-1">法的効力について</h3>
            <p className="text-blue-700 text-sm">
              本ツールはテキストベースの視覚的な署名を追加するものです。
              <strong>法的効力のある電子署名（デジタル署名）ではありません。</strong>
              正式な契約や法的文書には、認定された電子署名サービスをご利用ください。
            </p>
          </div>
        </div>
      </div>

      <ToolPage tool={tool} faq={faq} />
    </>
  );
}
