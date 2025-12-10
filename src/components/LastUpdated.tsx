interface LastUpdatedProps {
  date: string; // ISO 8601 format: "2024-12-07"
}

export default function LastUpdated({ date }: LastUpdatedProps) {
  const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="text-sm text-gray-500 border-t border-gray-200 pt-4 mt-8">
      <p>📅 最終更新日: {formattedDate}</p>
    </div>
  );
}
