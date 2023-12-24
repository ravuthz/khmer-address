# Create new project with bun

```bash

mkdir khmer-address
cd khmer-address
bun init -y
git init && git add . && git commit -m "Init bun package"

```

# Add dependencies

```bash

bun add rimraf prettier js-yaml uglify-js
bun add --dev @types/js-yaml
bun add -D tsup typescript

```

# Publish to npm

```bash

npm version

npm login

npm version patch

npm publish --access public

```
