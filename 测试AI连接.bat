@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    DeepSeek AI 连接测试
echo ========================================
echo.
echo 正在打开测试页面...
echo.

start test_ai.html

echo.
echo ✅ 测试页面已在浏览器中打开
echo.
echo 测试页面将自动验证：
echo   - API密钥是否有效
echo   - DeepSeek服务连接状态
echo   - AI回复功能是否正常
echo.
echo ========================================
echo.
pause

