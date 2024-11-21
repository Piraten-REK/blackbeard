#!/bin/bash

if [ ! -f 'lastImport.json' ]; then
  echo 'Creating lastImport.json …'
  echo '{}' > lastImport.json
else
  echo 'Skipping creation of lastImport.json'
fi

if [ ! -f 'config.json' ]; then
  echo 'Creating config.json …'
  echo '{}' > config.json
else
  echo 'Skipping creation of config.json'
fi

echo

node dist/app.js
