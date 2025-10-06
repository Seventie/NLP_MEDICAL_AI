@echo off
echo ================================
echo Simple Medical AI Server Start
echo ================================
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    pause
    exit /b 1
)

REM Pull latest changes
echo Pulling latest changes...
git pull origin main

REM Clean install
echo Cleaning node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing dependencies...
npm install

REM Create .env if not exists
if not exist ".env" (
    echo Creating .env file...
    echo NODE_ENV=development > .env
    echo PORT=5000 >> .env
    echo GROQ_API_KEY=your_key_here >> .env
)

echo.
echo Starting server...
echo Server will be available at: http://localhost:5000
echo Health check: http://localhost:5000/health
echo.

REM Start with nodemon for better error handling
set NODE_ENV=development
set PORT=5000
npx nodemon --exec "npx ts-node server/index.ts" --watch server --ext ts,js,json

pause
