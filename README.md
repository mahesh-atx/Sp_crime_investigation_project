# Crime Investigation Dashboard

A comprehensive web-based crime monitoring and investigation tracking system for law enforcement agencies.

## Features

- **Case Management**: Create, update, and track criminal cases (FIR)
- **Investigation Tracking**: Monitor investigation progress with auto-calculated status
- **User Management**: Role-based access control (Admin, Officer)
- **Analytics Dashboard**: Crime statistics and investigation metrics
- **Automated Alerts**: WhatsApp notifications for investigation milestones
- **e-Sakshi & FSL Integration**: Track evidence submission and forensic reports
- **Real-time Updates**: Live investigation status tracking

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Node-Cron for scheduled jobs
- Meta WhatsApp Cloud API

### Frontend
- React 19
- Vite
- React Router v7
- Tailwind CSS
- Recharts for analytics
- Axios for HTTP requests

## Project Structure

```
crime-dashboard/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── jobs/
│   │   └── utils/
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    └── package.json
```

## Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crime-dashboard
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_id
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Cases
- `GET /api/cases` - Get all cases
- `POST /api/cases` - Create new case
- `GET /api/cases/:id` - Get case details
- `PUT /api/cases/:id` - Update case
- `PATCH /api/cases/:id/complete` - Mark case as completed
- `GET /api/cases/stats` - Get case statistics

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/crime-stats` - Crime statistics

## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up MongoDB locally or use MongoDB Atlas
4. Configure environment variables
5. Run both servers concurrently
6. Open http://localhost:5173 in your browser

## Features in Development

- Advanced filtering and search
- Case assignment workflow
- Judicial tracking
- Mobile app
- Report generation

## License

Proprietary - SP Office Crime Investigation Dashboard

## Support

For issues and questions, please contact the development team.
