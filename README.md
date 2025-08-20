
# Sports Central - Live Sports Predictions & Community

A modern Next.js application providing AI-powered sports predictions, live scores, interactive quizzes, and community features with Pi coin rewards.

## Features

- 🏈 AI-powered sports predictions for NFL, NBA, MLB, Soccer
- 📊 Live sports scores and odds
- 🎯 Interactive sports quizzes
- 💬 Community forum and voting
- 🪙 Pi coin rewards system
- 🔒 Security-focused architecture
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Express.js, Node.js
- **APIs**: Sports API integration, Odds API
- **Styling**: CSS Modules
- **Security**: Content Security Policy, CORS protection

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workspace
```

2. Install dependencies:
```bash
npm install
```

3. Start the development servers:
```bash
npm run dev
```

This will start:
- Next.js frontend on port 3000
- Express backend on port 5000

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   └── ...
├── services/          # Business logic and external API calls
├── utils/             # Utility functions and helpers
├── styles/            # CSS modules and global styles
├── controllers/       # Backend controllers
└── models/           # Data models
```

## API Endpoints

- `/api/sports-proxy/*` - Proxied sports data endpoints
- `/api/predictions` - Sports predictions
- `/api/quiz/*` - Quiz functionality
- `/api/health` - Health check

## Configuration

The project uses environment-based configuration. Key settings in `next.config.js`:

- API rewrites for development/production
- Security headers (CSP, HSTS, etc.)
- Compression and optimization

## Security Features

- Content Security Policy
- CORS protection
- Rate limiting
- Input validation
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

ISC License

## Support

For support or questions, please open an issue in the repository.
