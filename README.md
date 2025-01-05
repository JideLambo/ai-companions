# AI Companions - Your Personal AI Assistant in Telegram

![AI Companions Banner](public/banner.png)

AI Companions is a Telegram Mini App that provides personalized AI assistants for various domains like finance, crypto, productivity, and wellness. Users can create, customize, and chat with AI companions directly within Telegram.

## 🌟 Features

- **Personalized AI Companions**
  - Choose from different specializations (Finance, Crypto, Productivity, Wellness)
  - Customize companion personality and appearance
  - Public and private companion modes

- **Seamless Telegram Integration**
  - Native Telegram Mini App experience
  - Automatic theme adaptation
  - Persistent conversations across devices

- **Rich User Experience**
  - Real-time chat interface
  - Contextual navigation
  - Dark mode support
  - Loading states and error handling

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - Lucide Icons

- **Backend**
  - Supabase
  - PostgreSQL
  - Row Level Security
  - TypeScript

- **Authentication**
  - Telegram Login
  - Supabase Auth

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Telegram Bot Token
- Supabase Project

### Environment Variables

Create a `.env.local` file with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_TELEGRAM_USER_DEFAULT_PASSWORD=your_default_password
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-companions.git
cd ai-companions
```

2. Install dependencies:
```bash
npm install
```

3. Run database migrations:
```bash
npx supabase db push
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📱 Usage

1. Open your Telegram bot
2. Start the Mini App
3. Choose a companion category
4. Customize your companion
5. Start chatting!

## 🔐 Security

- Telegram authentication validation
- Row Level Security (RLS) policies
- Protected API routes
- Secure environment variables

## 🗂️ Project Structure

```
src/
├── app/                   # Next.js app router pages
├── components/           
│   ├── chat/             # Chat-related components
│   ├── navigation/       # Navigation components
│   ├── onboarding/      # Onboarding flow
│   └── ui/              # Reusable UI components
├── lib/
│   ├── supabase/        # Supabase client configs
│   └── utils/           # Utility functions
└── types/               # TypeScript definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Supabase](https://supabase.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, join our [Telegram Group](https://t.me/your_support_group) or open a GitHub issue.
