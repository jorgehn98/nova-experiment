# NOVA — Digital Studio

An experimental interactive web experience showcasing advanced scroll animations, custom cursor interactions, and particle effects. Built as a modern digital studio portfolio concept.

![NOVA Studio](https://img.shields.io/badge/Status-Experimental-orange) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **Custom Cursor**: Interactive cursor with magnetic effects on hover elements
- **Particle System**: Dynamic canvas-based particle animations on hero section
- **Smooth Scrolling**: Implemented with Lenis for buttery smooth scroll experience
- **Scroll Animations**: GSAP-powered animations triggered on scroll
- **Horizontal Scroll**: Gallery section with horizontal scroll effect
- **Text Effects**: Character splitting and scramble effects
- **Animated Loader**: Progress-based loading screen with percentage counter
- **Stats Counter**: Animated number counters with intersection observer
- **Dual Marquee**: Bidirectional text marquees
- **Section Navigation**: Dot-based navigation for quick section jumping
- **Grain Texture**: Aesthetic grain overlay effect
- **Rotating Badge**: SVG-based circular text animation

## 🛠️ Technologies

- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[GSAP](https://greensock.com/gsap/)** - Professional-grade animation library
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scroll library
- Vanilla JavaScript (ES6+)
- CSS3 with custom properties and animations

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/jorgehn98/nova-experiment.git
cd nova-experiment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🚀 Usage

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

### Build
```bash
npm run build
```
Builds the project for production in the `dist` folder.

### Preview
```bash
npm run preview
```
Preview the production build locally.

## 📁 Project Structure

```
nova-experiment/
├── src/
│   ├── cursor.js           # Custom cursor logic
│   ├── main.js             # Main entry point
│   ├── particles.js        # Particle system
│   ├── scrollAnimations.js # GSAP scroll animations
│   ├── style.css           # Global styles
│   └── textEffects.js      # Text animation effects
├── index.html              # Main HTML file
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies
```

## 🎨 Customization

### Colors
Edit CSS custom properties in `src/style.css`:
```css
:root {
  --c-bg: #0a0a0a;
  --c-text: #e8e8e8;
  --c-accent: #6366f1;
  /* ... */
}
```

### Animations
Modify GSAP timelines in `src/scrollAnimations.js` to adjust animation timing and effects.

### Particles
Configure particle behavior in `src/particles.js`:
```javascript
const config = {
  particleCount: 80,
  connectionDistance: 150,
  // ...
};
```

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Modern browsers with ES6+ support required.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**jorge** ([@jorgehn98](https://github.com/jorgehn98))

## 🙏 Acknowledgments

- Design inspiration from modern digital studios
- GSAP for powerful animation capabilities
- Lenis for smooth scrolling experience

---

⭐ Star this repo if you find it interesting!
