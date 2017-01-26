@ECHO off
:10
tasklist /v /FO "CSV" > %USERPROFILE%\Desktop\ChromeTask\sketch.js\yes.txt
TIMEOUT 1 /nobreak
goto 10
pause