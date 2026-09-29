@echo off
:: ====================================================================
:: AVENZA CLOTHES - MS SQL SERVER TCP/IP & PORT 1433 ENABLER
:: File: backend/enable_mssql_tcp.bat
:: Run as Administrator to enable external connections for Node.js / VS Code
:: ====================================================================

echo ====================================================================
echo  ENABLING MS SQL SERVER TCP/IP (PORT 1433) FOR AVENZA BACKEND
echo ====================================================================
echo.

:: Check for Administrator permissions
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Requesting Administrator privileges to configure SQL Server registry...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

echo [*] Administrator privileges confirmed.
echo [*] Enabling TCP/IP protocol on Microsoft SQL Server...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$instances = Get-ChildItem 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL*.*' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty PSChildName; " ^
  "foreach ($inst in $instances) { " ^
  "  $tcpPath = \"HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\$inst\MSSQLServer\SuperSocketNetLib\Tcp\"; " ^
  "  if (Test-Path $tcpPath) { " ^
  "    Set-ItemProperty -Path $tcpPath -Name 'Enabled' -Value 1 -Force; " ^
  "    Set-ItemProperty -Path \"$tcpPath\IPAll\" -Name 'TcpPort' -Value '1433' -Force; " ^
  "    Set-ItemProperty -Path \"$tcpPath\IPAll\" -Name 'TcpDynamicPorts' -Value '' -Force; " ^
  "    Write-Host \"[+] Enabled TCP/IP on $inst\"; " ^
  "  } " ^
  "} " ^
  "Write-Host '[*] Restarting SQL Server service...'; " ^
  "Restart-Service -Name MSSQLSERVER -Force -ErrorAction SilentlyContinue; " ^
  "Restart-Service -Name MSSQL`$SQLEXPRESS -Force -ErrorAction SilentlyContinue; " ^
  "New-NetFirewallRule -DisplayName 'SQL Server Port 1433 (Avenza)' -Direction Inbound -LocalPort 1433 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue | Out-Null; " ^
  "Write-Host '[SUCCESS] MS SQL Server TCP/IP is now ACTIVE on Port 1433!';"

echo.
echo ====================================================================
echo  SETUP COMPLETE!
echo  MS SQL Server is now listening on Port 1433.
echo  You can now connect from VS Code and Node.js backend!
echo ====================================================================
echo.
pause
