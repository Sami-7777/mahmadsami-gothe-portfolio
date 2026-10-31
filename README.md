# Mahmadsami Gothe — Portfolio

A high-performance "Signal HUD" developer portfolio featuring real-time interactive Three.js 3D graphics, smooth scroll pacing, and technical typography.

## Live site
https://YOUR-SITE-URL/

## Tech stack
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Animation & Motion**: GSAP + ScrollTrigger, Lenis
- **3D Graphics**: Three.js
- **Contact Service**: EmailJS (`@emailjs/browser`)

## Run locally
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

## Environment variables
Configure your EmailJS credentials in a `.env.local` file:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

*(If variables are left empty, the contact form defaults gracefully to a direct mailto client link).*

## Training credit
Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).
