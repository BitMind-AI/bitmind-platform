# BitMind Platform Demo

This is a demo of the BitMind platform. It is a simple web application that allows users to create new projects and provision compute resources for them.

## Getting Started

Clone the repository and install the dependencies.

```bash
npm install
```

Copy the `.env.example` file to `.env` and fill in the required environment variables.

```bash
cp .env.example .env
```

**NOTE:** To get started with the test supabase project, you can keep the supabase URL and key as is. It's configured to use test Google and GitHub OAuth apps for authentication.

Start the proxy server for Coder.

```bash
npm run proxy
```

Start the development server.

```bash
npm run dev
```

Open the URL shown in the terminal to view the site.

Building the app.

```bash
npm run build
```

Preview the production build.

```bash
npm run preview
```
