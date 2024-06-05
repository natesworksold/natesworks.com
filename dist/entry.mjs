import { escape } from 'html-escaper';
/* empty css                                  *//* empty css                                *//* empty css                                 */import path from 'path';
import matter from 'gray-matter';
import fs from 'fs/promises';
import { globby } from 'globby';
import Markdoc from '@markdoc/markdoc';
import { z } from 'zod';
/* empty css                                *//* empty css                                    */import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
/* empty css                                  *//* empty css                                */
function baseCreateComponent(cb, moduleId) {
  cb.isAstroComponentFactory = true;
  cb.moduleId = moduleId;
  return cb;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId);
  cb.propagation = opts.propagation;
  return cb;
}
function createComponent(arg1, moduleId) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId);
  } else {
    return createComponentWithOptions(arg1);
  }
}

const ASTRO_VERSION = "1.9.2";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLBytes extends Uint8Array {
}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  }
});
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
async function* unescapeChunksAsync(iterable) {
  for await (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const headAndContentSym = Symbol.for("astro.headAndContent");
function isHeadAndContent(obj) {
  return typeof obj === "object" && !!obj[headAndContentSym];
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

var _a$3;
const renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
class RenderTemplateResult {
  constructor(htmlParts, expressions) {
    this[_a$3] = true;
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [(_a$3 = renderTemplateResultSym, Symbol.toStringTag)]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && !!obj[renderTemplateResultSym];
}
async function* renderAstroTemplateResult(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}

function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function renderToString(result, componentFactory, props, children) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    const response = factoryResult;
    throw response;
  }
  let parts = new HTMLParts();
  const templateResult = isHeadAndContent(factoryResult) ? factoryResult.content : factoryResult;
  for await (const chunk of renderAstroTemplateResult(templateResult)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
function isAPropagatingComponent(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.propagation.has(factory.moduleId) && hint === "none") {
    hint = result.propagation.get(factory.moduleId);
  }
  return hint === "in-tree" || hint === "self";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message: "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message: "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${plural ? "s." : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were." : "it was not."} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) => `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message: "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message: "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported."
  },
  InvalidPrerenderExport: {
    title: "Invalid prerender export.",
    code: 3019,
    message: (prefix, suffix) => {
      let msg = `A \`prerender\` export has been detected, but its value cannot be statically analyzed.`;
      if (prefix !== "const")
        msg += `
Expected \`const\` declaration but got \`${prefix}\`.`;
      if (suffix !== "true")
        msg += `
Expected \`true\` value but got \`${suffix}\`.`;
      return msg;
    },
    hint: "Mutable values declared at runtime are not supported. Please make sure to use exactly `export const prerender = true`."
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) => `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001
  },
  MarkdownContentSchemaValidationError: {
    title: "Content collection frontmatter invalid.",
    code: 6002,
    message: (collection, entryId, error) => {
      return [
        `${String(collection)} \u2192 ${String(entryId)} frontmatter does not match collection schema.`,
        ...error.errors.map((zodError) => zodError.message)
      ].join("\n");
    },
    hint: "See https://docs.astro.build/en/guides/content-collections/ for more information on content schemas."
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) => `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information."
  },
  UnknownCLIError: {
    title: "Unknown CLI Error.",
    code: 8e3
  },
  GenerateContentTypesError: {
    title: "Failed to generate content types.",
    code: 8001,
    message: "`astro sync` command failed to generate content collection types.",
    hint: "Check your `src/content/config.*` file for typos."
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name && name !== "Error") {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    this.errorCode = errorCode;
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var _a$2;
const astroComponentInstanceSym = Symbol.for("astro.componentInstance");
class AstroComponentInstance {
  constructor(result, props, slots, factory) {
    this[_a$2] = true;
    this.result = result;
    this.props = props;
    this.factory = factory;
    this.slotValues = {};
    for (const name in slots) {
      this.slotValues[name] = slots[name]();
    }
  }
  async init() {
    this.returnValue = this.factory(this.result, this.props, this.slotValues);
    return this.returnValue;
  }
  async *render() {
    if (this.returnValue === void 0) {
      await this.init();
    }
    let value = this.returnValue;
    if (isPromise(value)) {
      value = await value;
    }
    if (isHeadAndContent(value)) {
      yield* value.content;
    } else {
      yield* renderChild(value);
    }
  }
}
_a$2 = astroComponentInstanceSym;
function validateComponentProps(props, displayName) {
  if (props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  if (isAPropagatingComponent(result, factory) && !result.propagators.has(factory)) {
    result.propagators.set(factory, instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && !!obj[astroComponentInstanceSym];
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (isRenderTemplateResult(child)) {
    yield* renderAstroTemplateResult(child);
  } else if (isAstroComponentInstance(child)) {
    yield* child.render();
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToIterable(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToIterable(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && typeof Component === "object" && Component["astro:html"];
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  var _a, _b;
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroTemplateResult(
      await renderTemplate`<${Tag}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/g;
  if (!unsafe.test(tag))
    return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlot(result, slots == null ? void 0 : slots.default);
  if (children == null) {
    return children;
  }
  return markHTMLString(children);
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component.render({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => stringifyChunk(result, instr)).join("") : "";
  return markHTMLString(hydrationHtml + html);
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Promise.resolve(Component).then((Unwrapped) => {
      return renderComponent(result, displayName, Unwrapped, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots);
  }
  if (isAstroComponentFactory(Component)) {
    return createAstroComponentInstance(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots);
}
function renderComponentToIterable(result, displayName, Component, props, slots = {}) {
  const renderResult = renderComponent(result, displayName, Component, props, slots);
  if (isAstroComponentInstance(renderResult)) {
    return renderResult.render();
  }
  return renderResult;
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
async function* renderExtraHead(result, base) {
  yield base;
  for (const part of result.extraHead) {
    yield* renderChild(part);
  }
}
function renderAllHeadContent(result) {
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  const baseHeadContent = markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
  if (result.extraHead.length > 0) {
    return renderExtraHead(result, baseHeadContent);
  } else {
    return baseHeadContent;
  }
}
function createRenderHead(result) {
  result._metadata.hasRenderedHead = true;
  return renderAllHeadContent.bind(null, result);
}
const renderHead = createRenderHead;
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield createRenderHead(result)();
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

function getPageMeta({
  title: pageTitle,
  description,
  baseUrl,
  ogImageAbsoluteUrl,
  ogImageAltText,
  ogImageWidth,
  ogImageHeight,
  siteOwnerTwitterHandle,
  contentAuthorTwitterHandle
}) {
  if (!pageTitle) {
    throw Error("title is required for page SEO");
  }
  if (ogImageAbsoluteUrl) {
    ogImageAltText = !ogImageAltText ? `Preview image for ${pageTitle}` : ogImageAltText;
  }
  const meta = { title: pageTitle, description };
  const og = {
    title: pageTitle,
    description,
    type: "website",
    url: baseUrl,
    image: ogImageAbsoluteUrl,
    imageAlt: ogImageAltText,
    imageWidth: ogImageWidth ? String(ogImageWidth) : void 0,
    imageHeight: ogImageHeight ? String(ogImageHeight) : void 0
  };
  const twitter = {
    title: pageTitle,
    description,
    card: "summary_large_image",
    site: siteOwnerTwitterHandle,
    creator: contentAuthorTwitterHandle || siteOwnerTwitterHandle,
    image: ogImageAbsoluteUrl,
    imageAlt: ogImageAltText
  };
  return {
    meta,
    og,
    twitter
  };
}
function getBlogPostMeta({
  title: pageTitle,
  description,
  canonicalUrl,
  pageUrl,
  authorName,
  publishDate,
  ogImageAbsoluteUrl,
  ogImageAltText,
  ogImageWidth,
  ogImageHeight,
  siteOwnerTwitterHandle,
  contentAuthorTwitterHandle
}) {
  if (!pageTitle) {
    throw Error("title is required for page SEO");
  }
  if (ogImageAbsoluteUrl && !ogImageAltText) {
    ogImageAltText = `Preview image for ${pageTitle}`;
  }
  const meta = {
    title: pageTitle,
    description,
    canonicalUrl
  };
  const og = {
    title: pageTitle,
    description,
    type: "article",
    url: pageUrl,
    author: authorName,
    publishDate,
    image: ogImageAbsoluteUrl,
    imageAlt: ogImageAltText,
    imageWidth: ogImageWidth ? String(ogImageWidth) : void 0,
    imageHeight: ogImageHeight ? String(ogImageHeight) : void 0
  };
  const twitter = {
    title: pageTitle,
    description,
    card: "summary_large_image",
    site: siteOwnerTwitterHandle,
    creator: contentAuthorTwitterHandle || siteOwnerTwitterHandle,
    image: ogImageAbsoluteUrl,
    imageAlt: ogImageAltText
  };
  return {
    meta,
    og,
    twitter
  };
}

const SITE_TITLE = "Natesworks Blog";
const SITE_DESCRIPTION = "Welcome to Natesworks Blog, where we discuss C++, C#, Python, and the development of SwiftOS Next. Dive into coding topics, language insights, and SwiftOS Next updates..";
const TWITTER_HANDLE = "@natesworks";
const MY_NAME = "Natesworks";
const BASE_URL = new URL("https://natesworks.com/");
const SITE_URL = BASE_URL.origin;

const $$Astro$q = createAstro("/data/data/com.termux/files/home/blog/src/components/PageMeta.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$PageMeta = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$PageMeta;
  const { title, description } = Astro2.props;
  const { meta, og, twitter } = getPageMeta({
    title: title || SITE_TITLE,
    description: description || SITE_DESCRIPTION,
    baseUrl: SITE_URL,
    ogImageAbsoluteUrl: `${SITE_URL}/images/og.png`,
    ogImageAltText: "My fancy website",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    siteOwnerTwitterHandle: TWITTER_HANDLE,
    contentAuthorTwitterHandle: TWITTER_HANDLE
  });
  return renderTemplate`<!-- Primary Meta Tags --><title>${meta.title}</title>
<meta name="title"${addAttribute(meta.title, "content")}>
${meta.description && renderTemplate`<meta name="description"${addAttribute(meta.description, "content")}>`}

<!-- Open Graph / Facebook -->
${og.title && renderTemplate`<meta property="og:title"${addAttribute(og.title, "content")}>`}
${og.description && renderTemplate`<meta property="og:description"${addAttribute(og.description, "content")}>`}
${og.type && renderTemplate`<meta property="og:type"${addAttribute(og.type, "content")}>`}
${og.url && renderTemplate`<meta property="og:url"${addAttribute(og.url, "content")}>`}
${og.image && renderTemplate`<meta property="og:image"${addAttribute(og.image, "content")}>`}
${og.imageAlt && renderTemplate`<meta property="og:image:alt"${addAttribute(og.imageAlt, "content")}>`}
${og.imageWidth && renderTemplate`<meta property="og:image:width"${addAttribute(og.imageWidth, "content")}>`}
${og.imageHeight && renderTemplate`<meta property="og:image:height"${addAttribute(og.imageHeight, "content")}>`}

<!-- Twitter -->
${twitter.title && renderTemplate`<meta property="twitter:title"${addAttribute(twitter.title, "content")}>`}
${twitter.description && renderTemplate`<meta property="twitter:description"${addAttribute(twitter.description, "content")}>`}
${twitter.site && renderTemplate`<meta property="twitter:site"${addAttribute(twitter.site, "content")}>`}
${twitter.creator && renderTemplate`<meta property="twitter:creator"${addAttribute(twitter.creator, "content")}>`}
<meta property="twitter:card" content="summary_large_image">
${twitter.image && renderTemplate`<meta property="twitter:image"${addAttribute(twitter.image, "content")}>`}
${twitter.imageAlt && renderTemplate`<meta property="twitter:image:alt"${addAttribute(twitter.imageAlt, "content")}>`}
<!-- {twitter.url && <meta property="twitter:url" content={twitter.url} />} -->
`;
}, "/data/data/com.termux/files/home/blog/src/components/PageMeta.astro");

const $$Astro$p = createAstro("/data/data/com.termux/files/home/blog/src/components/HeaderLink.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$HeaderLink = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$HeaderLink;
  const { href, class: className, ...props } = Astro2.props;
  const path = Astro2.url.pathname.replace(/\/$/, "");
  const isHome = href === "/" && path === "";
  const isOtherPages = typeof href === "string" && href.length > 1 ? path.substring(1).startsWith(href.substring(1)) : false;
  const isActive = isHome || isOtherPages;
  return renderTemplate`<!-- DO NOT FORMAT. IT ADDS AN EXTRA SPACE ON RENDERED CONTENT. -->${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute([[
    className,
    { active: isActive },
    "header-link unset",
    "animated",
    "gradient-colors"
  ], "astro-JEB4RVNW"], "class:list")}${spreadAttributes(props)}>${renderSlot($$result, $$slots["default"])}</a>
`;
}, "/data/data/com.termux/files/home/blog/src/components/HeaderLink.astro");

const $$Astro$o = createAstro("/data/data/com.termux/files/home/blog/src/components/ui/icons/github.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Github = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$Github;
  const { title, width, height, class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute([[className, "icon-wrapper"], "astro-JSWDKU5I"], "class:list")}>
  <svg class="icon astro-JSWDKU5I" id="github-icon" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"${addAttribute(width || "1.5rem", "width")}${addAttribute(height || "1.75rem", "height")}>
    <defs class="astro-JSWDKU5I">
      <style>
        .github-icon-cls-1 {
          fill-rule: evenodd;
        }
        .github-icon-cls-2 {
          fill: none;
        }
      </style>
    </defs>
    <title>${title}</title>
    <path class="github-icon-cls-1 astro-JSWDKU5I" d="M16,2a14,14,0,0,0-4.43,27.28c.7.13,1-.3,1-.67s0-1.21,0-2.38c-3.89.84-4.71-1.88-4.71-1.88A3.71,3.71,0,0,0,6.24,22.3c-1.27-.86.1-.85.1-.85A2.94,2.94,0,0,1,8.48,22.9a3,3,0,0,0,4.08,1.16,2.93,2.93,0,0,1,.88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4,5.4,0,0,1,1.44-3.76,5,5,0,0,1,.14-3.7s1.17-.38,3.85,1.43a13.3,13.3,0,0,1,7,0c2.67-1.81,3.84-1.43,3.84-1.43a5,5,0,0,1,.14,3.7,5.4,5.4,0,0,1,1.44,3.76c0,5.38-3.27,6.56-6.39,6.91a3.33,3.33,0,0,1,.95,2.59c0,1.87,0,3.38,0,3.84s.25.81,1,.67A14,14,0,0,0,16,2Z">
    </path>
    <rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="github-icon-cls-2 astro-JSWDKU5I" width="32" height="32">
    </rect>
  </svg>
</span>

`;
}, "/data/data/com.termux/files/home/blog/src/components/ui/icons/github.astro");

const $$Astro$n = createAstro("/data/data/com.termux/files/home/blog/src/components/Header.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead($$result)}<header class="astro-QHFEZWCN">
  <a class="skip-to-main astro-QHFEZWCN" href="#main"> Skip to content</a>
  <nav class="astro-QHFEZWCN">
    <section class="astro-QHFEZWCN">
      <ul class="astro-QHFEZWCN">
        <li class="astro-QHFEZWCN">${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/", "class": "astro-QHFEZWCN" }, { "default": () => renderTemplate`Home` })}</li>
        <li class="astro-QHFEZWCN">${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/blog", "class": "astro-QHFEZWCN" }, { "default": () => renderTemplate`Blog` })}</li>
        <li class="astro-QHFEZWCN">${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/projects", "class": "astro-QHFEZWCN" }, { "default": () => renderTemplate`Projects` })}</li>
      </ul>
    </section>
  </nav>
  <div class="social-handles astro-QHFEZWCN">
    <a class="centered astro-QHFEZWCN" href="https://github.com/natesworks" aria-label="Natesworks on GitHub">
      ${renderComponent($$result, "GitHubIcon", $$Github, { "title": "GitHub", "class": "astro-QHFEZWCN" })}
  </a></div><a class="centered astro-QHFEZWCN" href="https://github.com/natesworks" aria-label="Natesworks on GitHub">
</a></header><a class="centered astro-QHFEZWCN" href="https://github.com/natesworks" aria-label="Natesworks on GitHub">

</a>`;
}, "/data/data/com.termux/files/home/blog/src/components/Header.astro");

const $$Astro$m = createAstro("/data/data/com.termux/files/home/blog/src/components/Footer.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer class="astro-EYAIA7B4">
  <div class="astro-EYAIA7B4">Made by Natesworks
  </div>
</footer>

`;
}, "/data/data/com.termux/files/home/blog/src/components/Footer.astro");

const $$Astro$l = createAstro("/data/data/com.termux/files/home/blog/src/layouts/Favicon.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Favicon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$Favicon;
  return renderTemplate`<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#18181b">
<!-- 
  This is an example. 
  Use https://realfavicongenerator.net to generate the icons and manifest. 
-->
<link href="/favicon.ico" rel="shortcut icon">
`;
}, "/data/data/com.termux/files/home/blog/src/layouts/Favicon.astro");

const $$Astro$k = createAstro("/data/data/com.termux/files/home/blog/src/layouts/PageLayout.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$PageLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$PageLayout;
  return renderTemplate`<html class="theme-sleek astro-WSRGEYON" lang="en">
  <head>
    <!-- Global Metadata -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="generator" content="Blogster">
    ${renderComponent($$result, "Favicon", $$Favicon, { "class": "astro-WSRGEYON" })}
    ${renderSlot($$result, $$slots["meta"])}
  ${renderHead($$result)}</head>

  <body class="text-text-body bg-bg-body max-w-3xl mx-auto px-4 sm:px-8 astro-WSRGEYON">
    ${renderComponent($$result, "Header", $$Header, { "class": "astro-WSRGEYON" })}
    <main id="main" class="astro-WSRGEYON">
      ${renderSlot($$result, $$slots["main"])}
    </main>
    ${renderComponent($$result, "Footer", $$Footer, { "class": "astro-WSRGEYON" })}
    
  </body>
</html>`;
}, "/data/data/com.termux/files/home/blog/src/layouts/PageLayout.astro");

const $$Astro$j = createAstro("/data/data/com.termux/files/home/blog/src/components/ui/Heading.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Heading$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Heading$1;
  const { as: Tag = "h1", class: className, ...props } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class:list": [className, "heading"], ...props }, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}

`;
}, "/data/data/com.termux/files/home/blog/src/components/ui/Heading.astro");

const $$Astro$i = createAstro("/data/data/com.termux/files/home/blog/src/components/Intro.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Intro = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Intro;
  return renderTemplate`${maybeRenderHead($$result)}<section class="wrapper astro-3JHPOKTP">
  ${renderComponent($$result, "Heading", $$Heading$1, { "as": "h1", "class": "name gradient-text gradient-color outline outline-color astro-3JHPOKTP" }, { "default": () => renderTemplate`
    Natesworks Blog
  ` })}
  <p class="hello astro-3JHPOKTP">
  Welcome to Natesworks Blog, where we discuss C++, C#, Python, and the development of SwiftOS Next. Dive into coding topics, language insights, and SwiftOS Next updates.
  </p>
</section>

`;
}, "/data/data/com.termux/files/home/blog/src/components/Intro.astro");

const $$Astro$h = createAstro("/data/data/com.termux/files/home/blog/src/pages/index.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {}, { "main": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "main" }, { "default": () => renderTemplate`${renderComponent($$result, "Intro", $$Intro, {})}` })}`, "meta": () => renderTemplate`${renderComponent($$result, "PageMeta", $$PageMeta, { "title": `${SITE_TITLE} | Web Ninja`, "slot": "meta" })}` })}`;
}, "/data/data/com.termux/files/home/blog/src/pages/index.astro");

const $$file$3 = "/data/data/com.termux/files/home/blog/src/pages/index.astro";
const $$url$3 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const { nodes, Tag } = Markdoc;
const config = {
  tags: {
    details: {
      render: "details",
      children: nodes.document.children
    },
    summary: {
      render: "summary",
      children: nodes.document.children
    },
    sup: {
      render: "sup",
      children: nodes.strong.children
    },
    sub: {
      render: "sub",
      children: nodes.strong.children
    },
    abbr: {
      render: "abbr",
      attributes: {
        title: { type: String }
      },
      children: nodes.strong.children
    },
    kbd: {
      render: "kbd",
      children: nodes.strong.children
    },
    mark: {
      render: "mark",
      children: nodes.strong.children
    },
    youtube: {
      render: "YouTubeEmbed",
      attributes: {
        url: { type: String, required: true },
        label: { type: String, required: true }
      },
      selfClosing: true
    },
    tweet: {
      render: "TweetEmbed",
      attributes: {
        url: { type: String, required: true }
      },
      selfClosing: true
    },
    codepen: {
      render: "CodePenEmbed",
      attributes: {
        url: { type: String, required: true },
        title: { type: String, required: true }
      },
      selfClosing: true
    },
    githubgist: {
      render: "GitHubGistEmbed",
      attributes: {
        id: { type: String, required: true }
      },
      selfClosing: true
    }
  },
  nodes: {
    heading: {
      render: "Heading",
      attributes: {
        level: { type: Number, required: true }
      },
      transform(node, config2) {
        const attributes = node.transformAttributes(config2);
        const children = node.transformChildren(config2);
        return new Tag(this.render, { ...attributes }, children);
      }
    },
    fence: {
      render: "CodeBlock",
      attributes: {
        content: { type: String, render: false, required: true },
        language: { type: String, default: "typescript" },
        process: { type: Boolean, render: false, default: false }
      },
      transform(node, config2) {
        const attributes = node.transformAttributes(config2);
        const children = node.transformChildren(config2);
        if (children.some((child) => typeof child !== "string")) {
          throw new Error(
            `unexpected non-string child of code block from ${node.location?.file ?? "(unknown file)"}:${node.location?.start.line ?? "(unknown line)"}`
          );
        }
        return new Tag(
          this.render,
          { ...attributes, content: children.join("") },
          []
        );
      }
    }
  }
};

const contentDirectory = path.normalize("./content");
async function parseAndTransform({ content }) {
  const ast = Markdoc.parse(content);
  const errors = Markdoc.validate(ast, config);
  if (errors.length) {
    console.error(errors);
    throw new Error("Markdoc validation error");
  }
  const transformedContent = Markdoc.transform(ast, config);
  return transformedContent;
}
function validateFrontmatter({
  frontmatter,
  schema,
  filepath
}) {
  try {
    const validatedFrontmatter = schema.parse(frontmatter);
    return validatedFrontmatter;
  } catch (e) {
    const errMessage = `
      There was an error validating your frontmatter. 
      Please make sure your frontmatter for file: ${filepath} matches its schema.
    `;
    throw Error(errMessage + e.message);
  }
}
async function read({
  filepath,
  schema
}) {
  const rawString = await fs.readFile(filepath, "utf8");
  const { content, data: frontmatter } = matter(rawString);
  const transformedContent = await parseAndTransform({ content });
  const validatedFrontmatter = validateFrontmatter({
    frontmatter,
    schema,
    filepath
  });
  const filename = filepath.split("/").pop();
  if (typeof filename !== "string") {
    throw new Error("Check what went wrong");
  }
  const fileNameWithoutExtension = filename.replace(/\.[^.]*$/, "");
  return {
    slug: fileNameWithoutExtension,
    content: transformedContent,
    frontmatter: validatedFrontmatter
  };
}
async function readOne({
  directory,
  slug,
  frontmatterSchema: schema
}) {
  const filepath = path.join(contentDirectory, directory, `${slug}.md`);
  return read({
    filepath,
    schema
  });
}
async function readAll({
  directory,
  frontmatterSchema: schema
}) {
  const pathToDir = path.posix.join(contentDirectory, directory);
  const paths = await globby(`${pathToDir}/*.md`);
  return Promise.all(paths.map((path2) => read({ filepath: path2, schema })));
}

const baseSchema = z.object({
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  title: z.string({
    required_error: "Required frontmatter missing: title",
    invalid_type_error: "title must be a string"
  }),
  date: z.date({
    required_error: "Required frontmatter missing: date",
    invalid_type_error: "date must be written in yyyy-mm-dd format without quotes: For example, Jan 22, 2000 should be written as 2000-01-22."
  })
});
const blog = z.discriminatedUnion("external", [
  baseSchema.extend({
    external: z.literal(false),
    description: z.optional(z.string()),
    ogImagePath: z.optional(z.string()),
    canonicalUrl: z.optional(z.string())
  }),
  baseSchema.extend({
    external: z.literal(true),
    url: z.string({
      required_error: "external is true but url is missing. url must be set for posts marked as external.",
      invalid_type_error: "external should be string."
    })
  })
]);
const project = baseSchema.extend({
  url: z.string()
});

const $$Astro$g = createAstro("/data/data/com.termux/files/home/blog/src/components/ui/icons/external-link.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$ExternalLink = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$ExternalLink;
  const { title, width, height, class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute([[className, "icon-wrapper"], "astro-NXKDGPXU"], "class:list")}>
  <svg class="icon astro-NXKDGPXU" id="external-link-icon" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg"${addAttribute(width || "1.5rem", "width")}${addAttribute(height || "1.75rem", "height")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <title>${title}</title>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" class="astro-NXKDGPXU"></path>
    <polyline points="15 3 21 3 21 9" class="astro-NXKDGPXU"></polyline>
    <line x1="10" y1="14" x2="21" y2="3" class="astro-NXKDGPXU"></line>
  </svg>
</span>

`;
}, "/data/data/com.termux/files/home/blog/src/components/ui/icons/external-link.astro");

const $$Astro$f = createAstro("/data/data/com.termux/files/home/blog/src/pages/projects.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Projects;
  const projects = await readAll({
    directory: "projects",
    frontmatterSchema: project
  });
  const sortedProjects = projects.filter((p) => p.frontmatter.draft !== true).sort(
    (a, b) => new Date(b.frontmatter.date).valueOf() - new Date(a.frontmatter.date).valueOf()
  );
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "class": "astro-355GOEM6" }, { "main": () => renderTemplate`${maybeRenderHead($$result)}<section class="astro-355GOEM6">
    <ul class="astro-355GOEM6">
      ${sortedProjects.map((project2) => {
    const formattedDate = new Date(
      project2.frontmatter.date
    ).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    return renderTemplate`<li class="project astro-355GOEM6">
              <div class="title astro-355GOEM6">
                <a${addAttribute(project2.frontmatter.url, "href")} target="_blank" class="astro-355GOEM6">
                  <span class="astro-355GOEM6">${project2.frontmatter.title}</span>
                  ${renderComponent($$result, "ExternalLinkIcon", $$ExternalLink, { "class": "icon-realign astro-355GOEM6", "title": "Link to project", "height": 16, "width": 16 })}
                </a>
              </div>
              <div class="publish-date astro-355GOEM6">
                <time${addAttribute(project2.frontmatter.date.toISOString(), "datetime")} class="astro-355GOEM6">
                  ${formattedDate}
                </time>
              </div>
            </li>`;
  })}
    </ul>
  </section>`, "meta": () => renderTemplate`${renderComponent($$result, "PageMeta", $$PageMeta, { "title": `Projects | ${SITE_TITLE}`, "slot": "meta", "class": "astro-355GOEM6" })}` })}

`;
}, "/data/data/com.termux/files/home/blog/src/pages/projects.astro");

const $$file$2 = "/data/data/com.termux/files/home/blog/src/pages/projects.astro";
const $$url$2 = "/projects";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Projects,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const get = async () => {
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog
  });
  const sortedPosts = posts.filter((p) => p.frontmatter.draft !== true).sort(
    (a, b) => new Date(b.frontmatter.date).valueOf() - new Date(a.frontmatter.date).valueOf()
  );
  let baseUrl = SITE_URL;
  baseUrl = baseUrl.replace(/\/+$/g, "");
  const rssItems = sortedPosts.map(({ frontmatter, slug }) => {
    if (frontmatter.external) {
      const title2 = frontmatter.title;
      const pubDate2 = frontmatter.date;
      const link2 = frontmatter.url;
      return {
        title: title2,
        pubDate: pubDate2,
        link: link2
      };
    }
    const title = frontmatter.title;
    const pubDate = frontmatter.date;
    const description = frontmatter.description;
    const link = `${baseUrl}/blog/${slug}`;
    return {
      title,
      pubDate,
      description,
      link
    };
  });
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    items: rssItems
  });
};

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

const { Tag: MarkdocTag } = Markdoc;
const { escapeHtml } = MarkdownIt().utils;
class Node {
  node;
  tag;
  props;
  children;
  components;
  constructor(n, components2) {
    if (!n) {
      throw new Error("Missing arg: n");
    }
    this.node = n;
    this.components = components2;
    let children = this.node?.children;
    if (typeof this.node === "string" || typeof this.node === "number") {
      children = escapeHtml(String(this.node));
    } else if (this.node === null || typeof this.node !== "object" || !MarkdocTag.isTag(this.node)) {
      children = "";
    }
    this.children = children;
    let tag = this.node?.name;
    let props = this.node?.attributes;
    if (typeof this.node?.name === "string" && typeof components2 === "object" && Object.hasOwn(components2, this.node?.name)) {
      tag = components2[this.node?.name].Component;
      props = {
        ...props,
        ...components2[this.node?.name].props,
        children: this.children
      };
    } else if (typeof this.node?.name === "string") {
      tag = this.node?.name;
      props = { ...this.node?.attributes };
    }
    this.tag = tag;
    this.props = props;
  }
  validateElement() {
    if (typeof this.node?.name === "string" && this.node.name.charAt(0).toLowerCase() !== this.node.name.charAt(0) && typeof components === "object" && !Object.hasOwn(this.components, this.node.name)) {
      throw new Error(`No renderer provided for element: ${this.node.name}`);
    }
  }
  hasChildren() {
    return Array.isArray(this.node?.children);
  }
  shouldRenderChildren() {
    return !Array.isArray(this.node) && (typeof this.node === "string" || typeof this.node === "number" || this.node === null || typeof this.node !== "object" || !MarkdocTag.isTag(this.node));
  }
  shouldRenderSelf() {
    return Array.isArray(this.node);
  }
  shouldRenderTag() {
    return !!this.tag;
  }
}

function addAstro(Prism) {
  if (Prism.languages.astro) {
    return;
  }
  let scriptLang;
  if (Prism.languages.typescript) {
    scriptLang = "typescript";
  } else {
    scriptLang = "javascript";
    console.warn(
      "Prism TypeScript language not loaded, Astro scripts will be treated as JavaScript."
    );
  }
  let script = Prism.util.clone(Prism.languages[scriptLang]);
  let space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
  let braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
  let spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;
  function re(source, flags) {
    source = source.replace(/<S>/g, function() {
      return space;
    }).replace(/<BRACES>/g, function() {
      return braces;
    }).replace(/<SPREAD>/g, function() {
      return spread;
    });
    return RegExp(source, flags);
  }
  spread = re(spread).source;
  Prism.languages.astro = Prism.languages.extend("markup", script);
  Prism.languages.astro.tag.pattern = re(
    /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[^]|[^\\"])*"|'(?:\\[^]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source
  );
  Prism.languages.astro.tag.inside["tag"].pattern = /^<\/?[^\s>\/]*/i;
  Prism.languages.astro.tag.inside["attr-value"].pattern = /=(?!\{)(?:"(?:\\[^]|[^\\"])*"|'(?:\\[^]|[^\\'])*'|[^\s'">]+)/i;
  Prism.languages.astro.tag.inside["tag"].inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  Prism.languages.astro.tag.inside["comment"] = script["comment"];
  Prism.languages.insertBefore(
    "inside",
    "attr-name",
    {
      spread: {
        pattern: re(/<SPREAD>/.source),
        inside: Prism.languages.astro
      }
    },
    Prism.languages.astro.tag
  );
  Prism.languages.insertBefore(
    "inside",
    "special-attr",
    {
      script: {
        pattern: re(/=<BRACES>/.source),
        inside: {
          "script-punctuation": {
            pattern: /^=(?={)/,
            alias: "punctuation"
          },
          rest: Prism.languages.astro
        },
        alias: `language-${scriptLang}`
      }
    },
    Prism.languages.astro.tag
  );
  let stringifyToken = function(token) {
    if (!token) {
      return "";
    }
    if (typeof token === "string") {
      return token;
    }
    if (typeof token.content === "string") {
      return token.content;
    }
    return token.content.map(stringifyToken).join("");
  };
  let walkTokens = function(tokens) {
    let openedTags = [];
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      if (token.type === "style") {
        return;
      }
      let notTagNorBrace = false;
      if (typeof token !== "string") {
        if (token.type === "tag" && token.content[0] && token.content[0].type === "tag") {
          if (token.content[0].content[0].content === "</") {
            if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
              openedTags.pop();
            }
          } else {
            if (token.content[token.content.length - 1].content === "/>") ; else {
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0
              });
            }
          }
        } else if (openedTags.length > 0 && token.type === "punctuation" && token.content === "{") {
          openedTags[openedTags.length - 1].openedBraces++;
        } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === "punctuation" && token.content === "}") {
          openedTags[openedTags.length - 1].openedBraces--;
        } else {
          notTagNorBrace = true;
        }
      }
      if (notTagNorBrace || typeof token === "string") {
        if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
          let plainText = stringifyToken(token);
          if (i < tokens.length - 1 && (typeof tokens[i + 1] === "string" || tokens[i + 1].type === "plain-text")) {
            plainText += stringifyToken(tokens[i + 1]);
            tokens.splice(i + 1, 1);
          }
          if (i > 0 && (typeof tokens[i - 1] === "string" || tokens[i - 1].type === "plain-text")) {
            plainText = stringifyToken(tokens[i - 1]) + plainText;
            tokens.splice(i - 1, 1);
            i--;
          }
          tokens[i] = new Prism.Token("plain-text", plainText, void 0, plainText);
        }
      }
      if (token.content && typeof token.content !== "string") {
        walkTokens(token.content);
      }
    }
  };
  Prism.hooks.add("after-tokenize", function(env) {
    if (env.language !== "astro") {
      return;
    }
    walkTokens(env.tokens);
  });
}

