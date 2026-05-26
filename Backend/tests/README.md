# 🧪 Suite de Pruebas Automatizadas de PowerFit

Esta carpeta contiene la suite de pruebas unitarias y de integración desarrolladas con **Jest** y **Supertest** para el backend de PowerFit.

## 📁 Estructura
*   **[models.test.js](file:///c:/Users/lenov/Documents/PowerFit/Proyecto-final-Frontend/Backend/tests/models.test.js):** Contiene pruebas unitarias detalladas para cada uno de los 23 modelos de la base de datos, validando creación, restricciones de nulidad, y lectura/actualización de relaciones.
*   **[integration.test.js](file:///c:/Users/lenov/Documents/PowerFit/Proyecto-final-Frontend/Backend/tests/integration.test.js):** Contiene pruebas de integración de endpoints (CRUD de Usuarios, inicio de sesión/login, y CRUD completo de Alergias) utilizando peticiones HTTP simuladas.

## 🚀 Comandos Rápidos
Desde la carpeta raíz del backend (`Backend/`), ejecuta:

*   **Ejecutar pruebas:** `npm test`
*   **Modo observador (desarrollo):** `npm run test:watch`
*   **Generar reporte de cobertura:** `npm run test:coverage`

## 🔒 Base de Datos Aislada
Cuando ejecutas las pruebas con `npm test`, el entorno se establece automáticamente en `'test'`. Sequelize redirigirá las operaciones a una base de datos **SQLite en memoria (`:memory:`)**, lo que garantiza que las pruebas:
1. Se ejecuten a velocidad ultra-rápida.
2. Sean 100% seguras y **nunca afecten tu base de datos local o de producción de MySQL**.
