@echo off
cd /d "C:\Users\aluno\Documents\beleza_web\busca_inteligente_a.n.n_beauty"
start cmd /c npx http-server -p 8080
timeout /t 3
start http://localhost:8080
