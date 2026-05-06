# 🚀 Pradeep G - Premium Portfolio

A modern, high-end portfolio website showcasing my skills as a Full-Stack Developer and AI/ML Enthusiast. Built with React, Tailwind CSS, and Framer Motion for a premium user experience.

![Portfolio Preview](https://via.placeholder.com/800x400/06b6d4/ffffff?text=Portfolio+Preview)

## ✨ Features

- **🎨 Modern Design**: Glassmorphism effects with dark/light mode toggle
- **📱 Fully Responsive**: Perfect on all devices (mobile, tablet, desktop)
- **⚡ Smooth Animations**: Framer Motion powered transitions and effects
- **🔍 SEO Optimized**: Meta tags, Open Graph, and Twitter cards
- **♿ Accessible**: ARIA labels and keyboard navigation support
- **🚀 Fast Performance**: Optimized bundle with code splitting
- **🎯 Professional**: Designed for top tech companies and recruiters

## � Deployment

The portfolio is deployed and live at: **[https://prad0202006.github.io/my_portfolio](https://prad0202006.github.io/my_portfolio)**

### Deployment Options

#### GitHub Pages (Current)
```bash
cd frontend
npm run deploy:gh-pages
```

#### Vercel (Recommended)
```bash
cd frontend
npm run deploy:vercel
```

#### Netlify
```bash
cd frontend
npm run deploy:netlify
```

### Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp frontend/.env.example frontend/.env
```

## 🏃‍♂️ Quick Start

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Consistent icon system
- **React Router** - Client-side routing

### Development Tools
- **Create React App** - Build setup
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # SEO optimized HTML
│   ├── manifest.json       # PWA manifest
│   └── favicon.ico         # Favicon
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Hero.js        # Landing section
│   │   ├── About.js       # About section
│   │   ├── Skills.js      # Skills showcase
│   │   ├── Projects.js    # Projects portfolio
│   │   ├── Experience.js  # Experience timeline
│   │   ├── Contact.js     # Contact form
│   │   ├── Navbar.js      # Navigation bar
│   │   └── Footer.js      # Site footer
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.js # Dark/light theme
│   ├── utils/              # Utility functions
│   │   └── animations.js   # Animation variants
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles
│   └── index.js            # App entry point
├── build/                  # Production build
└── package.json            # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prad0202006/my_portfolio.git
   cd my_portfolio/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

The app will be available at `http://localhost:3000`

## 🎨 Customization

### Personal Information
Update the following files with your information:

- `src/components/Hero.js` - Name, roles, social links
- `src/components/About.js` - Personal description, stats
- `src/components/Skills.js` - Skills and proficiency levels
- `src/components/Projects.js` - Project showcase
- `src/components/Experience.js` - Work experience and education
- `src/components/Contact.js` - Contact information

### Styling
- Colors are defined in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles are inline with Tailwind classes

### Theme
The app supports dark and light modes:
- Theme preference is saved in localStorage
- System preference detection
- Manual toggle in navigation

## 📱 Sections Overview

### 🏠 Hero Section
- Animated name with gradient text
- Rotating role titles
- Social media links
- Call-to-action buttons

### 👨‍💻 About Section
- Personal story and background
- Key statistics and achievements
- Professional photo placeholder

### 🛠 Skills Section
- Categorized skills (Frontend, Backend, AI/ML, Tools)
- Animated progress bars
- Proficiency percentages

### 💼 Projects Section
- Filterable project showcase
- Project cards with hover effects
- Live demo and GitHub links

### 📚 Experience Section
- Timeline-style layout
- Education and work experience
- Achievements and highlights

### 📞 Contact Section
- Functional contact form
- Social media links
- Resume download

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json
3. Run `npm run deploy`

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Bundle Size**: ~90KB gzipped
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <2s

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Pradeep G**
- Email: gp893727@gmail.com
- GitHub: [@prad0202006](https://github.com/prad0202006)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/pradeepg)

---

⭐ **Star this repo if you found it helpful!**

Built with ❤️ by Pradeep G

## Project Structure

```
project_1/
├── backend/
│   ├── models/
│   │   ├── Admin.js          # Admin user schema
│   │   ├── Profile.js        # Portfolio profile schema
│   │   └── Project.js        # Project schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── profile.js        # Profile routes
│   │   └── projects.js       # Project routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── server.js             # Express server setup
│   ├── package.json
│   └── .env.example          # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navigation.js  # Navigation bar
    │   ├── pages/
    │   │   ├── ProfilePage.js         # Public profile view
    │   │   ├── AdminDashboard.js      # Admin control panel
    │   │   └── AdminLogin.js          # Login page
    │   ├── App.js             # Main app component
    │   ├── App.css            # App styles
    │   └── index.js           # React entry point
    ├── public/
    │   └── index.html         # HTML template
    ├── package.json
    └── .env                   # API configuration

```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder with:
```
MONGODB_URI=mongodb://localhost:27017/nanotech-portfolio
JWT_SECRET=your_secure_jwt_secret_key
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```
App opens at `http://localhost:3000`

## Initial Admin Setup

To create an admin account, use the registration endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

Then login with these credentials in the Admin Login page.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Admin login

### Profile (Public & Admin)
- `GET /api/profile` - Get portfolio profile
- `PUT /api/profile` - Update profile (admin only)

### Projects (Public & Admin)
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

## Technology Stack

### Frontend
- React 18
- React Router 6
- Axios
- CSS3

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Bcryptjs for password hashing
- CORS

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Development

### Run both servers simultaneously:

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### Development with nodemon (Backend):
```bash
npm install --save-dev nodemon
npm run dev
```

## Build for Production

### Frontend:
```bash
cd frontend
npm run build
```

### Backend:
- Set `NODE_ENV=production` in .env
- Deploy using your preferred hosting (Heroku, AWS, etc.)

## Features to Add

- [ ] Image upload functionality
- [ ] Project search and filtering
- [ ] Portfolio statistics dashboard
- [ ] Email notifications
- [ ] Blog section
- [ ] Testimonials section
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] Analytics integration

## Customization Tips

1. **Colors**: Update CSS files in `frontend/src/` to match your brand
2. **Profile**: Update profile information through the Admin Dashboard
3. **Projects**: Add and manage your nanotech projects in the admin panel
4. **Images**: Replace placeholder image URLs with your actual images
5. **Social Links**: Add your social media profiles in profile settings

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or provide a valid Atlas connection string
- Check `MONGODB_URI` in `.env`

### Frontend API Connection Issues
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

### Authentication Issues
- Clear browser localStorage: `localStorage.clear()`
- Ensure JWT_SECRET is set in backend .env
- Check token expiration (currently set to 24 hours)

## Support

For issues or questions, check the component documentation or console error messages.

## License

MIT

---

Created for showcasing nanotech projects and expertise. Customize to your needs!
