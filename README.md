# Technical Interview Task for a Front-End Position

## Requirements

- 🔍 Create a server explorer web app using React and TypeScript
- 🔒 Implement login

```
POST https://playground.tesonet.lt/v1/tokens
{
    username: "tesonet",
    password: "partyanimal"
}
```

- 📋 Use the acquired token to fetch and display a servers list

```
GET https://playground.tesonet.lt/v1/servers
```

- ↕ Make servers list sortable by name and distance
- 🌐 App must work on all modern browsers
- 📱 App must also work well on mobile & tablet devices
- ✔️ App must be production-ready. We'd like you to demonstrate what a production-ready app means to you. No need to overcomplicate things, having the basics covered and listing some ideas for improvement in the documentation will suffice
- 🧪 App must have tests
- ♿️ App must be accessible

## Design requirements

Please follow the provided [design](https://www.figma.com/design/Vwv2xN7hYUADzIotUcSypF/Design-for-Front-End-Recruitment-Task?node-id=1-554) 👈. We're looking for accurate implementation of the design and attention to detail.

## Home task submission

As for the submission of the task, we fully understand that people have lives outside of work. Therefore, we do not expect home tasks to be submitted within a day or two. On average, we get them back within a week. But if more time is needed – simply inform your recruiter, so everyone is updated.

Once you have finished the task, please let your recruiter know. They will then assign a Nord Security developer to start the review process (which typically takes 1-2 days). After that, the recruiter will share full feedback with you.

We wish you all the best and look forward to meeting you for a technical discussion! Good luck!

---

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
