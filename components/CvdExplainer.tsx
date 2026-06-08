// STEP3 の導入解説：色覚のちがいを高校生向けにやさしく説明する。
// 体験（シミュレータ）の前に読めるよう、既定で開いた折りたたみにする。

const TYPES = [
  {
    type: "P型（1型）",
    sensor: "赤担当",
    confuse: "赤と緑（赤がくすむ）",
    freq: "わりと多い",
  },
  { type: "D型（2型）", sensor: "緑担当", confuse: "赤と緑", freq: "いちばん多い" },
  {
    type: "T型（3型）",
    sensor: "青担当",
    confuse: "青と黄",
    freq: "とてもめずらしい",
  },
];

export function CvdExplainer() {
  return (
    <details open className="rounded-lg border bg-muted/40 p-4">
      <summary className="cursor-pointer text-sm font-semibold">
        📖 色の見え方には人によってちがいがある（まず読もう）
      </summary>
      <div className="mt-3 space-y-4 text-sm">
        <p>
          人の目には色を感じる<strong>3種類のセンサー</strong>
          （「赤担当」「緑担当」「青担当」）があり、その組み合わせで色を見分けています。どれかが
          <strong>弱い</strong>と、いくつかの色が似て見えて
          <strong>見分けにくく</strong>なります。
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="text-muted-foreground">
                <th className="border-b p-2 font-medium">タイプ</th>
                <th className="border-b p-2 font-medium">弱いセンサー</th>
                <th className="border-b p-2 font-medium">見分けにくい色</th>
                <th className="border-b p-2 font-medium">どのくらい？</th>
              </tr>
            </thead>
            <tbody>
              {TYPES.map((t) => (
                <tr key={t.type}>
                  <td className="border-b p-2 font-medium">{t.type}</td>
                  <td className="border-b p-2">{t.sensor}</td>
                  <td className="border-b p-2">{t.confuse}</td>
                  <td className="border-b p-2 text-muted-foreground">{t.freq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>覚え方</strong>
          ：P型・D型は「赤と緑」、T型は「青と黄」が苦手ペア。赤緑が苦手な人がいちばん多く（男子のおよそ20人に1人）、祖父もこのタイプです。
        </p>
        <p>
          下の<strong>「程度」スライダー</strong>
          は“弱さ”の強さです。0%で健常者と同じ、上げるほど強くなり、祖父は中くらい（既定60%）に設定しています。
        </p>
        <p className="rounded-md bg-background p-3">
          <strong>デザインのコツ</strong>
          ：「赤＝ダメ／緑＝OK」のように<strong>色だけ</strong>
          で伝えると、同じ色に見えて区別できない人がいます。色だけにたよらず
          <strong>文字・記号・形</strong>でも伝え、
          <strong>明るさの差（コントラスト）</strong>
          を大きくすると、だれにでも伝わります。
        </p>
      </div>
    </details>
  );
}
