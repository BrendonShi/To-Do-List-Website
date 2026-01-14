#!/bin/bash

# Change directory to the location of this script
cd "$(dirname "$0")"

echo "Setting up Python virtual environment..."

# 1. Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed."
    exit 1
fi

# 2. Create the virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating .venv..."
    python3 -m venv .venv
else
    echo ".venv already exists."
fi

# 3. Activate the virtual environment
source .venv/bin/activate

# 4. Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# 5. Install requirements
if [ -f "requirements.txt" ]; then
    echo "Installing requirements..."
    pip install -r requirements.txt
else
    echo "requirements.txt not found. Skipping library installation."
fi

echo ""
echo "Setup complete!"