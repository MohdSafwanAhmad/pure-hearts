# Pure Hearts - Documentation

## Table of Contents

- [Project Folder Structure](#project-folder-structure)
- [Technologies Used](#technologies-used)
- [Initial Setup](#initial-setup---steps-should-be-done-in-order)
  - [Linting and Formatting](#linting-and-formatting)
  - [Install Dependencies](#install-dependencies)
  - [Set Up Environment Variables](#set-up-environment-variables)
  - [Set Up Supabase to run the project locally](#set-up-supabase-to-run-the-project-locally)
  - [Start the Development Server](#start-the-development-server)
- [Cycle of Development](#cycle-of-development)
- [Making changes to Supabase / Database](#making-changes-to-supabase--database)
  - [Syncing with the Cloud Database](#syncing-with-the-cloud-database)
  - [Making change on Supabase/Edge functions](#making-change-on-supabaseedge-functions)
  - [How database Seeding works for Development](#how-database-seeding-works-for-development)
  - [Good to know](#good-to-know)
- [Testing Email Functionality with Resend](#testing-email-functionality-with-resend)
- [Testing Stripe Payments](#testing-stripe-payments)

---

## Project Folder Structure

Understanding the folder structure will help you quickly locate files and understand how the project is organized. Here are the main directories and files:

```text
app/                       # Next.js App Router pages and layouts
   (auth)/                  # Authentication flows (login, signup, otp)
   (more)/                  # Public pages (about, contact, profile, etc.)
   (protected)/             # Protected pages (dashboard, etc.)
   admin/                   # Admin dashboard (public route, not protected)
   campaigns/               # Campaign-related pages
   donation/                # Donation flow pages
   organizations/           # Organization profile pages
   ...                      # Other feature folders
src/                       # Source code
   actions/                 # Server actions (business logic, mutations, etc.)
                            # See: https://www.youtube.com/watch?v=FPJvlhee04E
   api/                     # Data access layer (fetching, reading, writing data)
                            # See: https://nextjs.org/docs/app/getting-started/fetching-data#server-components
   components/              # Reusable React components
      global/               # Global/shared components (used across the app)
      ui/                   # UI primitives and Shadcn components
      page/                 # Page-specific components
      ...                   # Other domain-specific subfolders
                            # Components are organized by domain, feature, or usage. Use subfolders to keep global, UI, and page-specific components separate for clarity and maintainability.
   emails/                  # Email templates for Resend
   hooks/                   # Custom React hooks
   lib/                     # Utility functions, constants, Supabase clients
   schemas/                 # Zod schemas for validation
   types/                   # TypeScript types (database, actions, etc.)
supabase/                  # Supabase local setup
   config.toml              # Supabase configuration file (important for local setup)
   migrations/              # Database migration files
   seed.sql                 # SQL seed data for local development
   ...
public/                    # Static assets (images, etc.)
.env.example               # Example environment variables
README.md                  # Project documentation
package.json               # Project dependencies and scripts

```

## Technologies Used

- [Next.js](https://nextjs.org/) - The React framework for building server-side rendered applications.
- [Vercel](https://vercel.com/) - The deployment platform for hosting the application.
- [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that adds static types.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for styling.
- [ShadCN](https://ui.shadcn.com/) - A UI component library built on top of Radix UI and Tailwind CSS.
- [Supabase](https://supabase.com/) - An open-source Firebase alternative for backend services. It is the backend of this project, providing the database, authentication and storage.
- [Stripe](https://stripe.com/) - A payment processing platform used to handle donations and payments.
- [Resend](https://resend.com/) - An email sending service used to handle transactional emails such as donation receipts and account verification emails.

## Initial Setup - Steps should be done in order

This section is for setting up the project for the first time. If you have already done this, you can skip to the [Getting Started](#getting-started) section.

### Linting and Formatting

This project uses ESLint and Prettier for code quality and formatting. To set them up, follow these steps:

1. Install the Prettier and ESLint extensions in your code editor (e.g., VSCode).
2. Restart your code editor to ensure the extensions are activated.

### Install Dependencies

1. Go at the root of your project and run `npm install`

### Set Up Environment Variables

1. You can take a look at the file `env.example` to see which environment variables are needed.
2. **For local development**  
   Create a `.env.local` file at the root of your project with the values printed by `npx supabase start`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon key from terminal>
   ```

   ️ Never commit `.env.local`. It is meant for your machine only.

3. **For production (Vercel)**  
   You do **not** need a `.env` file in the repo. Instead, go to your Vercel project:

- Open **Project Settings → Environment Variables**
- Add the same keys, but use the **cloud Supabase project values** (`https://<project-ref>.supabase.co` and its `anon key`).
- Redeploy after saving changes.

### Set Up Supabase to run the project locally

The goal of running Supabase locally is to be able to develop the database, authentication, and edge functions without deploying them to the cloud. And when ready, we can deploy them to the cloud version of Supabase.

- Useful Documentation [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

1. Inside the root supabase folder add a folder named `public-images`. This is where the images uploaded to the `public-images` storage bucket will be stored locally. To get the images contact a developer.
2. Additionally, create a folder named `organization-verification-documents` inside the `supabase` folder. This is where the documents uploaded for organization verification will be stored locally. No need to get any files for this one.
3. Install Docker Desktop if you haven't already: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
4. On the root of your project, run `npx supabase start` to install the Supabase CLI globally.
   -- It should download the Supabase Docker image and start the local Supabase instance. It takes time, so be patient.
5. After the local Supabase instance is running, you’ll see connection details like:

   ```
   Started supabase local development setup.
   API URL: http://localhost:54321 -- The RESTful API endpoint for your database and edge functions.
   DB URL: postgresql://postgres:postgres@localhost:54322/postgres -- Never used it
   Studio URL: http://localhost:54323 -- The web interface to manage your database and authentication, just like the cloud version of Supabase.
   Mailpit URL: http://localhost:54324 -- A web interface to view the emails sent by your application during development. Good for login/signup email testing.
   anon key: eyJh......
   service_role key: eyJh......
   ```

   Copy the API URL and anon key into your `.env.local` file as shown above.

6. Run `npx supabase functions serve` in another terminal window to start the local edge functions server. This will allow you to test edge functions locally. If the Edge functions rely on some environment variables, contact a developer to get them.

### Start the Development Server

1. Run the development server with: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cycle of Development

Once you have completed the initial setup, you can follow this cycle for development:

1. Start Docker desktop if it's not already running.
2. Start the local Supabase instance by running `npx supabase start` in the terminal at the root of your project.
3. Start the local edge functions server by running `npx supabase functions serve` in another terminal window.
4. Start the development server with `npm run dev`.
5. When you to finish your development session:
   - Stop the local edge functions server by pressing `Ctrl + C` in the terminal window where it's running.
   - Stop the web development server by pressing `Ctrl + C` in the terminal window where it's running.
   - Stop the local Supabase instance by running `npx supabase stop` in any terminal window at root project path.

## Making changes to Supabase / Database

1. Run first `npx supabase db pull` to make sure your local database is up to date with the remote database
2. Update local database with Studio
3. Test it locally, then create migration file using `npx supabase db diff --schema public -f <migration_name>`
4. Apply migrations locally: `npx supabase db reset`. This recreates the DB, runs all migrations, and applies `supabase/seed.sql`.
5. Commit and push your migration files to Git. Other devs just need to pull your branch and run: `npx supabase db reset` to get the same schema.

### Syncing with the Cloud Database

Only when you are ready to deploy to the cloud:

1. Authenticate and link your project:
   ```
   npx supabase login
   npx supabase link --project-ref <PROJECT_REF>
   ```
   Find `<PROJECT_REF>` at the end of your dashboard URL: `https://supabase.com/dashboard/project/<PROJECT_REF>`
2. Pull to ensure your local schema matches cloud: `npx supabase db pull`.
3. Only when you are ready to deploy to the cloud, push your local migrations to the cloud: `npx supabase db push`

### Making change on Supabase/Edge functions

1. Make sure your local edge functions are working by running `npx supabase functions serve`
2. Make your updates to the edge functions in the `supabase/functions` directory
3. Test your edge functions locally
4. **When you want to push edge functions to production**
   - Run `npx supabase functions deploy <function_name>` to deploy the specific function to the remote Supabase instance
   - Make sure to add the environment variables needed for the edge functions in the Supabase **Cloud** dashboard under "Project Settings" > "API" > "Environment Variables"

### How database Seeding works for Development

1. The first time you run `npx supabase start`, or every time you run `npx supabase db reset`, the SQL file located at `supabase/seed.sql` is executed to populate the local database with initial data.
2. If you want to add more seed data, you can edit the `supabase/seed.sql` file and add your SQL insert statements.
3. After editing the `supabase/seed.sql` file, you can run `npx supabase db reset` to reset the local database and apply the seed data again.

### Good to know

- After you make change to the local database schema using supabase local studio instance, you **must** run the custom command `npx supabase database generate-types` to update the types in `src/types/database-types.ts` file. This file is used to have type safety when using Supabase client in the app. And also if not generated the types might be out of date causing errors when compiling the app on production.
- There is 2 types of supabase client used in the app.
  - The one in `src/lib/supabase/client.ts` is used for client side operations. It is used in component that necessitate interaction with supabase from the browser. Generally you use it very rarely.
  - On the server side `src/lib/supabase/server.ts` there 2 supabase clients.
    - One with authentication that is similar to the client one called `createAnonymousServerSupabaseClient`. This one is used very rarely to fetch data. It is only used to determine if the donor/organization is logged in or not on the server side.
    - One without authentication or cookies and has admin privileges called `createServerSupabaseClient`. This one is used for almost all server side operations. It is used in server components, API routes, and edge functions. This one should be used most of the time on the **server side only**. ⚠️ Never use this one on the client side ⚠️

## Testing Email Functionality with Resend

To test email sending functionality in **development**:

### Prerequisites

1. You need a Resend account. Sign up at [https://resend.com](https://resend.com) if you don't have one.
2. Navigate to the [API Keys page](https://resend.com/api-keys) in your Resend dashboard.
3. Create a new API key and copy it.
4. Add the following environment variables to your `.env.local` file:
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=onboarding@resend.dev
   RESEND_TESTING_TO_EMAIL=pure.heart.platform@gmail.com
   ```

### Configuration Details

- **RESEND_API_KEY**: Your Resend API key from the dashboard.
- **RESEND_FROM_EMAIL**:
  - For testing purposes, use `onboarding@resend.dev` (provided by Resend for development).
  - For production, you'll need to verify your own domain and use an email from that domain.
- **RESEND_TESTING_TO_EMAIL**:
  - **Development only** - Set this to `pure.heart.platform@gmail.com` when testing locally. This overrides the recipient and sends all emails to this address for testing purposes.
  - **Important**: Do NOT set this variable in production. In production, emails will be sent to the actual recipients (donors).

### Testing Email Flow

1. Trigger any action in the app that sends an email (e.g., donation receipts, signup confirmations).
2. Check the inbox of `pure.heart.platform@gmail.com` (or whichever email you set in `RESEND_TESTING_TO_EMAIL`).
3. In development mode, all emails will be sent to the testing email address regardless of the intended recipient.

### Production Setup

For production deployment:

1. Verify your domain in Resend:
   - Go to [Domains](https://resend.com/domains) in your Resend dashboard.
   - Add and verify your domain by adding the required DNS records.
2. Update your production environment variables in Vercel:
   - Set `RESEND_FROM_EMAIL` to an email from your verified domain (e.g., `noreply@yourdomain.com`).
   - **Do NOT set** `RESEND_TESTING_TO_EMAIL` in production - don't add it at all.

## Testing Stripe Payments

To test Stripe payment functionality in development:

### Prerequisites

1. You need a Stripe account. Sign up at [https://stripe.com](https://stripe.com) if you don't have one.
   - I created one using pure hearts gmail account
2. Click on the top left profile icon dropdown and switch to sandbox mode.
3. You will see on the home section on the right a section called **API Keys**.Copy the key called `Secret key` and add it to the following environment variables to your `.env.local` file:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```

### Running Stripe CLI for Webhooks

1. Install the Stripe CLI: [https://docs.stripe.com/stripe-cli/install](https://docs.stripe.com/stripe-cli/install)
2. Login to Stripe CLI:
   ```
   stripe login
   ```
3. Forward webhook events to your local server:
   ```
   npm run run-stripe-webhook
   ```
4. The CLI will output a webhook signing secret (starts with `whsec_`). Add it to your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. Keep the Stripe CLI running in a separate terminal while testing.

### Testing Payment Flow - Steps should be done in order

### Create a Stripe Account for the Organization

1. Before testing payments, ensure that the organization you are testing with has a connected Stripe account. You can create a test connected account by logging in as an organization on the app. Then navigate to the organization's page and click on "Setup payments" to create a connected Stripe account.

2. Follow the prompts to create a test connected account. You can use the test info (only available in testing mode) when stripe allows it.

3. Use the test document when possible and fill all the info to get your fake account verified.

4. After finishing there might some delay until the account is fully set up. You can check the status in the organization payment info table or you can just refresh the organization page until the alert about setting up payments is gone.

### Simulate Payments

Now you can pick any project under that organization and make a fake donation.

- To test card payments, use the following test card details:
  - **Card Number**: `4242 4242 4242 4242`
  - **Expiry Date**: Any future date (e.g., `12/34`)
  - **CVC**: Any 3 digits (e.g., `123`)
  - **ZIP Code**: Any valid zip code in canada

- You can also test other scenarios using different payment methods, like affirm. that is easy to test.
