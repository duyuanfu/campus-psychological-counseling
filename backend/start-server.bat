@echo off
chcp 65001 >nul
echo ========================================================
echo   心语树·高校心理健康平台 Java 后端服务启动脚本
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] 正在编译最新代码...
call mvn compile -DskipTests

echo.
echo [2/2] 正在启动 Spring Boot 服务 (端口: 8088)...
echo ========================================================
echo   提示: 数据库连接位于 src/main/resources/application.yml
echo ========================================================
echo.
call mvn spring-boot:run
pause
