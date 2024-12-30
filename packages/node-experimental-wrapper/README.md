# @tally/node-experimental-wrapper

**Warning: This relies on `sh` and thus is only supported in Linux-like OSes.**

This package wraps node package binaries with experimental flags. This way, when
you are running your app binaries installed via npm, they will automatically run
in a node environment with these experimental flags enabled.

## How it works

When you install a package that includes a binary, a shell script is generated
by npm, pnpm, whatever, that executes that binary. An interesting trait of this
script is that it looks for a `node` script in the same directory as it resides
and will use that instead of a global `node` binary if found.

This package installs such a `node` script, effectively wrapping the system node
with experimental flags.

## Usage

Install the package and that's it.

```shell
pnpm add -D @tally/node-experimental-wrapper
```

## Which Flags?

The flags that are currently enabled are:

- `--experimental-strip-types`
- `--experimental-require-module`

These flags are required by `@tally/typedconfig` so we want them enabled in any
app that uses it.
