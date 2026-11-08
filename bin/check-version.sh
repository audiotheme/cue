#!/usr/bin/env bash
#
# Check that a release version matches everywhere WordPress.org and the build
# read it from.
#
# Usage: bin/check-version.sh [version]
# Defaults to the version in package.json.

set -euo pipefail

cd "$(dirname "$0")/.."

PACKAGE_VERSION=$(node -p "require('./package.json').version")
VERSION="${1:-$PACKAGE_VERSION}"
VERSION="${VERSION#v}"

HEADER_VERSION=$(sed -nE 's/^[[:space:]]*\*[[:space:]]*Version:[[:space:]]*([^[:space:]]+).*/\1/p' cue.php | head -n 1)
CONSTANT_VERSION=$(sed -nE "s/^define\( 'CUE_VERSION', '([^']+)' \);.*/\1/p" cue.php | head -n 1)
STABLE_TAG=$(sed -nE 's/^Stable tag:[[:space:]]*([^[:space:]]+).*/\1/p' readme.txt | head -n 1)

errors=0

check() {
	local label=$1 actual=$2
	if [[ "$actual" == "$VERSION" ]]; then
		echo "ok    $label: $actual"
	else
		echo "FAIL  $label: ${actual:-(missing)}, expected $VERSION"
		errors=$((errors + 1))
	fi
}

echo "Checking version $VERSION"
check "package.json version" "$PACKAGE_VERSION"
check "cue.php Version header" "$HEADER_VERSION"
check "cue.php CUE_VERSION" "$CONSTANT_VERSION"
check "readme.txt Stable tag" "$STABLE_TAG"

if grep -qE "^### ${VERSION//./\\.}( |$)" readme.txt; then
	echo "ok    readme.txt changelog entry"
else
	echo "FAIL  readme.txt changelog entry: no '### $VERSION' heading"
	errors=$((errors + 1))
fi

if (( errors > 0 )); then
	echo "Version check failed with $errors error(s)."
	exit 1
fi
