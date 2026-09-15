import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { chartForms } from '../lib/chart-forms';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const examples = new Map<string, string>();
for (const form of chartForms) {
  form.examples.forEach((example, index) => {
    assert(example.code.includes(`import { ${form.exportName} } from '@/components/ui/${form.file}';`));
    assert(!example.code.includes('<Chart.'), `${form.slug}: standalone example uses the namespace`);
    examples.set(path.join(root, 'apps/www', `${form.slug}-example-${index}.tsx`), example.code);
  });
}

const options: ts.CompilerOptions = {
  strict: true,
  noEmit: true,
  noUnusedLocals: true,
  skipLibCheck: true,
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  baseUrl: root,
  paths: { '@/components/ui/chart/*': ['packages/registry/src/components/chart/*'] },
};
// Virtual files exercise the published examples against the real component types.
const host = ts.createCompilerHost(options);
const readFile = host.readFile.bind(host);
const fileExists = host.fileExists.bind(host);
host.readFile = (file) => examples.get(file) ?? readFile(file);
host.fileExists = (file) => examples.has(file) || fileExists(file);
const program = ts.createProgram([...examples.keys()], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program).filter((diagnostic) =>
  !diagnostic.file || examples.has(diagnostic.file.fileName),
);
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }));
  process.exitCode = 1;
} else {
  console.log(`Checked ${examples.size} standalone chart examples.`);
}
