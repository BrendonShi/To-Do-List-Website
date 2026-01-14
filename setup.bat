@echo off
echo Setting up Python virtual environment...

:: Check if python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in your PATH.
    pause
    exit /b
)

:: Create the virtual environment if it doesn't exist
if not exist ".venv" (
    echo Creating .venv...
    python -m venv .venv
) else (
    echo .venv already exists.
)

:: Activate the virtual environment
call .venv\Scripts\activate

@REM :: 4. Upgrade pip (optional but recommended)
@REM echo Upgrading pip...
@REM python -m pip install --upgrade pip

:: Install requirements
if exist "requirements.txt" (
    echo Installing requirements...
    pip install -r requirements.txt
) else (
    echo requirements.txt not found. Skipping library installation.
)

echo.
echo Setup complete!
pause