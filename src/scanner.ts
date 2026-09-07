/**
 * Pure text scanner -- no `vscode` dependency. Ported from the
 * IntelliJ-family rails-mass-assignment-companion's PermitBangScanner
 * (already regex-only, zero PSI dependency).
 *
 * Flags `params.permit!` (or `.permit!` on any `_params` receiver,
 * e.g. `user_params.permit!`) -- Rails' own docs: "Extreme care
 * should be taken when using permit!, as it will allow all current
 * and future model attributes to be mass-assigned". The exact
 * anti-pattern strong parameters exist to prevent.
 *
 * v0.1 scope, honestly noted: plain-text regex matching, not real
 * Ruby/Rails parsing -- doesn't resolve whether the receiver is
 * actually an ActionController::Parameters instance, so an unrelated
 * custom `.permit!` method on some other object is a possible (rare)
 * false positive.
 */

export interface Hit {
  line: number; // 1-based
}

const PERMIT_BANG = /(\bparams|\w*_params)\s*\.\s*permit!/;

export function scan(text: string): Hit[] {
  const hits: Hit[] = [];
  text.split('\n').forEach((rawLine, index) => {
    if (rawLine.trimStart().startsWith('#')) return;
    if (PERMIT_BANG.test(rawLine)) hits.push({ line: index + 1 });
  });
  return hits;
}
