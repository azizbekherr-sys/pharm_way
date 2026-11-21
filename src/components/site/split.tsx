/**
 * Dizayndagi so'zma-so'z sarlavha animatsiyasi uchun matnni server tomonida
 * <span class="split-line"><span class="split-word">…</span></span> ga bo'ladi
 * (brauzerda DOM'ni o'zgartirmaslik uchun). CSS: .split-ready .split-word.
 */
export function split(text: string) {
  const words = text.trim().split(/\s+/);
  return words.map((word, i) => (
    <span key={i}>
      <span className="split-line">
        <span className="split-word" style={{ ["--w" as string]: i }}>
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </span>
  ));
}
