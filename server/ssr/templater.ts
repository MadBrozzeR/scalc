import fs from 'node:fs/promises';
import path from 'node:path';
import { STATIC_ROOT } from '../constants';

const KEY_RE = /\{(\w+)\}/g;

type Subs = Record<string, string>;

export async function template (file: string) {
  const html = await fs.readFile(path.resolve(STATIC_ROOT, 'components', file)).then(String);

  function apply (substitutions?: Subs | Subs[]): string {
    if (!substitutions) {
      return html;
    }

    if (substitutions instanceof Array) {
      return substitutions.map((item) => apply(item)).join('');
    }

    return html.replace(KEY_RE, (original, key) => substitutions[key] || original);
  }

  return apply;
}
