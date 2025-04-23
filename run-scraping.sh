#!/bin/bash
# filepath: /home/marcos/Estudio/Beisbolcubano/run-scraping.sh

# Cargar NVM
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Usar la versión correcta de Node
nvm use 20

# Navegar al directorio del proyecto
cd /home/marcos/Estudio/Beisbolcubano

# Ejecutar el test de Cypress en modo headless
npx cypress run --spec "cypress/e2e/scraping.cy.js"
