# Resume Upload Feature - Quick Setup Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

---

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies (already done with npm install)
npm install

# Create .env file if it doesn't exist
cp .env.example .env

# Start the backend server
npm start
# or for development with auto-reload
npm run dev
```

**Expected Output:**
```
Server running on port 5000
```

✅ Backend is ready at `http://localhost:5000`

---

## Step 2: Frontend Setup (2 minutes)

Open **new terminal window** while backend is running:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not already done)
npm install

# Ensure .env exists with API URL
# File: frontend/.env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development

# Start the frontend dev server
npm start
```

**Expected Output:**
```
Compiled successfully!
Webpack compiled in 5.23s
```

✅ Frontend is ready at `http://localhost:3000`

---

## Step 3: Test the Feature (1 minute)

1. **Open** `http://localhost:3000` in your browser
2. **Click** "Upload Resume" in the navigation menu
3. **Upload** a resume file (PDF or DOCX)
4. **Review** the extracted data in the preview
5. **Click** "Apply Changes to Portfolio"
6. **Verify** your portfolio updated instantly

---

## 🧪 Testing with Sample Resume

### Option A: Use Your Own Resume
- Any well-structured PDF or DOCX resume
- Max 10MB file size

### Option B: Use Example Resume Format

Create a simple text file with this content (copy into a .docx or .pdf):

```
JOHN DOE
john.doe@gmail.com | +91-9876543210 | Bengaluru, India
github.com/johndoe | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Full-Stack Developer with 3+ years of building web applications and leading technical teams. Passionate about clean code and innovative solutions.

CORE SKILLS

Programming: JavaScript, Python, Java, React, Node.js
Database: MongoDB, PostgreSQL, SQL
Web: HTML5, CSS3, Tailwind CSS, Material UI
Tools: Git, Docker, AWS, VS Code, Figma

EXPERIENCE

Senior Developer
Tech Solutions Inc, Bengaluru, India | Jan 2023 - Present

Designed and developed microservices architecture reducing load time by 50%
Mentored 5 junior developers in React and Node.js best practices
Implemented CI/CD pipelines using GitHub Actions and Docker
Improved code quality with comprehensive testing (Jest, React Testing Library)

Junior Developer
StartUp Co, Bengaluru, India | Jun 2021 - Dec 2022

Built responsive web applications using React and modern CSS frameworks
Developed REST APIs using Node.js and Express
Collaborated with design and product teams for feature implementation
Participated in code reviews and contributed to technical documentation

PROJECTS

E-Commerce Platform
React, Node.js, MongoDB, Tailwind CSS
github.com/johndoe/ecommerce

Full-featured e-commerce application with user authentication, product management, and payment integration. Implemented responsive design and optimized for mobile devices.

Task Management App
React, Firebase, Material UI
github.com/johndoe/task-manager

Real-time task management application with user collaboration features and data persistence.

EDUCATION

Bachelor of Technology in Computer Science
State University, Bengaluru, India | 2017 - 2021
```

---

## 🔍 Troubleshooting

### "Cannot POST /api/resume/upload"
**Problem:** Backend not running or wrong API URL

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Should return: {"message":"Server is running"}

# If not running, start backend:
cd backend && npm start
```

### "CORS Error" in console
**Problem:** Frontend and backend CORS mismatch

**Solution:**
- Backend already has CORS enabled
- Ensure `REACT_APP_API_URL=http://localhost:5000` in frontend .env
- Restart frontend: `npm start` in frontend folder

### "File upload fails"
**Problem:** File type or size issue

**Solution:**
- Only PDF and DOCX files supported
- Max file size: 10MB
- Check file extension is correct
- Try different file format

### "Port 5000 already in use"
**Problem:** Another service using the port

**Solution:**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### "Module not found" errors
**Problem:** Dependencies not installed

**Solution:**
```bash
# In backend folder
rm -rf node_modules package-lock.json
npm install

# In frontend folder
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 File Structure Created

```
project_1/
├── backend/
│   ├── utils/
│   │   └── resumeParser.js          ✅ NEW
│   ├── routes/
│   │   └── resume.js                ✅ NEW
│   ├── uploads/                     ✅ AUTO-CREATED
│   ├── server.js                    ✅ UPDATED
│   └── package.json                 ✅ UPDATED
│
├── frontend/
│   └── src/
│       ├── components/
│       │   └── ResumeUploader.js    ✅ NEW
│       ├── contexts/
│       │   └── PortfolioDataContext.js  ✅ NEW
│       ├── App.js                   ✅ UPDATED
│       └── .env.example             ✅ UPDATED
│
└── RESUME_UPLOAD_FEATURE.md         ✅ NEW
```

---

## 🎯 What Happens When You Upload

```
1. You select/drop a resume file
                ↓
2. File is validated (type, size)
                ↓
3. FormData sent to backend
                ↓
4. Backend receives file → stores temporarily
                ↓
5. Parser extracts text (PDF/DOCX)
                ↓
6. AI parser extracts structured data
   - Name, email, phone, location
   - Skills by category
   - Experience, education, projects
                ↓
7. JSON data sent back to frontend
                ↓
8. Preview displays extracted data
                ↓
9. You click "Apply Changes"
                ↓
10. Data updates in PortfolioDataContext
                ↓
11. All portfolio components re-render
                ↓
12. Data saved to localStorage
                ↓
13. Your portfolio is updated instantly!
```

---

## 💾 Data Persistence

Your resume data is saved in **two places**:

1. **Browser localStorage** - Persists across sessions
   - Location: DevTools → Application → Local Storage
   - Key: `portfolioData`

2. **Portfolio Context** - Used by all components
   - Accessed via `usePortfolioData()` hook

To reset to defaults:
```javascript
// In browser console
localStorage.removeItem('portfolioData');
location.reload();
```

---

## 🚀 Next Steps

After setup is working:

1. **Customize** - Modify ResumeUploader styles to match your design
2. **Deploy** - Push to GitHub, deploy to Vercel/Netlify
3. **Enhance** - Add more parsing features, AI validation
4. **Integrate** - Connect to backend database for persistence

See `RESUME_UPLOAD_FEATURE.md` for detailed documentation.

---

## 📞 Need Help?

1. Check **Troubleshooting** section above
2. Review `RESUME_UPLOAD_FEATURE.md` for detailed docs
3. Check browser console for error messages
4. Verify both frontend and backend are running
5. Check network tab in DevTools for API errors

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] "Upload Resume" visible in navigation
- [ ] Can upload a PDF or DOCX file
- [ ] Data preview shows after upload
- [ ] Can click "Apply Changes"
- [ ] Portfolio updates with new data
- [ ] Changes persist after page reload

If all checked ✅, your feature is ready!

---

## 🎉 Features You Now Have

✅ Drag-and-drop resume upload
✅ Automatic data extraction (name, skills, experience, etc.)
✅ Data validation and error handling
✅ Real-time portfolio updates
✅ Data persistence with localStorage
✅ Beautiful, modern UI with animations
✅ Responsive design (mobile/tablet/desktop)
✅ Production-ready code

---

**Happy uploading! 🚀**
