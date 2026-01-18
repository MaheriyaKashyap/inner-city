# Contributing to Inner City

Thank you for your interest in contributing to Inner City! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork: `git clone https://github.com/YOUR_USERNAME/inner-city.git`

2. **Set up your development environment**
   ```bash
   cd inner-city
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes locally

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Description of your changes"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Go to GitHub and create a Pull Request
   - Fill out the PR template
   - Wait for review

## 📝 Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Follow existing code style (no trailing commas, 2 spaces)
- **Naming**: Use camelCase for variables, PascalCase for components
- **Components**: Use functional components with hooks
- **Imports**: Group imports (React, third-party, local)

## 🧪 Testing

Before submitting a PR:

1. **Test locally**
   ```bash
   npm run dev
   ```

2. **Build check**
   ```bash
   npm run build
   ```

3. **Test Edge Functions** (if you modified them)
   ```bash
   node scripts/test-edge-functions.mjs
   ```

## 📋 Pull Request Guidelines

### PR Title Format
- `Add: Feature description`
- `Fix: Bug description`
- `Update: What was updated`
- `Refactor: What was refactored`

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots here
```

## 🐛 Reporting Bugs

1. **Check existing issues** - Make sure the bug hasn't been reported
2. **Create a new issue** with:
   - Clear title
   - Description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment (browser, OS, etc.)

## 💡 Suggesting Features

1. **Check existing issues** - Make sure the feature hasn't been suggested
2. **Create a new issue** with:
   - Clear title
   - Detailed description
   - Use cases
   - Mockups/wireframes (if applicable)

## 🏗️ Project Structure

```
inner-city/
├── components/       # Reusable UI components
├── screens/          # Screen components
├── services/         # API services
├── lib/              # Utilities
├── supabase/         # Backend (Edge Functions, migrations)
└── scripts/           # Utility scripts
```

## 🔐 Environment Variables

When contributing, you may need these environment variables:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- `VITE_TICKETMASTER_API_KEY` - (Optional) Ticketmaster API key
- `VITE_MAPBOX_ACCESS_TOKEN` - (Optional) Mapbox token
- `VITE_EVENTBRITE_API_TOKEN` - (Optional) Eventbrite token

Create a `.env.local` file with these variables for local development.

## 📚 Documentation

- Update README.md if you add new features
- Add JSDoc comments for new functions
- Update relevant documentation files

## ✅ Checklist Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Code is tested locally
- [ ] Build passes (`npm run build`)
- [ ] No console errors or warnings
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] PR description is complete

## 🎯 Areas for Contribution

- **Bug fixes**: Check the Issues tab
- **New features**: Discuss in Issues first
- **Documentation**: Improve guides and README
- **UI/UX**: Enhance the user interface
- **Performance**: Optimize code and queries
- **Testing**: Add tests for existing features

## 📞 Questions?

- Open an issue with the `question` label
- Check existing documentation in the repo
- Review closed issues for similar questions

## 🙏 Thank You!

Your contributions make Inner City better for everyone. Thank you for taking the time to contribute!
