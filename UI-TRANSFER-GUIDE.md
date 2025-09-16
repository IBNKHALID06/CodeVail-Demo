# CodeVail UI Transfer Guide

## 🎯 Essential Files to Copy to New Project

### 📁 **Core UI Components**
```
components/          # All UI components
├── ui/             # shadcn/ui components (buttons, inputs, etc.)
├── proctor/        # Proctor-specific components
├── *.tsx           # Main components (code-editor, interview-code, etc.)
```

### 📁 **App Structure (Next.js)**
```
app/                # Next.js app router pages
├── *.tsx           # All page components
├── globals.css     # Main CSS with Tailwind config
├── layout.tsx      # Root layout with providers
```

### 📁 **Source Code**
```
src/                # Core application logic
├── components/     # Additional components
├── contexts/       # React contexts (Auth, Theme, Notification)
├── pages/          # Page components
├── services/       # API services (WebRTC, etc.)
```

### 📁 **Configuration Files**
```
tailwind.config.js   # Tailwind CSS configuration
postcss.config.mjs   # PostCSS configuration  
tsconfig.json        # TypeScript configuration
next.config.mjs      # Next.js configuration
components.json      # shadcn/ui configuration
```

### 📁 **Styling**
```
styles/             # Additional styles
app/globals.css     # Main CSS file with custom utilities
```

### 📁 **Utilities & Hooks**
```
lib/utils.ts        # Utility functions
hooks/              # Custom React hooks
```

### 📁 **Assets**
```
public/             # Static assets (images, icons)
```

## 🚀 **Step-by-Step Transfer Process**

### 1. **Create New Project**
```bash
npx create-next-app@latest your-new-project --typescript --tailwind --app
cd your-new-project
```

### 2. **Install Required Dependencies**
```bash
# Core dependencies
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

# UI and styling
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate lucide-react

# Monaco Editor
npm install @monaco-editor/react monaco-editor

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Additional UI components
npm install sonner vaul input-otp react-day-picker date-fns recharts embla-carousel-react

# Routing (if needed)
npm install react-router-dom

# Theme support
npm install next-themes

# Development dependencies
npm install --save-dev autoprefixer
```

### 3. **Copy Core Files**
Copy these files/folders from CodeVail to your new project:

```bash
# Configuration files (replace existing ones)
tailwind.config.js
postcss.config.mjs  
tsconfig.json
next.config.mjs
components.json

# Core application code
components/         -> components/
src/               -> src/
app/globals.css    -> app/globals.css  
app/layout.tsx     -> app/layout.tsx
lib/               -> lib/
hooks/             -> hooks/
styles/            -> styles/
public/            -> public/

# App pages (optional - choose what you need)
app/login/         -> app/login/
app/candidate-dashboard/ -> app/candidate-dashboard/
app/interviewer-dashboard/ -> app/interviewer-dashboard/
app/interview/     -> app/interview/
app/call/          -> app/call/
app/results/       -> app/results/
```

### 4. **Update Package.json**
Add these scripts and dependencies to your new project's package.json:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 5. **Verify Import Paths**
Check that all import paths are correct in the new project:
- `@/components/*` imports
- `@/lib/*` imports  
- `@/hooks/*` imports
- Relative imports between components

## ⚠️ **Important Notes**

1. **Dependencies**: Make sure all required packages are installed
2. **Import Paths**: Verify `@/` path mapping in tsconfig.json
3. **Tailwind Config**: The custom CSS variables and utilities are crucial
4. **Context Providers**: Ensure ThemeProvider, AuthProvider, NotificationProvider are set up
5. **Monaco Editor**: Requires specific webpack configuration in next.config.mjs

## 🔧 **Common Issues & Solutions**

1. **Tailwind not working**: Ensure postcss.config.mjs includes autoprefixer
2. **Components not found**: Check import paths and component exports
3. **Styling issues**: Verify globals.css is imported in layout.tsx
4. **Monaco Editor**: Check webpack configuration in next.config.mjs

## 📦 **Minimal Transfer (Components Only)**

If you only want the UI components:
```
components/ui/      # shadcn/ui components
app/globals.css     # Styling
tailwind.config.js  # Tailwind configuration
lib/utils.ts        # Utility functions
```

This creates a reusable component library you can import into any project.
