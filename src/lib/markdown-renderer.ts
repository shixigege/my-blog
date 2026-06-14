import { marked } from "marked";
import { createHighlighter } from "shiki";

let hl: Awaited<ReturnType<typeof createHighlighter>> | null = null;

export async function renderMarkdown(md: string) {
  const tokens = marked.lexer(md);
  if (!hl) hl = await createHighlighter({ themes: ["one-dark-pro"], langs: ["js","ts","tsx","python","css","html","bash","json","yaml","markdown","sql","rust","go","java","cpp","c","sh"] });
  marked.setOptions({ breaks: true, gfm: true });
  marked.use({ renderer: { code({ text, lang }: { text: string; lang?: string }) {
    const l = lang && hl!.getLoadedLanguages().includes(lang) ? lang : "text";
    return hl!.codeToHtml(text, { lang: l, theme: "one-dark-pro" });
  }}});
  let html = marked.parse(md) as string;
  html = html.replace(/<(h[1-3])>(.*?)<\/\1>/g, (_: string, tag: string, c: string) => {
    const id = c.replace(/<[^>]*>/g, "").replace(/[^一-鿿\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase();
    return `<${tag} id="${id}">${c}</${tag}>`;
  });
  return html;
}
