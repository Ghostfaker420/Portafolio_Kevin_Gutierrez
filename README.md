<<<<<<< Updated upstream
# Portafolio con Tours 360°

Este es un portafolio web moderno que incluye la capacidad de mostrar tours virtuales en 360 grados. El sitio está construido con HTML, CSS y JavaScript, utilizando la biblioteca PANOLENS.js para los tours virtuales.

## Características

- Diseño responsive y moderno
- Sección de proyectos con cuadrícula de imágenes
- Tours virtuales 360° interactivos
- Puntos de interés en los tours
- Formulario de contacto
- Integración con redes sociales

## Requisitos

- Un servidor web (puede ser local para desarrollo)
- Imágenes panorámicas 360° para los tours
- Imágenes para los proyectos
- Un ícono para los puntos de interés (hotspot)

## Estructura del Proyecto

```
portfolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── images/
    ├── project1.jpg
    ├── project2.jpg
    ├── tour1.jpg
    ├── tour2.jpg
    └── hotspot.png
```

## Personalización

### 1. Proyectos
Para agregar o modificar proyectos, edita el array `projects` en el archivo `js/main.js`:

```javascript
const projects = [
    {
        title: 'Título del Proyecto',
        description: 'Descripción del proyecto',
        image: 'images/nombre-imagen.jpg',
        link: 'URL-del-proyecto'
    },
    // Agrega más proyectos aquí
];
```

### 2. Tours 360°
Para agregar o modificar tours virtuales, edita el array `tours` en el archivo `js/main.js`:

```javascript
const tours = [
    {
        title: 'Título del Tour',
        description: 'Descripción del tour',
        panorama: 'images/tour-panorama.jpg',
        hotspots: [
            {
                pitch: 0,    // Ángulo vertical (-90 a 90)
                yaw: 0,      // Ángulo horizontal (-180 a 180)
                text: 'Descripción del punto de interés'
            }
        ]
    }
];
```

### 3. Estilos
Puedes personalizar los colores y estilos editando las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --text-color: #333;
    --light-bg: #f5f6fa;
    --white: #ffffff;
}
```

## Imágenes Requeridas

1. **Imágenes de Proyectos**: 
   - Formato recomendado: JPG o PNG
   - Tamaño recomendado: 800x600 píxeles
   - Colocar en la carpeta `images/`

2. **Imágenes Panorámicas 360°**:
   - Formato: JPG
   - Resolución recomendada: 4096x2048 píxeles o superior
   - Colocar en la carpeta `images/`

3. **Ícono de Hotspot**:
   - Formato: PNG con fondo transparente
   - Tamaño recomendado: 32x32 píxeles
   - Colocar como `hotspot.png` en la carpeta `images/`

## Uso

1. Clona o descarga este repositorio
2. Reemplaza las imágenes de ejemplo con tus propias imágenes
3. Personaliza el contenido en `js/main.js`
4. Abre `index.html` en un servidor web

## Notas Importantes

- Las imágenes panorámicas deben ser equirectangulares (360°x180°)
- Para obtener mejores resultados, optimiza las imágenes antes de usarlas
- Asegúrate de que los puntos de interés (hotspots) estén correctamente posicionados en las coordenadas especificadas

## Soporte

Si encuentras algún problema o necesitas ayuda, por favor abre un issue en el repositorio.
=======
# Portafolio de Diseño Interactivo & Arte Urbano

Este repositorio contiene un portafolio web moderno que combina diseño interactivo con elementos de arte urbano, incluyendo tours virtuales en 360 grados. El sitio está construido con HTML, CSS y JavaScript, utilizando tecnologías modernas para crear una experiencia inmersiva.

## 🎨 Características

- Diseño responsive optimizado para todos los dispositivos
- Interfaz con estética de arte urbano y graffiti
- Sección de proyectos con galería dinámica
- Tours virtuales 360° interactivos con puntos de interés
- Animaciones y efectos visuales modernos
- Formulario de contacto funcional
- Optimización de rendimiento y accesibilidad
- Integración con redes sociales

## 🛠️ Tecnologías Utilizadas

- HTML5 semántico
- CSS3 con variables y efectos avanzados
- JavaScript moderno
- Three.js y Panolens.js para tours 360°
- ScrollReveal para animaciones de scroll
- Font Awesome para iconografía
- Optimización de carga de recursos

## 📁 Estructura del Proyecto

```
portafolio/
├── index.html              # Página principal
├── css/                    # Estilos CSS
│   ├── base.css            # Estilos base y variables
│   ├── optimized.css       # Estilos optimizados
│   ├── modern-styles.css   # Estilos modernos
│   ├── stable-effects.css  # Efectos estables
│   ├── urban-style.css     # Estilos urbanos
│   └── gallery-styles.css  # Estilos de galería
├── js/                     # Scripts JavaScript
│   ├── main.js             # Script principal
│   ├── interactive.js      # Funcionalidades interactivas
│   ├── gallery.js          # Funcionalidad de galería
│   └── performance.js      # Optimización de rendimiento
└── images/                 # Imágenes y recursos gráficos
    ├── LOGO.svg            # Logo del sitio
    ├── 360_1.jpg           # Imagen panorámica para tour
    ├── graffiti-texture.svg # Textura de graffiti
    └── hotspot.svg         # Icono para puntos de interés
```

## 🚀 Instalación y Uso

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/Portafolio.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd Portafolio
   ```

3. Abre el archivo `index.html` en tu navegador o utiliza un servidor local para visualizar el proyecto.

## 🔧 Personalización

### Proyectos
Para agregar o modificar proyectos, edita el array `projects` en el archivo `js/gallery.js`.

### Tours 360°
Para configurar los tours virtuales, modifica el array `tours` en el archivo `js/interactive.js` y añade tus imágenes panorámicas en el directorio `images/`.

### Estilos
Personaliza los colores y estilos modificando las variables CSS en el archivo `css/base.css`.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Para cualquier consulta o colaboración, no dudes en contactarme:
- Email: info@miportafolio.com
- Web: [miportafolio.com](https://miportafolio.com)

---

⭐️ Si te gusta este proyecto, ¡no dudes en darle una estrella en GitHub! ⭐️
>>>>>>> Stashed changes
