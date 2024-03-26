# BitMind Platform

BitMind is a platform that serves as a bridge connecting users to various platforms offering rewards for computational contributions, with Bittensor being a prime example. By providing seamless access to these platforms, BitMind empowers users to monetize the valuable outputs of their computing tasks.

## Getting Started

Clone the repository and install the dependencies

```bash
npm install
```

Copy the `.env.template` file to `.env` and fill in the required environment variables

```bash
cp .env.template .env
```

**NOTE:** To get started with the test supabase project, you can keep the supabase URL and key as is. It's configured to use test Google and GitHub OAuth apps for authentication.

Start the development server

```bash
npm run dev
```

**NOTE:** Open the URL shown in the terminal to view the site.

Build the app

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

## Development Notes

### CORS Proxy

To address CORS issues during development, you can run a CORS proxy using the provided npm script

```bash
npm run proxy
```

## Infrastructure/Setup

### Overview

Additional documentation can be found in the `docs` directory:

- [Supabase Docs](docs/supabase.md)
- [Coder Docs](docs/coder.md)

The BitMind platform consists of several components working together to provide a seamless experience for users to access computational platforms, manage workspaces, and interact with Bittensor. Below is an overview of the project setup:

1. **BitMind Platform: React SPA with Supabase**

   - The main component of the project is a React Single Page Application (SPA) that serves as the user interface.
   - User authentication and database management are handled using Supabase, a platform providing authentication, database, and real-time features.

2. **External Server**
   - An external server, built on [coder](https://github.com/coder/coder), is used to provide workspaces to users.

### How It Works

1. **User Creation and Authentication**

   - When a user is created, a corresponding user account is also created on the Coder server.
   - An API key is generated and returned, which is stored in the "profiles" table in Supabase.

2. **API Key Retrieval and Usage**

   - With Supabase's authentication hooks (beta), the API key is retrieved and passed along to any calls made to the Coder server.
   - This allows users to access and manage workspaces provisioned by the Coder server seamlessly.

3. **Integration with Bittensor**
   - Users can utilize the `btcli-api` wrapper from [bitmind-ai/btcli](https://github.com/bitmind-ai/btcli-api) to create wallets and submit models directly to Bittensor.
