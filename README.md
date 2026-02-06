# ❤️ Heartbeat

A simple and beautiful uptime monitoring service that keeps track of your websites, APIs, and applications. Get instant notifications when your services go down and monitor their performance over time.

## ✨ Features

- **Real-time Monitoring** - Continuously checks your endpoints at customizable intervals
- **Status Dashboard** - Clean, intuitive interface showing the health of all your services
- **Uptime History** - Visual uptime bars showing service availability over the last 30 days
- **Response Time Tracking** - Monitor how quickly your services are responding
- **Incident Management** - Automatic detection and tracking of downtime incidents
- **Multiple HTTP Methods** - Support for GET, POST, and HEAD requests
- **User Authentication** - Secure sign-in system to protect your monitoring data
- **Project Organization** - Group related endpoints together for better management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/heartbeat.git
   cd heartbeat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/heartbeat"
   AUTH_SECRET="your-secret-key"
   AUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to start using Heartbeat.

## 📖 How to Use

### 1. Create an Account
- Sign up with your email and password
- Verify your email address (if required)

### 2. Create Your First Project
- Click "New Project" on the dashboard
- Give your project a name and description
- Projects help you organize related endpoints

### 3. Add Endpoints to Monitor
- Within your project, click "New Endpoint"
- Enter the URL you want to monitor
- Choose the HTTP method (GET, POST, or HEAD)
- Set the check interval (default: 60 seconds)
- Toggle the endpoint to activate monitoring

### 4. Monitor Your Services
- View the status of all endpoints on your dashboard
- Green badges mean everything is running smoothly
- Yellow indicates degraded performance (slow response times)
- Red means the endpoint is down or unreachable

### 5. Check Detailed Stats
- Click on any project to see detailed endpoint information
- View uptime history with the visual uptime bar
- Monitor response times over time
- Track incidents and downtime periods

## 🎯 What Heartbeat Monitors

- **Website Availability** - Ensures your websites are accessible
- **API Health** - Monitors API endpoints for proper responses
- **Service Performance** - Tracks response times and detects degradation
- **Downtime Detection** - Automatically identifies when services go down

## 🔧 Configuration

### Check Intervals
Endpoints can be checked at different intervals:
- 30 seconds (high-frequency monitoring)
- 1 minute (standard)
- 5 minutes (resource-efficient)
- 10 minutes (minimal monitoring)

### Status Definitions
- **🟢 UP** - Service is responding correctly and quickly
- **🟡 DEGRADED** - Service is responding but slowly (5+ seconds)
- **🔴 DOWN** - Service is not responding or returning errors

## 🛠️ Tech Stack

- **Frontend** - Next.js 16, React 19, Tailwind CSS
- **Backend** - Next.js API routes, Prisma ORM
- **Database** - PostgreSQL
- **Authentication** - Better Auth
- **Deployment** - Vercel (recommended)

## 📝 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database Management

```bash
npx prisma migrate dev    # Run migrations in development
npx prisma studio         # Open database browser
npx prisma generate       # Generate Prisma client
```

## 🌟 Why Heartbeat?

Unlike complex monitoring solutions, Heartbeat focuses on simplicity and ease of use:

- **No complicated setup** - Be monitoring in minutes
- **Clean interface** - Focus on what matters most
- **Reliable alerts** - Know immediately when something's wrong
- **Affordable** - Built with modern, efficient technology
- **Privacy-focused** - Your monitoring data stays yours

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

If you run into any issues or have questions, please:
- Open an issue on GitHub
- Check the documentation
- Reach out to the community

---

**Made with ❤️ for developers who care about reliability**