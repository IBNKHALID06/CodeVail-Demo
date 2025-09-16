@echo off
echo CodeVail UI Quick Transfer
echo ========================
echo.
set /p dest="Enter destination project path: "
echo.
echo Copying essential UI files...

:: Core components
xcopy /E /I /Y "components" "%dest%\components"
xcopy /E /I /Y "lib" "%dest%\lib"
xcopy /E /I /Y "hooks" "%dest%\hooks"
xcopy /E /I /Y "src" "%dest%\src"

:: Configuration
copy /Y "tailwind.config.js" "%dest%\"
copy /Y "postcss.config.mjs" "%dest%\"
copy /Y "tsconfig.json" "%dest%\"
copy /Y "next.config.mjs" "%dest%\"
copy /Y "components.json" "%dest%\"

:: Styling
copy /Y "app\globals.css" "%dest%\app\"
xcopy /E /I /Y "styles" "%dest%\styles"

:: Assets
xcopy /E /I /Y "public" "%dest%\public"

echo.
echo ✅ Transfer complete!
echo.
echo Next steps:
echo 1. Install dependencies: npm install
echo 2. See UI-TRANSFER-GUIDE.md for detailed instructions
echo.
pause
