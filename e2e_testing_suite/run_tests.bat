@echo off
title Krinterior AI E2E Test Suite Runner
cls

echo ===============================================================
echo     Krinterior AI E2E Test Suite installation and runner
echo ===============================================================
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not added to your system PATH.
    echo Please install Python 3.8+ and retry.
    pause
    exit /b 1
)

echo [1/3] Installing/verifying python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Dependency installation failed. Trying to continue...
)
echo.

echo [2/3] Executing test suites and generating report...
python generate_report.py
if %errorlevel% neq 0 (
    echo [ERROR] Execution failed during report compilation.
    pause
    exit /b 1
)
echo.

echo [3/3] Locating test report...
if exist test_report.xlsx (
    echo [SUCCESS] E2E test suites executed successfully!
    echo [SUCCESS] Report generated at: e2e_testing_suite\test_report.xlsx
) else (
    echo [ERROR] Report excel file not found.
)
echo.
echo ===============================================================
pause
