"use client";
import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface UnlockClientProps {
  faq?: FAQ[];
}

export default function UnlockClient({ faq }: UnlockClientProps) {
  const tool = pdfTools.find(t => t.id === "unlock")!;

  return (
    <>
      {/* Legal Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mx-4 mt-4 rounded-r-lg">
        <div className="flex items-start">
          <span className="text-amber-500 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="font-bold text-amber-800 mb-1">ご利用上の注意</h3>
            <p className="text-amber-700 text-sm">
              このツールは、<strong>ご自身が所有する</strong>PDFのパスワード解除にのみご利用ください。
              他人のPDFを無断で解除することは、著作権法やその他の法律に違反する可能性があります。
              本ツールの不正使用によって生じた損害について、当社は一切の責任を負いません。
            </p>
          </div>
        </div>
      </div>

      <ToolPage tool={tool} faq={faq} />
    </>
  );
}
