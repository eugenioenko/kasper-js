import { transformWithEsbuild } from "vite";
function parseBlocks(source) {
    const templateMatch = source.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = source.match(/<script>([\s\S]*?)<\/script>/);
    const styleMatch = source.match(/<style>([\s\S]*?)<\/style>/);
    return {
        template: templateMatch ? templateMatch[1].trim() : "",
        script: scriptMatch ? scriptMatch[1].trim() : "",
        style: styleMatch ? styleMatch[1].trim() : "",
    };
}
function extractClassName(script) {
    const match = script.match(/export\s+class\s+(\w+)/);
    return match ? match[1] : null;
}
function extractImports(script) {
    const names = [];
    // named: import { X, Y as Z } from '...'
    const namedRe = /import\s*\{([^}]+)\}\s*from/g;
    let match;
    while ((match = namedRe.exec(script)) !== null) {
        for (const item of match[1].split(",")) {
            const parts = item.trim().split(/\s+as\s+/);
            const name = parts[parts.length - 1].trim();
            if (name)
                names.push(name);
        }
    }
    // default: import X from '...'
    const defaultRe = /import\s+(\w+)\s+from/g;
    while ((match = defaultRe.exec(script)) !== null) {
        names.push(match[1]);
    }
    // namespace: import * as X from '...'
    const namespaceRe = /import\s*\*\s*as\s+(\w+)\s+from/g;
    while ((match = namespaceRe.exec(script)) !== null) {
        names.push(match[1]);
    }
    return [...new Set(names)];
}
function transformKasper(source, id) {
    const { template, script, style } = parseBlocks(source);
    const className = extractClassName(script);
    if (!className) {
        throw new Error(`[vite-plugin-kasper] No exported class found in ${id}`);
    }
    const parts = [];
    if (style) {
        parts.push(`
(function() {
  if (typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-kasper', '${className}');
  style.textContent = ${JSON.stringify(style)};
  document.head.appendChild(style);
})();`);
    }
    parts.push(script);
    parts.push(`${className}.template = ${JSON.stringify(template)};`);
    const imports = extractImports(script);
    if (imports.length > 0) {
        parts.push(`${className}.$imports = { ${imports.join(", ")} };`);
    }
    return parts.join("\n\n");
}
export default function kasper() {
    return {
        name: "vite-plugin-kasper",
        async transform(source, id) {
            if (!id.endsWith(".kasper"))
                return;
            const code = transformKasper(source, id);
            return transformWithEsbuild(code, id.replace(".kasper", ".ts"), {
                loader: "ts",
            });
        },
    };
}
