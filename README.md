# 🚀 Campaign Studio

A powerful AI-driven marketing campaign generator that creates personalized email and SMS copy using Google's Gemini AI. Built for marketers who need high-converting, segment-specific content at scale.

<div align="center">
<img width="1200" height="475" alt="Campaign Studio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## ✨ Features

### 🎯 **Smart Customer Segmentation**
- **VIP Customers**: Exclusive access messaging, early bird offers, premium treatment
- **Churn Risk Recovery**: Win-back campaigns with special incentives and urgency  
- **New Customer Welcome**: Onboarding sequences with social proof and education
- **Regular Customer Engagement**: Seasonal offers, recommendations, and loyalty building

### 📧 **Multi-Channel Campaign Types**
- **Text Email**: Clean, conversion-focused email copy with subject lines
- **Image Email**: Rich emails with product visuals, CTAs, and promotional codes
- **SMS Marketing**: Conversational text messages optimized for mobile engagement

### 🧠 **AI-Powered Copy Generation**
- **CRO-Optimized Prompts**: Templates designed for maximum conversion rates
- **Segment Psychology**: Tailored messaging based on customer behavior patterns
- **A/B Variant Creation**: Automatic generation of two distinct copy versions
- **Smart Post-Processing**: Removes corporate jargon and overly formal language

### 📊 **Export & Data Management**
- **CSV Export**: Ready for email platforms (Mailchimp, Klaviyo, etc.)
- **JSON Export**: Developer-friendly structured data
- **Copy-to-Clipboard**: Quick content sharing and collaboration
- **Bulk Processing**: Generate campaigns for multiple customers at once

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** 
- **Google Gemini API key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JacobKayembekazadi/ltv-campaign-studio.git
   cd ltv-campaign-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file in project root
   echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Start generating campaigns!

## 🔧 Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI generation | `AIzaSyD...` |

## 📖 Usage Guide

### 1. **Customer Data Setup**
Add customers with the following information:
- **Name**: Customer's first name for personalization
- **Segment**: VIP, Churn Risk, New Customer, or Regular Customer  
- **Last Purchase**: Recent purchase for context (e.g., "Running shoes")
- **Sentiment**: Current relationship status (Positive, Neutral, Negative)

**CSV Upload Format:**
```csv
name,segment,lastPurchase,sentiment
Sarah,VIP Customer,Designer handbag,Positive
Mike,Churn Risk,Workout gear,Negative
```

### 2. **Campaign Configuration**
- **Campaign Type**: Choose Text Email, Image Email, or SMS
- **Tone**: Empathetic, Urgent, VIP Hype, Professional, or Witty
- **Brand Persona**: Luxury, Minimalist, Playful, or Eco-conscious
- **Custom Prompts**: Use templates or write your own instructions

### 3. **AI Generation & Review**
- Click **"Generate Copy"** to create A/B test variants
- Review generated content in the preview panels
- Edit copy directly or regenerate with different settings
- Export individual campaigns or bulk data

## 🎨 Campaign Examples

### Text Email Campaign
```
Subject: Your cart expires tonight, Sarah
Body: Hi Sarah, don't let those designer pieces slip away. 
Complete your order in the next 6 hours to secure your 
favorites before they're gone. Shop now →
```

### Image Email Campaign  
```
Subject: Exclusive VIP early access
Body: Check out our latest collection, Sarah.
[Product Image Placeholder]
CTA Button: Shop the Collection
Promotional Code: VIP20
```

### SMS Marketing
```
Message 1: Hey Sarah! Your cart misses you 😊
Message 2: Grab those designer pieces before they're gone → [link]
```

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **AI Engine**: Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite bundler

### Project Structure
```
src/
├── components/           # React components
│   ├── ui.tsx           # Preview and UI components
│   ├── icons.tsx        # SVG icon library
│   ├── Stepper.tsx      # Multi-step wizard
│   ├── Step1CustomerData.tsx
│   ├── Step2ConfigureCampaign.tsx
│   └── PreviewView.tsx
├── services/            # API integrations  
│   └── geminiService.ts # AI generation logic
├── types.ts            # TypeScript definitions
├── constants.ts        # Prompt templates & data
└── App.tsx            # Main application
```

