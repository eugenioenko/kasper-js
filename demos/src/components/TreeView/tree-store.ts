import { signal } from 'kasper-js';

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

export const selectedNode = signal<TreeNode | null>(null);

export const treeData: TreeNode[] = [
  {
    id: 'kasper-js',
    name: 'kasper-js',
    type: 'folder',
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        children: [
          { id: 'transpiler', name: 'transpiler.ts', type: 'file' },
          { id: 'component', name: 'component.ts', type: 'file' },
          { id: 'signal', name: 'signal.ts', type: 'file' },
          { id: 'scheduler', name: 'scheduler.ts', type: 'file' },
          { id: 'boundary', name: 'boundary.ts', type: 'file' },
          { id: 'router', name: 'router.ts', type: 'file' },
          {
            id: 'parser',
            name: 'parser',
            type: 'folder',
            children: [
              { id: 'template-parser', name: 'template-parser.ts', type: 'file' },
              { id: 'expression-parser', name: 'expression-parser.ts', type: 'file' },
              { id: 'scanner', name: 'scanner.ts', type: 'file' },
            ]
          },
        ]
      },
      {
        id: 'demos',
        name: 'demos',
        type: 'folder',
        children: [
          {
            id: 'demos-src',
            name: 'src',
            type: 'folder',
            children: [
              { id: 'app-kasper', name: 'App.kasper', type: 'file' },
              { id: 'main-ts', name: 'main.ts', type: 'file' },
            ]
          },
          { id: 'demos-index', name: 'index.html', type: 'file' },
          { id: 'demos-pkg', name: 'package.json', type: 'file' },
        ]
      },
      {
        id: 'spec',
        name: 'spec',
        type: 'folder',
        children: [
          { id: 'transpiler-spec', name: 'transpiler.spec.ts', type: 'file' },
          { id: 'edge-cases-spec', name: 'edge-cases.spec.ts', type: 'file' },
          { id: 'signal-spec', name: 'signal.spec.ts', type: 'file' },
          { id: 'boundary-spec', name: 'boundary.spec.ts', type: 'file' },
        ]
      },
      { id: 'readme', name: 'README.md', type: 'file' },
      { id: 'pkg', name: 'package.json', type: 'file' },
      { id: 'tsconfig', name: 'tsconfig.json', type: 'file' },
    ]
  }
];
