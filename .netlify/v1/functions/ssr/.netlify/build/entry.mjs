import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_DT0QeQSI.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/chat.astro.mjs');
const _page2 = () => import('./pages/chat.astro.mjs');
const _page3 = () => import('./pages/chat-thread.astro.mjs');
const _page4 = () => import('./pages/course.astro.mjs');
const _page5 = () => import('./pages/course/_---slug_.astro.mjs');
const _page6 = () => import('./pages/mit-license.astro.mjs');
const _page7 = () => import('./pages/readme.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.1.10_jiti@1.21.7_rollup@4.32.1_terser@5.37.0_typescript@5.7.3_yaml@2.7.0/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/chat.ts", _page1],
    ["src/pages/chat.astro", _page2],
    ["src/pages/chat-thread.astro", _page3],
    ["src/pages/course/index.astro", _page4],
    ["src/pages/course/[...slug].astro", _page5],
    ["src/pages/mit-license.md", _page6],
    ["src/pages/readme.astro", _page7],
    ["src/pages/index.astro", _page8]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "49be027b-fa8b-4782-9c2f-99ec519997b7"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
