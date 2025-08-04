@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚆 Intelligent LRT Setup Script
echo =================================
echo.

:: Colors for output (Windows compatible)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

:: Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:: Check if Node.js is installed
call :print_status "Checking Node.js installation..."
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    call :print_success "Node.js found: !NODE_VERSION!"
) else (
    call :print_error "Node.js is not installed. Please install Node.js v14 or higher."
    exit /b 1
)

:: Check if npm is installed
call :print_status "Checking npm installation..."
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    call :print_success "npm found: !NPM_VERSION!"
) else (
    call :print_error "npm is not installed. Please install npm."
    exit /b 1
)

echo.
call :print_status "Installing dependencies..."

:: Install main project dependencies
call :print_status "Installing main project dependencies..."
npm install
if %errorlevel% equ 0 (
    call :print_success "Main project dependencies installed successfully"
) else (
    call :print_error "Failed to install main project dependencies"
    exit /b 1
)

:: Install server dependencies
call :print_status "Installing server dependencies..."
cd server
npm install
if %errorlevel% equ 0 (
    call :print_success "Server dependencies installed successfully"
) else (
    call :print_error "Failed to install server dependencies"
    exit /b 1
)
cd ..

:: Install database dependencies
call :print_status "Installing database dependencies..."
cd database
npm install
if %errorlevel% equ 0 (
    call :print_success "Database dependencies installed successfully"
) else (
    call :print_error "Failed to install database dependencies"
    exit /b 1
)
cd ..

echo.
call :print_status "Testing database connection..."

:: Test MongoDB connection
cd database
node test-connection.js
if %errorlevel% equ 0 (
    call :print_success "MongoDB connection test successful"
) else (
    call :print_error "MongoDB connection test failed"
    call :print_warning "Please check your MongoDB Atlas connection and try again"
    exit /b 1
)
cd ..

:: Setup database
call :print_status "Setting up database with initial data..."
cd database
node setup-database.js
if %errorlevel% equ 0 (
    call :print_success "Database setup completed successfully"
) else (
    call :print_error "Database setup failed"
    exit /b 1
)
cd ..

echo.
call :print_success "Setup completed successfully!"
echo.
echo 🎉 Intelligent LRT is ready to run!
echo.
echo Next steps:
echo 1. Start the backend server:
echo    cd server ^&^& node server.js
echo.
echo 2. In a new terminal, start the mobile app:
echo    npx expo start
echo.
echo 3. Scan the QR code with Expo Go app on your mobile device
echo.
echo Sample users created:
echo - Admin: admin@lrt.com ^(role: admin^)
echo - Super Admin: superadmin@lrt.com ^(role: superAdmin^)
echo - Regular User: user@lrt.com ^(role: user^)
echo.
echo For detailed instructions, see: database/README.md

pause 