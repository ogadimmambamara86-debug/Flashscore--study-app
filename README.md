# Sports Central - Live Sports Predictions & Community

A modern **monorepo** built with Next.js and Express, providing **AI-powered sports predictions**, live scores, interactive quizzes, and community features with **Pi coin rewards**.

Sports Central - Live Sports Predictions & Community

A modern monorepo built with Next.js and Express, providing AI-powered sports predictions, live scores, interactive quizzes, and community features with Pi coin rewards.


---

✨ Features

🏈 AI-powered sports predictions for NFL, NBA, MLB, Soccer

📊 Live sports scores and odds

🎯 Interactive sports quizzes

💬 Community forum and voting

🪙 Pi coin rewards system

🔒 Security-focused architecture

📱 Responsive design



---

🛠 Tech Stack

Frontend: Next.js 14, React 18, TypeScript

Backend: Express.js, Node.js

APIs: Sports API, Odds API

Styling: CSS Modules

Security: CSP, CORS protection, rate limiting



---

📂 Monorepo Structure

apps/
├── frontend/                 # Next.js frontend
│   ├── src/app/
│   │   ├── components/       # @components/*
│   │   ├── hooks/            # @hooks/*
│   │   ├── controllers/      # @controllers/*
│   │   ├── api/              # @api/*
│   │   ├── services/         # @services/*
│   │   └── style/            # @style/*
│   ├── public/               # Static assets
│   └── package.json
│
├── backend/                  # Express.js backend
│   ├── server.ts             # Main server
│   ├── Sports-api.ts         # Sports API service
│   └── package.json
│
packages/
└── shared/                   # Shared libraries
    └── src/libs/
        ├── types/            # @shared/types/*
        ├── utils/            # @shared/utils/*
        └── models/           # @shared/models/*


---

🚀 Getting Started

Prerequisites

Node.js 20+

npm or yarn


Installation

1. Clone the repository:



git clone <repository-url>
cd workspace

2. Install all dependencies:



npm run install-all

3. Start development servers:



npm run dev

This will start:

Frontend → http://localhost:3000

Backend → http://localhost:5000



---

📜 Available Scripts

npm run dev – Start both frontend & backend

npm run dev:frontend – Start only frontend

npm run dev:backend – Start only backend

npm run build – Build frontend for production

npm run start – Start production servers

npm run lint – Run ESLint

npm run type-check – Run TypeScript checks



---

🔌 API Endpoints

/api/sports-proxy/* – Proxied sports data

/api/predictions – AI-powered predictions

/api/quiz/* – Quiz functionality

/api/health – Health check



---

🔐 Security Features

Content Security Policy (CSP)

CORS protection

Rate limiting

Input validation

XSS protection



---

🤝 Contributing

1. Fork the repo


2. Create a feature branch


3. Make changes


4. Run tests & linting


5. Open a PR




---

📄 License

ISC License


---

🆘 Support

For issues or questions, open an Issue in the repo.