const languageMap = /* @__PURE__ */ new Map([["ts", "typescript"]]);
function runHighlighterWithAstro(lang, code) {
  if (!lang) {
    lang = "plaintext";
  }
  let classLanguage = `language-${lang}`;
  const ensureLoaded = (language) => {
    if (language && !Prism.languages[language]) {
      loadLanguages([language]);
    }
  };
  if (languageMap.has(lang)) {
    ensureLoaded(languageMap.get(lang));
  } else if (lang === "astro") {
    ensureLoaded("typescript");
    addAstro(Prism);
  } else {
    ensureLoaded("markup-templating");
    ensureLoaded(lang);
  }
  if (lang && !Prism.languages[lang]) {
    console.warn(`Unable to load the language: ${lang}`);
  }
  const grammar = Prism.languages[lang];
  let html = code;
  if (grammar) {
    html = Prism.highlight(code, grammar, lang);
  }
  return { classLanguage, html };
}

const $$Astro$e = createAstro("/data/data/com.termux/files/home/blog/node_modules/@astrojs/prism/Prism.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Prism = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Prism;
  const { class: className, lang, code } = Astro2.props;
  const { classLanguage, html } = runHighlighterWithAstro(lang, code);
  return renderTemplate`${maybeRenderHead($$result)}<pre${addAttribute([className, classLanguage].filter(Boolean).join(" "), "class")}><code${addAttribute(classLanguage, "class")}>${unescapeHTML(html)}</code></pre>`;
}, "/data/data/com.termux/files/home/blog/node_modules/@astrojs/prism/Prism.astro");

