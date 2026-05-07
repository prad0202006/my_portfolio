# 🚀 Production-Grade AI Portfolio with Resume Upload

A modern, secure, and scalable portfolio website featuring AI-powered resume parsing with real-time progress updates. Built with enterprise-grade security and premium user experience.

## ✨ Features

### 🔒 **Enterprise Security**
- **File Upload Security**: Multer with comprehensive validation
- **Rate Limiting**: Express-rate-limit protection
- **Helmet Security**: Security headers and XSS protection
- **CORS Protection**: Configured cross-origin policies
- **Input Sanitization**: Joi validation and data sanitization
- **Auto File Cleanup**: Temporary files removed after processing

### ⚡ **Real-Time Processing**
- **WebSocket Integration**: Socket.IO for live progress updates
- **Animated Progress**: Smooth progress bars with status messages
- **Multi-Stage Parsing**: Upload → Parse → Extract → Update
- **Error Recovery**: Graceful error handling with user feedback

### 🤖 **AI-Powered Parsing**
- **PDF & DOCX Support**: Advanced text extraction
- **Structured Data**: JSON output with 10+ fields
- **Smart Extraction**: Name, email, skills, experience, projects
- **Fallback Handling**: Robust error recovery
- **Quality Validation**: Data integrity checks

### 🎨 **Premium UX**
- **Drag & Drop**: Intuitive file upload interface
- **Dark/Light Mode**: Theme switching support
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton screens and progress indicators

## 🏗️ **Architecture**

```
backend/
├── src/
│   ├── config/           # Environment & app configuration
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic (resume parsing)
│   ├── middleware/       # Security, validation, error handling
│   ├── routes/          # API endpoints
│   ├── utils/           # Helpers (logger, validation)
│   ├── validators/      # Input validation schemas
│   └── server.js        # Main application entry
├── uploads/             # Temporary file storage (auto-cleaned)
├── logs/               # Winston logging files
└── package.json

frontend/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React Context for state
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Frontend utilities
└── package.json
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/prad0202006/my_portfolio.git
cd my_portfolio

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend (.env)
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secure_jwt_secret_here_min_32_chars
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/nanotech-portfolio
```

#### Frontend (.env)
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### 3. Start Development Servers

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm start
```

### 4. Access Your Portfolio

- **Frontend**: http://localhost:3000/my_portfolio
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📡 **API Documentation**

### Resume Upload
```http
POST /api/resume/upload
Content-Type: multipart/form-data

Form Data:
- resume: File (PDF/DOCX, max 5MB)
- x-client-id: String (optional, for WebSocket tracking)
```

**Response:**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [...],
    "education": [...],
    "projects": [...]
  },
  "fileName": "resume.pdf",
  "parsedAt": "2024-01-01T00:00:00.000Z"
}
```

### Real-Time Progress (WebSocket)
```javascript
// Connect to Socket.IO
const socket = io('http://localhost:5000');

// Listen for progress updates
socket.on('resume-parsing-progress', (data) => {
  console.log(`${data.progress}%: ${data.message}`);
  // data: { progress: 35, message: "Extracting skills...", timestamp: "..." }
});
```

## 🔧 **Configuration**

### Security Settings
```javascript
// backend/src/config/config.js
const config = {
  // File upload limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB

  // Rate limiting
  RATE_LIMIT_MAX: 100, // requests per 15 minutes
  UPLOAD_RATE_LIMIT_MAX: 10, // uploads per hour

  // CORS origins
  CORS_ORIGINS: [
    'http://localhost:3000',
    'https://yourdomain.com'
  ]
};
```

### Parsing Configuration
```javascript
// backend/src/services/resumeParser.js
const parsingProgress = {
  EXTRACTING_TEXT: 10,
  PARSING_NAME: 20,
  PARSING_CONTACT: 30,
  PARSING_SKILLS: 40,
  PARSING_EXPERIENCE: 60,
  PARSING_EDUCATION: 75,
  PARSING_PROJECTS: 85,
  FINALIZING: 95,
  COMPLETE: 100
};
```

## 🧪 **Testing**

### Backend Tests
```bash
cd backend
npm test
```

### Manual Testing
1. **File Upload**: Try uploading PDF/DOCX files
2. **Progress Updates**: Monitor WebSocket messages
3. **Error Handling**: Test with invalid files
4. **Security**: Attempt path traversal, large files, etc.

## 🚀 **Production Deployment**

### 1. Build Frontend
```bash
cd frontend
npm run build
```

### 2. Environment Variables
```bash
# Production .env
NODE_ENV=production
JWT_SECRET=your_production_secret_min_64_chars
FRONTEND_URL=https://yourdomain.com
MONGODB_URI=your_production_mongo_uri
```

### 3. Start Production Server
```bash
cd backend
npm start
```

### 4. Nginx Configuration (Optional)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 **Security Features**

- ✅ **File Type Validation**: MIME type and extension checking
- ✅ **Size Limits**: 5MB maximum file size
- ✅ **Path Traversal Protection**: Filename sanitization
- ✅ **Rate Limiting**: Prevents abuse and DoS attacks
- ✅ **Security Headers**: Helmet.js protection
- ✅ **Input Validation**: Joi schema validation
- ✅ **Auto Cleanup**: Temporary files removed after processing
- ✅ **Error Sanitization**: No sensitive data in error responses

## 📊 **Performance Optimizations**

- ⚡ **WebSocket Compression**: Efficient real-time updates
- 🚀 **Lazy Loading**: Components loaded on demand
- 📦 **File Streaming**: Large files processed in chunks
- 🗂️ **Background Processing**: Non-blocking file operations
- 💾 **Memory Management**: Automatic cleanup and garbage collection

## 🐛 **Troubleshooting**

### Common Issues

**1. WebSocket Connection Failed**
```bash
# Check CORS settings in backend/src/server.js
# Ensure FRONTEND_URL matches your frontend URL
```

**2. File Upload Errors**
```bash
# Check file permissions on uploads/ directory
# Verify MAX_FILE_SIZE in config
# Check multer configuration
```

**3. Parsing Errors**
```bash
# Check PDF/DOCX file corruption
# Verify text extraction libraries
# Check parsing regex patterns
```

**4. Port Conflicts**
```bash
# Change PORT in .env file
# Kill processes using the port: netstat -ano | findstr :5000
```

### Debug Mode
```bash
# Enable detailed logging
LOG_LEVEL=debug npm run dev

# Check logs
tail -f backend/logs/all.log
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Socket.IO**: Real-time communication
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **Mammoth**: DOCX text extraction
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling

## 📞 **Support**

For support, email gp893727@gmail.com or create an issue in the repository.

---

**Built with ❤️ by Pradeep G**

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
