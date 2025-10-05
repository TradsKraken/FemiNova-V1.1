# FemiNova - Empowering Women's Voices

A modern, responsive campaign website built for women's empowerment and advocacy against gender-based violence.

**Academic Project** - Developed for the subject **Kasaysayan** (History)

## Overview

FemiNova is a comprehensive static website dedicated to supporting women and girls affected by gender-based violence in the Philippines. This project was developed as part of the **Kasaysayan (History)** subject curriculum, combining historical awareness of gender-based violence with modern web development techniques.

The website features seven main campaigns and provides resources, support information, and community engagement opportunities to address this critical social issue.

## Campaigns

FemiNova showcases seven comprehensive campaigns:

1. **Ano nga ba ang karahasan?** - Understanding different forms of violence and abuse
2. **Know your rights** - Legal rights and protections under Republic Act 9262
3. **Myths vs Facts** - Debunking common misconceptions about gender-based violence
4. **Pagsusulit** - Knowledge assessment and learning through interactive quizzes
5. **Kwentong Survivor!** - Inspiring stories of courage, resilience, and hope from survivors
6. **Get free professionalation** - 24/7 access to crisis support, counseling, and legal assistance
7. **paano magvolunteer, donate, advocate** - Meaningful ways to support survivors and contribute to ending gender-based violence

## Tech Stack

- **HTML5** - Semantic markup and structure
- **Tailwind CSS** - Utility-first styling via CDN
- **Vanilla JavaScript** - Client-side interactions, search functionality, and API integration
- **No build system** - Simple, dependency-free development

## Features

### 🎨 **Design & User Experience**
- **Pink and purple themed responsive design** optimized for mobile and desktop
- **Glassmorphism effects** and gradient backgrounds
- **Smooth animations** and hover transitions throughout
- **Mobile-first approach** with collapsible navigation

### 🔍 **Advanced Search System**
- **Comprehensive search** across all website content
- **Real-time results** with relevance scoring
- **Elegant modal interface** with highlighted search terms
- **Cross-page search** functionality
- **Smart result categorization** (Pages, Sections, Campaigns, Features)

### 💬 **Interactive Features**
- **Daily affirmations** fetched from external API with local fallback
- **Dynamic team section** rendered from JavaScript array
- **Expandable campaign accordions** with smooth animations
- **Horizontal scrolling campaign previews** on homepage
- **Modal-based authentication** system (demo functionality)

### 📱 **Support & Resources**
- **Emergency help form** for immediate crisis support
- **Contact forms** with validation
- **Professional support directory** with 24/7 access information
- **Legal rights information** and resources
- **Volunteer and donation opportunities**

### ♿ **Accessibility & Performance**
- **WCAG compliant** with proper labels and keyboard navigation
- **Screen reader friendly** markup
- **Fast loading** with CDN-hosted assets
- **Progressive enhancement** approach

## Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser
3. **That's it!** No installation or build process required

### Optional: Local Development Server

For enhanced local development experience:

```bash
# Python 3
python -m http.server 8000

# Node.js (requires serve package)
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Project Structure

```
FemiNova/
├── index.html                    # Main landing page with hero, about, team, campaigns preview
├── campaigns.html               # Detailed campaign pages with accordions
├── Background.png               # Hero section background image
├── README.md                    # This documentation
├── assets/
│   ├── js/
│   │   └── main.js             # All JavaScript functionality
│   └── css/
│       └── scroll-animations.css # Custom scroll animations
├── img/                         # Campaign visual assets
│   ├── ano nga ba ang karahasan.png
│   ├── know your rights.png
│   ├── Myths vs Facts.png
│   ├── pagsusulit.png
│   ├── kwentong survivor.png
│   ├── R.A 9262.png
│   ├── emosyonal na karaahasan.png
│   ├── fisikal na karahasan.png
│   ├── seksuwal na karahasan.png
│   └── pisikal na karahasan.png
└── .github/
    └── copilot-instructions.md   # AI development guidance
```

## Customization

### Update Team Members

Edit the `team` array in `assets/js/main.js`:

```javascript
const team = [
    'Name|email@feminova.org',
    'Another Member|another@feminova.org',
    // Add more members in same format
];
```

### Modify Campaigns

Campaign content is defined in `campaigns.html`. Each campaign section includes:
- Visual imagery from the `img/` folder
- Detailed descriptions and information
- Functional buttons for volunteer/donate/advocate actions

### Update Search Index

The search functionality automatically indexes all content. To add new searchable content, simply add it to the HTML pages - the search system will automatically include it.

### Customize Colors

The site uses Tailwind's pink and purple palettes. Key theme classes:
- `text-pink-600`, `bg-pink-600` - Primary pink accents
- `from-pink-500 to-purple-600` - Gradient combinations
- `bg-pink-50`, `text-pink-100` - Light variants
- `bg-purple-500`, `text-purple-700` - Purple accents

## Browser Support

- **Chrome/Edge** 88+
- **Firefox** 85+
- **Safari** 14+
- **Mobile browsers** (iOS Safari 14+, Chrome Mobile)
- **Responsive design** works on all screen sizes

## API Dependencies

- **Affirmations API**: `https://www.affirmations.dev/` (with local fallback)
- **No authentication backends** - all forms are demo-only

## Contributing

1. **Preserve simplicity** - maintain the zero-build architecture
2. **Test responsiveness** - ensure mobile-first design principles
3. **Maintain accessibility** - follow WCAG guidelines
4. **Update documentation** - modify this README for significant changes
5. **Keep dependencies minimal** - prefer vanilla JavaScript over libraries

## Development Notes

- **No package managers** required - pure HTML/CSS/JS
- **CDN-hosted Tailwind** for styling
- **Client-side only** - no server-side processing
- **Demo forms** - contact and auth forms show alerts (ready for backend integration)
- **Modular JavaScript** - all functionality in single `main.js` file

## License

© 2025 FemiNova. Academic project for Kasaysayan (History) subject. All rights reserved.

---

*Built with ❤️ for women's empowerment and gender equality in the Philippines.*
