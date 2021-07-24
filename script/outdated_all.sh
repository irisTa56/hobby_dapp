#!/bin/bash -eu

echo '==================='
echo '=== app/mix.exs ==='
echo '==================='
echo

(
  cd app
  mix hex.outdated
)

echo
echo '==============================='
echo '=== app/assets/package.json ==='
echo '==============================='
echo

npm outdated --prefix app/assets

echo
echo '============================='
echo '=== contract/package.json ==='
echo '============================='
echo

npm outdated --prefix contract
