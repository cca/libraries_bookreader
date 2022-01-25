#!/usr/bin/env bash
npm run build
rm bookreader.zip
cd dist
zip -r ../bookreader.zip .
open "https://vault.cca.edu/logon.do?page=items/79e553bc-a84c-4610-b6d7-190a90dbb268/0/"
