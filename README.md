# Dungeon Master's Toolkit
Aplicación web diseñada para ayudar a los Dungeon Masters de Dungeons & Dragons 5e durante sus partidas. Permite consultar monstruos, generar recompensas y realizar lanzamientos de dados desde una sola interfaz.

## Características principales
### Bestiario
- Consulta de monstruos mediante la API de D&D 5e.
- Búsqueda por nombre y filtros por nivel de desafío (CR).
- Tarjetas con información general de cada criatura.
- Vista detallada con estadísticas, habilidades y acciones.

### Generador de Loot
- Generación aleatoria de monedas de cobre, plata, oro y platino.
- Selección de equipamiento consultado desde la API.
- Posibilidad de obtener objetos mágicos.
- Recompensas ajustadas al nivel de desafío seleccionado.

### Lanzamiento de dados
- Dados d4, d6, d8, d10, d12, d20 y d100.
- Lanzamiento de múltiples dados.
- Modificadores positivos y negativos.
- Visualización de resultados individuales y totales.
- Historial de los últimos lanzamientos.

## Tecnologías utilizadas
- React
- JavaScript
- Vite
- CSS
- D&D 5e API
- Git y GitHub
- Vercel
- Capacitor (integración Android prevista)

## API utilizada
La aplicación consume información de la API pública de D&D 5e:
https://www.dnd5eapi.co/

## Instalación y ejecución local
1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Hiraeth248/Web-DmToolKit.git
   ```

2. Entrar en la carpeta del proyecto:

   ```bash
   cd dm-toolkit
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador la dirección local que proporciona Vite.

## Compilación de producción
Para generar la versión de producción:

```bash
npm run build
```
Los archivos compilados se guardan en la carpeta `dist`.

## Despliegue
Aplicación publicada en Vercel:
**[https://web-dm-toolkit.vercel.app/]**

## Autor
Geraldine Ladino

Proyecto académico desarrollado como trabajo final de Diseño Web.