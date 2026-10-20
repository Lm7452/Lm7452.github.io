#!/bin/sh
# Installs a pre-commit hook that refreshes the asset versions in index.html.
# Git does not copy hooks when cloning, so run this once per checkout.
cd "$(git rev-parse --show-toplevel)" || exit 1
cat > .git/hooks/pre-commit <<'EOF'
#!/bin/sh
node tools/version-assets.mjs || exit 1
git add index.html
EOF
chmod +x .git/hooks/pre-commit
echo "pre-commit hook installed"
