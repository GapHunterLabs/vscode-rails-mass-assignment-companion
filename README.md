# Rails Mass Assignment Companion (VS Code)

Flags `params.permit!` — disables Rails strong parameters entirely,
the textbook mass-assignment anti-pattern. No data leaves your editor.

**v0.1, pilot.** Part of the Gap Hunter Labs VS Code workstream,
ported from the IntelliJ-family `rails-mass-assignment-companion`.
No dedicated VS Code equivalent found (Brakeman covers this as a
Ruby gem/CLI tool, not a live VS Code extension).

## What it does

Flags `params.permit!` (or `.permit!` on any `_params` receiver, e.g.
`user_params.permit!`) live, as you edit any `.rb` file. Rails' own
docs: *"Extreme care should be taken when using permit!, as it will
allow all current and future model attributes to be mass-assigned"* —
the well-known real-world case is a `role`/`admin` boolean flipped via
mass assignment because the whitelist was disabled entirely.

**v0.1 scope, honestly noted:** plain-text regex matching, not real
Ruby/Rails parsing — doesn't resolve whether the receiver is actually
an `ActionController::Parameters` instance, so an unrelated custom
`.permit!` method on some other object is a possible (rare) false
positive.

## Privacy

See [PRIVACY.md](PRIVACY.md) — zero network calls, everything runs
against files already open in your editor.

## Development

```bash
npm install
npm run compile   # or: npm run watch
npm test
```

To build an installable package without publishing:

```bash
npx @vscode/vsce package
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).
