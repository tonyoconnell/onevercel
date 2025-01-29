/* empty css                                     */
import { c as createComponent, r as renderTemplate, a as renderComponent, b as createAstro, m as maybeRenderHead, f as renderSlot, u as unescapeHTML } from '../chunks/astro/server_Drq0HSre.mjs';
import { $ as $$Layout } from '../chunks/Layout_DARiigJU.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$TextLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TextLayout;
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": frontmatter.title, "description": frontmatter.description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-3xl mx-auto px-4 py-8"> <article class="prose dark:prose-invert prose-slate max-w-none"> ${renderSlot($$result2, $$slots["default"])} </article> </main> ` })}`;
}, "/Users/toc/Server/ONE/local/astro-shadcn/src/layouts/TextLayout.astro", undefined);

const html = () => "<h1 id=\"mit-license\">MIT License</h1>\n<p>Copyright (c) 2024 Agent C <a href=\"https://one.ie\">https://one.ie</a></p>\n<p>Permission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the “Software”), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:</p>\n<p>The above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.</p>\n<p>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.</p>";

				const frontmatter = {"layout":"../layouts/TextLayout.astro","title":"MIT License","description":"A permissive license that allows for free use, modification, and distribution"};
				const file = "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/mit-license.md";
				const url = "/mit-license";
				function rawContent() {
					return "   \n                                   \n                  \n                                                                                          \n   \n\n# MIT License\n\nCopyright (c) 2024 Agent C https://one.ie\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE. ";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":1,"slug":"mit-license","text":"MIT License"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${renderComponent(result, 'Layout', $$TextLayout, {
								file,
								url,
								content,
								frontmatter: content,
								headings: getHeadings(),
								rawContent,
								compiledContent,
								'server:root': true,
							}, {
								'default': () => renderTemplate`${unescapeHTML(html())}`
							})}`;
				});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content,
  compiledContent,
  default: Content,
  file,
  frontmatter,
  getHeadings,
  rawContent,
  url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
