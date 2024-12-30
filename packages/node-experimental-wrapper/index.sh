#!/usr/bin/env sh
printf "@tally/node-experimental-wrapper is wrapping node with experimental flags.\n\n"
node_path="${npm_node_execpath:-$(which node)}"

exec "${node_path}" --disable-warning=ExperimentalWarning \
                    --experimental-strip-types \
                    --experimental-require-module \
                    "$@"