### AI Prompt Engineering
The system uses sophisticated prompt engineering for high-quality, conversion-focused output:

- **Segment-Specific Psychology**: Different messaging strategies for VIP vs. Churn customers
- **CRO Best Practices**: Proven conversion optimization language patterns
- **Post-Processing Pipeline**: Automatic cleanup of formal corporate language
- **Schema Validation**: Structured JSON output with required marketing fields

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production  
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
```

### Code Quality Tools
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code linting and best practices
- **Prettier**: Consistent code formatting  
- **Vite**: Fast HMR and optimized builds

### Adding New Features

**New Campaign Type:**
1. Update `CampaignType` enum in `types.ts`
2. Add generation schema in `geminiService.ts`
3. Create preview component in `ui.tsx`
4. Update preview routing in `PreviewView.tsx`

**New Customer Segment:**
1. Add to `CustomerSegment` in `types.ts`
2. Update prompt templates in `constants.ts`
3. Add segment-specific psychology rules in `geminiService.ts`

## 📊 Performance & Optimization

### AI Generation Performance
- **Retry Logic**: Exponential backoff for API rate limits
- **Error Handling**: Graceful degradation for generation failures
- **Response Caching**: Client-side caching for repeated requests
- **Batch Processing**: Efficient multi-customer campaign generation

### Production Considerations
- **API Security**: Environment-based configuration
- **Rate Limiting**: Built-in respect for Gemini API limits
- **Error Boundaries**: React error handling and user feedback
- **Bundle Optimization**: Tree shaking and code splitting

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_GEMINI_API_KEY=your_key_here
```

### Netlify
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
# Configure environment variables in Netlify dashboard
```

### Self-Hosted with Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔒 Security & Best Practices

### Security Features
- ✅ Environment variables for API keys
- ✅ Client-side input validation and sanitization
- ✅ XSS protection via React's built-in escaping
- ✅ Content Security Policy ready
- ✅ No hardcoded credentials in source code

### Data Privacy
- Customer data stays in browser memory (not stored on servers)
- API calls are direct to Google (no proxy storing data)
- Export functionality for data portability
- No tracking or analytics without consent

## 🆘 Troubleshooting

### Common Issues

**"API Key Missing" Error**
```bash
# Ensure your .env file exists with:
VITE_GEMINI_API_KEY=your_actual_key_here

# Restart dev server after adding key
npm run dev
```

**"Server Error 500" During Generation**
- Verify your Gemini API key is valid and active
- Check you have remaining API quota  
- Review browser console for detailed error messages
- Try regenerating with different prompt settings

**Empty or Missing Email Previews**
- Ensure you're using the latest code version
- Check browser console for JavaScript errors
- Verify customer data contains all required fields
- Try refreshing the page and regenerating

**Port Already in Use**
```bash
# Kill existing processes
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Getting Support
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/JacobKayembekazadi/ltv-campaign-studio/issues)
- 💬 **Feature Requests**: [GitHub Discussions](https://github.com/JacobKayembekazadi/ltv-campaign-studio/discussions)
- 📖 **Documentation**: Check this README and inline code comments

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript types
4. Test thoroughly with different customer segments
5. Commit with descriptive messages: `git commit -m 'feat: add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request with detailed description

### Code Style Guidelines
- Use TypeScript for all new code
- Follow existing component patterns
- Add JSDoc comments for complex functions
- Test with multiple customer segments and campaign types
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful natural language generation
- **Tailwind CSS** for beautiful, responsive styling
- **React Team** for the incredible development framework
- **Vite** for lightning-fast development experience

---

**Built with ❤️ by [Jacob Kayembekazadi](https://github.com/JacobKayembekazadi)**

*Transforming marketing copy generation with AI-powered personalization*

---

> **Quick Links**: [Live Demo](https://ai.studio/apps/drive/12MtyTQiV24aPMLEHUxCLXBY9tkqlaOOX) • [Issues](https://github.com/JacobKayembekazadi/ltv-campaign-studio/issues) • [Discussions](https://github.com/JacobKayembekazadi/ltv-campaign-studio/discussions)
