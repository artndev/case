## Quick Overview

The bento grid system based on [react-grid-layout (RGL)](https://github.com/react-grid-layout/react-grid-layout) and the communication between widgets:

- Widgets have different types that can be configured like widget-1 / widget-2.
- Widgets have different sizes that can be changed in real time.
- Widgets have a fluid and responsible layout that is monitoring cords of each widget on the board every second.
- Own styles and more is coming!

## Tech Stack

**Front-end:** Next.js + Turbopack (default), Tailwind CSS, shadcn/ui.
</br>
**Back-end:** Serverless API, PostgreSQL.

## Dependencies

- Install [Git](https://git-scm.com/) on your machine to clone the Github repository.
- Install [Node.js](https://nodejs.org/) on your machine to build and run the application locally.

## Clone Repository

Create a new directory where you want to deploy the application, then clone the Github repository into it:

```bash
git clone https://github.com/artndev/case.git .
```

Navigate to the project directory:

```bash
cd root
```

Change the working branch from _master_ (production branch) to _dev-public_ (public development branch) due to the specialties of the production and development environments:

```bash
git checkout dev-public
```

## Configure Environmental Variables

Open the _.env.local_ file located in the root directory and fill in the required environmental variables:

```env
# Table schemas can be found in src\schemas\production folder
# They are needed to create the same environment as mine

# Your projects Supabase credentials can be obtained at its page
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...

NEXT_PUBLIC_APP_URL="http://localhost:3000"

# UUIDv4 secrets used for access to secured destinations
STATE_SECRET=...
X_API_KEY=...
```

## Useful Links

- [UUIDv4 generator](https://www.uuidgenerator.net/version4)

## Run Application with Node.js

Use the command below to run the application with Node.js:

```bash
npm run dev
```

## Access Application

Once the application is ready, it will be available at http://localhost:3000/.
