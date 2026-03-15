# Contributing to IoT Warehouse Automation

First off, thank you for considering contributing to IoT Warehouse Automation! It's people like you that make this project better for everyone.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots, etc.)
- **Describe the behavior you observed** and what you expected
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List examples** of how it would work

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our code style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

## 💻 Development Setup

1. **Fork and clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/warehose-automation.git
   cd warehose-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Run linting**
   ```bash
   npm run lint
   ```

## 📝 Code Style Guidelines

### JavaScript/JSX

- **Use ES6+ features** (arrow functions, destructuring, async/await)
- **Follow ESLint rules** - run `npm run lint` before committing
- **Use meaningful variable names** - prefer clarity over brevity
- **Keep functions small** - each function should do one thing well
- **Add comments for complex logic** - explain the "why", not the "what"

### Import Order

Organize imports in the following order:
1. React imports
2. Third-party library imports
3. Local component imports
4. Local utility/hook imports
5. Asset imports

Example:
```javascript
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock } from "lucide-react";
import ProductList from "../components/receiver/ProductList";
import { useAuth } from "../hooks/useAuth";
import { formatDateTime } from "../utils/formatters";
```

### Component Structure

```javascript
import statements...

/**
 * Component description
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export default function ComponentName({ prop1, prop2 }) {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // ...
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // ...
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### CSS/Styling

- **Use CSS custom properties** for theme colors (variables in `index.css`)
- **Follow Tailwind conventions** where applicable
- **Keep styles organized** - group related styles together
- **Use meaningful class names** - prefer BEM-like naming

## 🧪 Testing Guidelines

- **Test all new features** before submitting a PR
- **Verify UI changes** on different screen sizes
- **Check Firebase integration** - ensure data syncs correctly
- **Test edge cases** - empty states, error conditions, etc.

## 📦 Commit Message Guidelines

Write clear, concise commit messages:

- **Use the present tense** ("Add feature" not "Added feature")
- **Use the imperative mood** ("Move cursor to..." not "Moves cursor to...")
- **Limit the first line to 72 characters**
- **Reference issues and pull requests** where applicable

Examples:
```
Add Bluetooth verification timeout handling
Fix product status not updating in receiver portal
Update README with ESP32 setup instructions
Refactor useRealtimeData hook to fix dependency warnings
```

## 🌿 Branch Naming

Use descriptive branch names:

- `feature/feature-name` - for new features
- `fix/bug-description` - for bug fixes
- `docs/what-changed` - for documentation updates
- `refactor/what-improved` - for code refactoring

## 🔍 Code Review Process

1. **Maintainers will review** your pull request
2. **Address feedback** by pushing new commits
3. **Once approved**, your PR will be merged
4. **Your contribution** will be credited in the release notes

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🎯 Priority Areas

We especially welcome contributions in these areas:

- **Documentation improvements** - tutorials, examples, better explanations
- **Test coverage** - unit tests, integration tests
- **Performance optimization** - faster load times, better caching
- **Accessibility** - ARIA labels, keyboard navigation
- **Mobile experience** - responsive design improvements
- **ESP32 firmware** - better BLE handling, power optimization

## 💡 Questions?

Feel free to:
- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing documentation and issues


Thank you for making IoT Warehouse Automation better! 🚀
