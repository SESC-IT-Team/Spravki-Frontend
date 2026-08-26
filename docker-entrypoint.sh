#!/bin/sh
set -eu

node > /app/dist/env.js <<'EOF'
const runtimeEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith('VITE_')),
)

process.stdout.write(`window.__ENV__ = ${JSON.stringify(runtimeEnv)};`)
EOF

exec "$@"