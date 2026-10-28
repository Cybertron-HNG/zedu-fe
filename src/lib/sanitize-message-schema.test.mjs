import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const { messageSanitizeSchema } = await import("./sanitize-message-schema.ts");

const render = (markdown) =>
  renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeRaw, [rehypeSanitize, messageSanitizeSchema]],
      },
      markdown
    )
  );

test("drops an iframe with a script srcdoc", () => {
  const html = render(
    '<iframe srcdoc="<script>alert(document.domain)</script>"></iframe>'
  );
  assert.doesNotMatch(html, /iframe/i);
  assert.doesNotMatch(html, /srcdoc/i);
  assert.doesNotMatch(html, /<script/i);
});

test("drops script, style, form, object, embed and meta elements", () => {
  for (const payload of [
    "<script>alert(1)</script>",
    "<style>body{display:none}</style>",
    '<form action="https://evil.example"><input name="p"></form>',
    '<object data="https://evil.example/x.swf"></object>',
    '<embed src="https://evil.example/x.swf">',
    '<meta http-equiv="refresh" content="0;url=https://evil.example">',
  ]) {
    const html = render(`before ${payload} after`);
    assert.doesNotMatch(html, /display:none|alert\(1\)|evil\.example/, payload);
    assert.doesNotMatch(
      html,
      /<(script|style|form|object|embed|meta)\b/i,
      payload
    );
  }
});

test("drops event-handler attributes", () => {
  const html = render(
    '<img src="https://cdn.example/a.png" onerror="alert(1)">'
  );
  assert.doesNotMatch(html, /onerror/i);
  const span = render(
    '<span onclick="alert(1)" onmouseover="alert(2)">hi</span>'
  );
  assert.doesNotMatch(span, /onclick|onmouseover/i);
  assert.match(span, /hi/);
});

test("drops javascript: urls from raw anchors and images", () => {
  const a = render('<a href="javascript:alert(1)">click</a>');
  assert.doesNotMatch(a, /javascript:/i);
  const img = render('<img src="javascript:alert(1)">');
  assert.doesNotMatch(img, /javascript:/i);
});

test("drops inline style attributes", () => {
  const html = render(
    '<div style="position:fixed;inset:0;background:red">overlay</div>'
  );
  assert.doesNotMatch(html, /style=/i);
});

test("keeps markdown formatting the composer produces", () => {
  const html = render(
    [
      "**bold** and _italic_ and ~~gone~~",
      "",
      "- one",
      "- two",
      "",
      "> quoted",
      "",
      "| a | b |",
      "| - | - |",
      "| 1 | 2 |",
      "",
      "[docs](https://zedu.chat/docs)",
    ].join("\n")
  );
  for (const tag of [
    "strong",
    "em",
    "del",
    "ul",
    "li",
    "blockquote",
    "table",
    "th",
    "td",
  ]) {
    assert.match(html, new RegExp(`<${tag}\\b`), tag);
  }
  assert.match(html, /href="https:\/\/zedu\.chat\/docs"/);
});

test("keeps code classes the renderer styles", () => {
  const inline = render('<code class="slack-inline-code">npm i</code>');
  assert.match(inline, /class="slack-inline-code"/);
  const block = render(
    '<pre class="slack-code-block"><code class="language-ts">const a = 1</code></pre>'
  );
  assert.match(block, /class="slack-code-block"/);
  assert.match(block, /class="language-ts"/);
});

test("keeps mention spans with their data attributes", () => {
  const html = render(
    '<span class="mention" data-type="mention" data-id="u-1" data-label="dean">@dean</span>'
  );
  assert.match(html, /class="mention"/);
  assert.match(html, /data-id="u-1"/);
  assert.match(html, /data-label="dean"/);
});

test("keeps apple emoji images but not arbitrary classes", () => {
  const emoji = render(
    '<img class="apple-emoji-img" alt="😀" src="https://cdn.example/1f600.png" draggable="false" />'
  );
  assert.match(emoji, /class="apple-emoji-img"/);
  assert.match(emoji, /src="https:\/\/cdn\.example\/1f600\.png"/);

  const other = render('<span class="fixed inset-0 z-50">x</span>');
  assert.doesNotMatch(other, /fixed|inset-0|z-50/);
});
