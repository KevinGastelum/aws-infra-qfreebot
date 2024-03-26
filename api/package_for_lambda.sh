#!/bin/bash

# Exit if any command fails
set -eux -o pipefail

pip install -t lib -r requirements.txt
rm -f lambda_function.zip
(cd lib; zip ../lambda_function.zip -r .)
zip -u lambda_function.zip todo.py

# Clean up
rm -rf lib


