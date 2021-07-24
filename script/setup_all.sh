#!/bin/bash -eu

echo '==================='
echo '=== app/mix.exs ==='
echo '==================='
echo

(
  cd app
  mix deps.get
)

echo
echo '==============================='
echo '=== app/assets/package.json ==='
echo '==============================='

npm install --prefix app/assets

echo
echo '============================='
echo '=== contract/package.json ==='
echo '============================='

npm install --prefix contract