const $$Astro$d = createAstro("/data/data/com.termux/files/home/blog/node_modules/astro-markdoc-renderer/src/CodeBlock.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$CodeBlock$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$CodeBlock$1;
  const { language, content } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Prism", $$Prism, { "lang": language, "code": content })}

`;
}, "/data/data/com.termux/files/home/blog/node_modules/astro-markdoc-renderer/src/CodeBlock.astro");

const $$Astro$c = createAstro("/data/data/com.termux/files/home/blog/node_modules/astro-markdoc-renderer/src/Code.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Code = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Code;
  return renderTemplate`${maybeRenderHead($$result)}<code>${renderSlot($$result, $$slots["default"])}</code>`;
}, "/data/data/com.termux/files/home/blog/node_modules/astro-markdoc-renderer/src/Code.astro");

const $$Astro$b = createAstro("/data/data/com.termux/files/home/blog/node_modules/astro-markdoc-renderer/src/MarkdocRenderer.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$MarkdocRenderer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$MarkdocRenderer;
  const { content, components: customComponents } = Astro2.props;
  const defaultComponents = {
    CodeBlock: {
      Component: $$CodeBlock$1,
      props: {}
    },
    code: {
      Component: $$Code,
      props: {}
    }
  };
  const components = { ...defaultComponents, ...customComponents };
  if (!content) {
    throw new Error("Missing prop: content");
  }
  const node = new Node(content, components);
  node.validateElement();
  const Tag = node.tag;
  const props = node.props;
  const children = node.children;
  return renderTemplate`${node.shouldRenderChildren() ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(children)}` })}` : node.shouldRenderSelf() ? content.map((element) => {
    return renderTemplate`${renderComponent($$result, "Astro.self", Astro2.self, { "content": element, "components": components })}`;
  }) : node.shouldRenderTag() ? renderTemplate`${renderComponent($$result, "Tag", Tag, { ...props }, { "default": () => renderTemplate`${node.hasChildren() ? renderTemplate`${renderComponent($$result, "Astro.self", Astro2.self, { "content": children, "components": components })}` : null}` })}` : null}`;
}, "/data/data/com.termux/files/home/blog/node_modules/astro-markdoc-renderer/src/MarkdocRenderer.astro");

const $$Astro$a = createAstro("/data/data/com.termux/files/home/blog/src/components/YouTubeEmbed.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$YouTubeEmbed = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$YouTubeEmbed;
  const { url, label } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div class="astro-GBL3X3HK">
  <iframe class="youtube-iframe astro-GBL3X3HK"${addAttribute(url, "src")}${addAttribute(label, "title")} frame-border="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
  </iframe>
</div>

`;
}, "/data/data/com.termux/files/home/blog/src/components/YouTubeEmbed.astro");

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$9 = createAstro("/data/data/com.termux/files/home/blog/src/components/TweetEmbed.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$TweetEmbed = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$TweetEmbed;
  const { url } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<!-- \n    Even though minimal theme is built with zero javascript,\n    if your blog post uses embed elements, the iframe will need to \n    be setup with javascript. It can't be done without javascript.\n-->", '<div class="twitter-embed-wrapper astro-2FB7VOFP">\n  <blockquote class="unset twitter-tweet astro-2FB7VOFP" data-conversation="none" data-theme="light" data-lang="en" data-dnt="true">\n    <a class="unset embed-replacable-link astro-2FB7VOFP"', '>Loading embedded tweet...</a>\n  </blockquote>\n</div>\n\n<script async defer src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>\n'])), maybeRenderHead($$result), addAttribute(url, "href"));
}, "/data/data/com.termux/files/home/blog/src/components/TweetEmbed.astro");

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$8 = createAstro("/data/data/com.termux/files/home/blog/src/components/CodePenEmbed.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$CodePenEmbed = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$CodePenEmbed;
  const { url, title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["<!-- \n    Even though minimal theme is built with zero javascript,\n    if your blog post uses embed elements, the iframe will need to \n    be setup with javascript. It can't be done without javascript.\n-->", '<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="eYJqjgq" data-user="ruphaa" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">\n  <span><a', ">", '</a></span>\n</p>\n<script async defer src="https://cpwebassets.codepen.io/assets/embed/ei.js"><\/script>'])), maybeRenderHead($$result), addAttribute(url, "href"), title);
}, "/data/data/com.termux/files/home/blog/src/components/CodePenEmbed.astro");

