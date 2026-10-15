// Fast, staged-files-only checks. Type checking, tests and E2E run in CI (and via `pnpm check`).
const config = {
  '*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}': ['eslint --fix --no-warn-ignored', 'prettier --write'],
  '*.{json,css,md,yml,yaml}': ['prettier --write'],
}

export default config
