# Nanotech Portfolio Website

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing and displaying a nanotech portfolio with admin controls.

## Features

### Client Side (Public)
- **Portfolio Profile Display** - Showcase your professional information
  - Profile name, title, bio
  - Contact information and location
  - Social media links (LinkedIn, Twitter, GitHub)
  - Profile and background images

- **Projects Showcase**
  - Browse all nanotech projects
  - Filter by category (Materials Science, Quantum Computing, Drug Delivery, etc.)
  - View project details, technologies, and links
  - Featured project highlighting

### Admin Side
- **Authentication** - Secure login with JWT tokens
- **Profile Management**
  - Edit personal information
  - Update profile pictures and background images
  - Manage social media links

- **Project Management**
  - Create, edit, and delete projects
  - Add project descriptions and technologies
  - Link to project demos and GitHub repositories
  - Organize by category

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
