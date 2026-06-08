// 個人情報の注意書き（仕様書 §9）。自由記述欄の近くに表示する。
export function PrivacyNote() {
  return (
    <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
      ※ ペルソナ「祖父」は架空です。実在の家族の名前や個人情報は入力しないでください。
    </p>
  );
}
