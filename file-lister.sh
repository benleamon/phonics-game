#!/bin/bash

# Set the name of the subdirectory containing the images
subdir="img"

# Get the path to the subdirectory
dir="$(pwd)/$subdir"

# List all files in the directory and save the output to a temporary file
ls -1 "$dir" > /tmp/files.txt

# Use jq to convert the list of files to a JSON array and save it to a file
jq -Rs '[split("\n") | select(. != "")]' /tmp/files.txt > files.json

# Remove the temporary file
rm /tmp/files.txt

# Print a message indicating success
echo "List of files saved to files.json"
