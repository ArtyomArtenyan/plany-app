# Plany | Modern Project Management

Plany is a beautiful, intuitive, and responsive Kanban-style project management application built with Next.js 15, Supabase, and Clerk.

![Plany Logo](public/plany-logo.svg)

## 🚀 Live Demo

[Visit Plany](https://plany-app-amber.vercel.app/)

### 🔑 Portfolio Demo Account

For recruiters and visitors who want to test the full functionality without creating an account:

- **Email:** `demo@test.com`
- **Password:** `Plany123.`

## ✨ Features

- **Intuitive Kanban Board:** Drag and drop tasks between columns (To-Do, In Progress, Done, etc.).
- **Global Dashboard:** Manage multiple boards from a single interface.
- **Priority Management:** Categorize tasks by High, Medium, and Low priority with visual filtering.
- **Responsive Design:** Fully optimized for Desktop, Tablet, and Mobile devices.
- **Skeleton Loading:** Smooth perceived performance with modern skeleton loaders.
- **Secure Authentication:** Managed by Clerk with social login support.
- **Real-time Persistence:** Data stored and managed via Supabase.

## 🛠 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Database:** [Supabase](https://supabase.com/)
- **Auth:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Drag & Drop:** [@dnd-kit](https://dnd-kit.com/)
- **Icons:** [Lineicons](https://lineicons.com/)

## 🏁 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/plany-app.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (.env.local):
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📝 License

This project is licensed under the MIT License.