const $$Astro$7 = createAstro("/data/data/com.termux/files/home/blog/src/components/GitHubGistEmbed.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$GitHubGistEmbed = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$GitHubGistEmbed;
  const { id } = Astro2.props;
  return renderTemplate`<!-- 
    Even though minimal theme is built with zero javascript,
    if your blog post uses embed elements, the iframe will need to 
    be setup with javascript. It can't be done without javascript.
-->${maybeRenderHead($$result)}<iframe class="gist-iframe" width="100%" style="border:0;"${addAttribute(`gist-${id}`, "id")}${addAttribute(id, "data-id")}></iframe>
${maybeRenderHead($$result)}`;
}, "/data/data/com.termux/files/home/blog/src/components/GitHubGistEmbed.astro");

const $$Astro$6 = createAstro("/data/data/com.termux/files/home/blog/src/components/CodeBlock.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$CodeBlock = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$CodeBlock;
  const { language, content } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Prism", $$Prism, { "lang": language, "code": content })}

`;
}, "/data/data/com.termux/files/home/blog/src/components/CodeBlock.astro");

const $$Astro$5 = createAstro("/data/data/com.termux/files/home/blog/src/components/Heading.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Heading = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Heading;
  const { level, children } = Astro2.props;
  let Tag = "h1";
  if (level === 2) {
    Tag = "h2";
  } else if (level === 3) {
    Tag = "h3";
  } else if (level === 4) {
    Tag = "h4";
  } else if (level === 5) {
    Tag = "h5";
  } else if (level === 6) {
    Tag = "h6";
  }
  return renderTemplate`${renderComponent($$result, "Tag", Tag, {}, { "default": () => renderTemplate`${children}` })}`;
}, "/data/data/com.termux/files/home/blog/src/components/Heading.astro");

const $$Astro$4 = createAstro("/data/data/com.termux/files/home/blog/src/components/Renderer.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Renderer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Renderer;
  const { content } = Astro2.props;
  const components = {
    Heading: {
      Component: $$Heading,
      props: {}
    },
    CodeBlock: {
      Component: $$CodeBlock,
      props: {}
    },
    YouTubeEmbed: {
      Component: $$YouTubeEmbed,
      props: {}
    },
    TweetEmbed: {
      Component: $$TweetEmbed,
      props: {}
    },
    CodePenEmbed: {
      Component: $$CodePenEmbed,
      props: {}
    },
    GitHubGistEmbed: {
      Component: $$GitHubGistEmbed,
      props: {}
    }
  };
  return renderTemplate`${renderComponent($$result, "MarkdocRenderer", $$MarkdocRenderer, { "content": content, "components": components })}`;
}, "/data/data/com.termux/files/home/blog/src/components/Renderer.astro");

const $$Astro$3 = createAstro("/data/data/com.termux/files/home/blog/src/components/BlogPostMeta.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$BlogPostMeta = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$BlogPostMeta;
  const {
    title,
    description,
    publishDate,
    pagePath,
    ogImageAbsoluteUrl,
    ogImageAltText,
    ogImageWidth,
    ogImageHeight
  } = Astro2.props;
  const { meta, og, twitter } = getBlogPostMeta({
    title: title || SITE_TITLE,
    description: description || SITE_DESCRIPTION,
    pageUrl: pagePath ? new URL(pagePath, SITE_URL).toString() : void 0,
    authorName: MY_NAME,
    publishDate,
    ogImageAbsoluteUrl,
    ogImageAltText,
    ogImageWidth,
    ogImageHeight,
    siteOwnerTwitterHandle: TWITTER_HANDLE,
    contentAuthorTwitterHandle: TWITTER_HANDLE
  });
  return renderTemplate`<!-- Primary Meta Tags --><title>${meta.title}</title>
<meta name="title"${addAttribute(meta.title, "content")}>
${meta.description && renderTemplate`<meta name="description"${addAttribute(meta.description, "content")}>`}
${meta.canonicalUrl && renderTemplate`<link rel="canonical"${addAttribute(meta.canonicalUrl, "href")}>`}

<!-- Open Graph / Facebook -->
${og.title && renderTemplate`<meta property="og:title"${addAttribute(og.title, "content")}>`}
${og.description && renderTemplate`<meta property="og:description"${addAttribute(og.description, "content")}>`}
${og.type && renderTemplate`<meta property="og:type"${addAttribute(og.type, "content")}>`}
${og.url && renderTemplate`<meta property="og:url"${addAttribute(og.url, "content")}>`}
${og.author && renderTemplate`<meta property="article:author"${addAttribute(og.author, "content")}>`}
${og.publishDate && renderTemplate`<meta property="article:published_time"${addAttribute(og.publishDate, "content")}>`}
${og.image && renderTemplate`<meta property="og:image"${addAttribute(og.image, "content")}>`}
${og.imageAlt && renderTemplate`<meta property="og:image:alt"${addAttribute(og.imageAlt, "content")}>`}
${og.imageWidth && renderTemplate`<meta property="og:image:width"${addAttribute(og.imageWidth, "content")}>`}
${og.imageHeight && renderTemplate`<meta property="og:image:height"${addAttribute(og.imageHeight, "content")}>`}

<!-- Twitter -->
${twitter.title && renderTemplate`<meta property="twitter:title"${addAttribute(twitter.title, "content")}>`}
${twitter.description && renderTemplate`<meta property="twitter:description"${addAttribute(twitter.description, "content")}>`}
${twitter.site && renderTemplate`<meta property="twitter:site"${addAttribute(twitter.site, "content")}>`}
${twitter.creator && renderTemplate`<meta property="twitter:creator"${addAttribute(twitter.creator, "content")}>`}
<meta property="twitter:card" content="summary_large_image">
${twitter.image && renderTemplate`<meta property="twitter:image"${addAttribute(twitter.image, "content")}>`}
${twitter.imageAlt && renderTemplate`<meta property="twitter:image:alt"${addAttribute(twitter.imageAlt, "content")}>`}
<!-- {twitter.url && <meta property="twitter:url" content={twitter.url} />} -->
`;
}, "/data/data/com.termux/files/home/blog/src/components/BlogPostMeta.astro");

const $$Astro$2 = createAstro("/data/data/com.termux/files/home/blog/src/layouts/ContentLayout.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$ContentLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ContentLayout;
  const { title, date } = Astro2.props;
  const formattedDate = new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return renderTemplate`<html class="theme-sleek astro-5YW4CPNN" lang="en">
  <head>
    <!-- Global Metadata -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="generator" content="Blogster">
    ${renderComponent($$result, "Favicon", $$Favicon, { "class": "astro-5YW4CPNN" })}
    ${renderSlot($$result, $$slots["meta"])}
  ${renderHead($$result)}</head>

  <body class="text-text-body bg-bg-body max-w-3xl mx-auto px-4 sm:px-8 astro-5YW4CPNN">
    ${renderComponent($$result, "Header", $$Header, { "class": "astro-5YW4CPNN" })}
    <main id="main" class="astro-5YW4CPNN">
      <section class="blog-post astro-5YW4CPNN">
        <h1 class="title astro-5YW4CPNN">${title}</h1>
        <time class="publish-date astro-5YW4CPNN">${formattedDate}</time>
        ${renderSlot($$result, $$slots["content"])}
      </section>
    </main>
    ${renderComponent($$result, "Footer", $$Footer, { "class": "astro-5YW4CPNN" })}
  
</body>


</html>`;
}, "/data/data/com.termux/files/home/blog/src/layouts/ContentLayout.astro");

const $$Astro$1 = createAstro("/data/data/com.termux/files/home/blog/src/pages/blog/[slug].astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
async function getStaticPaths() {
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog
  });
  const filteredPosts = posts.filter((p) => p.frontmatter.draft !== true).filter(({ frontmatter }) => !frontmatter.external);
  return filteredPosts.map((post) => {
    return { params: { slug: post.slug } };
  });
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (typeof slug !== "string") {
    throw Error(`slug should be string. Received: ${slug}`);
  }
  const { content, frontmatter } = await readOne({
    directory: "blog",
    slug,
    frontmatterSchema: blog
  });
  const ogImageAbsoluteUrl = frontmatter.external !== true && frontmatter.ogImagePath ? new URL(frontmatter.ogImagePath, SITE_URL).toString() : void 0;
  return renderTemplate`${renderComponent($$result, "ContentLayout", $$ContentLayout, { "title": frontmatter.title, "date": frontmatter.date }, { "content": () => renderTemplate`${renderComponent($$result, "Renderer", $$Renderer, { "content": content, "slot": "content" })}`, "meta": () => renderTemplate`${renderComponent($$result, "BlogPostMeta", $$BlogPostMeta, { "title": frontmatter.title, "description": frontmatter.external ? void 0 : frontmatter.description, "publishDate": frontmatter.date.toISOString(), "pagePath": `/blog/${slug}`, "ogImageAbsoluteUrl": ogImageAbsoluteUrl, "slot": "meta" })}` })}`;
}, "/data/data/com.termux/files/home/blog/src/pages/blog/[slug].astro");

const $$file$1 = "/data/data/com.termux/files/home/blog/src/pages/blog/[slug].astro";
const $$url$1 = "/blog/[slug]";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getStaticPaths,
  default: $$slug,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("/data/data/com.termux/files/home/blog/src/pages/blog.astro", "https://natesworks.com/", "file:///data/data/com.termux/files/home/blog/");
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Blog;
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog
  });
  const sortedPosts = posts.filter((p) => p.frontmatter.draft !== true).sort(
    (a, b) => new Date(b.frontmatter.date).valueOf() - new Date(a.frontmatter.date).valueOf()
  );
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "class": "astro-BASYXGFS" }, { "main": () => renderTemplate`${maybeRenderHead($$result)}<section class="astro-BASYXGFS">
    <ul class="astro-BASYXGFS">
      ${sortedPosts.map((post) => {
    const formattedDate = new Date(
      post.frontmatter.date
    ).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    return renderTemplate`<li class="post astro-BASYXGFS">
              <div class="title astro-BASYXGFS">
                ${post.frontmatter.external ? renderTemplate`<a${addAttribute(post.frontmatter.url, "href")} target="_blank" class="astro-BASYXGFS">
                    <span class="astro-BASYXGFS">${post.frontmatter.title}</span>
                    ${renderComponent($$result, "ExternalLinkIcon", $$ExternalLink, { "class": "icon-realign astro-BASYXGFS", "title": "Link to external post", "height": 16, "width": 16 })}
                  </a>` : renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} class="astro-BASYXGFS">${post.frontmatter.title}</a>`}
              </div>
              <div class="publish-date astro-BASYXGFS">
                <time${addAttribute(post.frontmatter.date.toISOString(), "datetime")} class="astro-BASYXGFS">
                  ${formattedDate}
                </time>
              </div>
            </li>`;
  })}
    </ul>
  </section>`, "meta": () => renderTemplate`${renderComponent($$result, "PageMeta", $$PageMeta, { "title": `Blog | ${SITE_TITLE}`, "slot": "meta", "class": "astro-BASYXGFS" })}` })}

`;
}, "/data/data/com.termux/files/home/blog/src/pages/blog.astro");

const $$file = "/data/data/com.termux/files/home/blog/src/pages/blog.astro";
const $$url = "/blog";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([["src/pages/index.astro", _page0],["src/pages/projects.astro", _page1],["src/pages/rss.xml.ts", _page2],["src/pages/blog/[slug].astro", _page3],["src/pages/blog.astro", _page4],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),];

export { pageMap, renderers };
