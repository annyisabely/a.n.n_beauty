@echo off
cd /d "C:\Users\aluno\Documents\beleza_web\busca_inteligente_a.n.n_beauty"
echo Iniciando GlowAI + A.n.n Beauty...
start cmd /k node proxy.js
timeout /t 2
start http://localhost:5500
