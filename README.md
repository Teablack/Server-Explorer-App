{
username: "tesonet",
password: "partyanimal"
}

## 🛠️ **Development Setup**

Node v 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Technical Stack:

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS Modules with custom properties
- **Testing**: Vitest, React Testing Library, jsdom
- **Code Quality**: ESLint, Prettier
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Native fetch API (no need to use axios etc)

---

## 🚀 **Production Readiness**

- TypeScript for full type safety with strict configuration
- Unit tests
- Accessibility
- Mobile-first design approach
- Graceful error handling and user feedback
- ESLint + Prettier

---

## 🚀 **Ideas for Future Improvements**

### UI & UX Improvements

- **Internationalization (i18n):** support for multiple languages
- **Dark mode**
- **Input sanitizing:** trim spaces, block unsupported symbols, normalize unicode
- **Pagination / virtualization** for handling thousands of servers
- Retry mechanism for HTTP errors (e.g., 500/503)
- Caching intentionally omitted because the response list may depend on user location (?) reconsider it

### Security & Auth

- Limit max login attempts
- Secure password reset form
- Dependabot for dependency/CVE updates
- Consider HttpOnly + Secure + SameSite cookies + CSRF token (requires server side/backend), instead of storing token in session storage (XSS risk)
- On logout: revoke refresh token

### Observability & Analytics

- Error monitoring: Sentry/Rollbar
- Product analytics: Google Analytics

### Testing & Automation

- E2E testing with Playwright/Cypress
- Pre-commit hooks with Husky (lint)
