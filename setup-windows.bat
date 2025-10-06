@echo off
echo ================================
echo Medical AI Windows Setup Script
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org/
    echo Continuing with Node.js setup only...
    echo.
)

echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo Installing Python dependencies (if Python is available)...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo WARNING: Failed to install Python dependencies
        echo You may need to install them manually: pip install -r requirements.txt
    )
) else (
    echo Skipping Python dependencies - Python not found
)

echo.
echo Creating .env file if it doesn't exist...
if not exist ".env" (
    echo Creating .env file from template...
    copy ".env.example" ".env" >nul 2>&1
    echo Please edit .env file and add your GROQ_API_KEY
) else (
    echo .env file already exists
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the development server:
echo   npm run dev
echo.
echo If you encounter NODE_ENV errors, use:
echo   npm run dev:win
echo.
echo Make sure to:
echo 1. Add your GROQ_API_KEY to the .env file
echo 2. Ensure all model files are in place:
echo    - embeddings/faiss_index_cpu.index
echo    - embeddings/encoded_docs.npy
echo    - kg_rag_artifacts/ folder with files
echo    - drugs_side_effects.csv
echo.
pause
