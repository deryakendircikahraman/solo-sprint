# SoloSprint + Emotional Reflection Agent

A clean, modular MVP that helps users set daily focus goals, breaks them into tasks using GPT-4, tracks browser behavior, and generates emotionally-aware daily reflections.

<img width="1587" height="851" alt="image" src="https://github.com/user-attachments/assets/d406a135-c44f-42ed-994f-b63161d131f7" />
<img width="1587" height="591" alt="image" src="https://github.com/user-attachments/assets/86e70edd-28ea-4598-87e7-78a6430f85cb" />
<img width="541" height="591" alt="image" src="https://github.com/user-attachments/assets/c3f44dc1-6546-49e5-9f6c-791e95b08e56" />
<img width="1452" height="670" alt="image" src="https://github.com/user-attachments/assets/4d0221b0-4bac-4021-b646-13a89b9ee51b" />


## ✨ Features

- **Goal Setting**: Input daily focus goals and get AI-powered task breakdowns
- **Focus Tracking**: Simulated browser activity monitoring with focus/distraction metrics
- **Real-time Analytics**: Live charts showing focus vs distraction percentages
- **Emotional Reflection**: GPT-4 powered insights based on your productivity patterns
- **Clean UI**: Modern, calm design with Tailwind CSS
- **Modular Architecture**: Scalable component structure for easy development

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI GPT-4 for task breakdown and emotional reflection
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: React hooks with localStorage persistence

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
solo-sprint/
├── components/           # Reusable UI components
│   ├── GoalForm.tsx     # Goal input form
│   ├── TaskChecklist.tsx # Task management
│   ├── SessionSummaryCard.tsx # Focus session stats
│   └── FocusChart.tsx   # Chart.js visualizations
├── pages/               # Next.js pages
│   ├── index.tsx        # Homepage with goal setting
│   ├── summary.tsx      # Daily summary & reflection
│   └── api/             # API endpoints
│       ├── gpt-breakdown.ts # Goal → tasks
│       └── gpt-reflection.ts # Focus → reflection
├── styles/              # Global styles
│   └── globals.css      # Tailwind + custom styles
├── types/               # TypeScript interfaces
│   └── index.ts         # Data type definitions
└── public/              # Static assets
```

## 🎯 How It Works

### 1. Goal Setting & Task Breakdown
- User inputs a daily focus goal
- GPT-4 breaks it down into 3-5 actionable subtasks
- Tasks are displayed in a clean checklist interface

### 2. Focus Session Tracking
- Click "Start Focus Session" to begin monitoring
- Simulated browser activity tracks productive vs distracting sites
- Real-time focus percentage updates every 10 seconds
- Emotional state is inferred from focus patterns

### 3. Daily Summary & Reflection
- Comprehensive session statistics
- Visual charts showing focus distribution
- GPT-4 generates personalized emotional reflection
- Actionable insights and recommendations

## 🎨 Design System

### Colors
- **Primary**: Blue tones (`primary-500: #3b82f6`)
- **Calm**: Neutral grays (`calm-50: #f8fafc` to `calm-900: #0f172a`)
- **Semantic**: Green (success), Yellow (warning), Red (error)

### Components
- **Cards**: `bg-white rounded-2xl shadow-soft p-6`
- **Buttons**: `btn-primary` and `btn-secondary` classes
- **Inputs**: `input-field` class with focus states
- **Typography**: Inter font family

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Adding New Features

1. **New Components**: Add to `components/` directory
2. **New Pages**: Add to `pages/` directory
3. **New API Routes**: Add to `pages/api/` directory
4. **New Types**: Add to `types/index.ts`

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Use Tailwind classes for styling
- Keep components focused and reusable
- Add proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Chart.js for data visualization
- Tailwind CSS for styling
- Next.js team for the amazing framework

