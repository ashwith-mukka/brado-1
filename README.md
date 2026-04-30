# QuickCommerce ⚡

A full-stack MERN quick-commerce app (Zepto/Blinkit-style) with product browsing, cart, checkout, orders, authentication, and an admin dashboard.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS → Deployed on Vercel
- **Backend**: Node.js + Express + JWT → Deployed on Render
- **Database**: MongoDB Atlas

## Project Structure

```
quickcommerce/
├── client/          # React frontend (Vite)
├── server/          # Express backend
└── package.json     # Root scripts
```

## Local Development

```bash
# Install all dependencies
npm run install-all

# Run frontend + backend concurrently
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

## Environment Variables

See `server/.env.example` and `client/.env.example` for required variables.

