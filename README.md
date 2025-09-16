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

1. Install Docker Desktop if you haven't already: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. On the root of your project, run `npx supabase start` to install the Supabase CLI globally.
   -- It should download the Supabase Docker image and start the local Supabase instance. It takes time, so be patient.
3. After the local Supabase instance is running, you’ll see connection details like:

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

4. Run `npx supabase functions serve` in another terminal window to start the local edge functions server. This will allow you to test edge functions locally. If the Edge functions rely on some environment variables, contact a developer to get them.

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

## Technologies Used

- [Next.js](https://nextjs.org/) - The React framework for building server-side rendered applications.
- [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that adds static types.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for styling.
- [ShadCN](https://ui.shadcn.com/) - A UI component library built on top of Radix UI and Tailwind CSS.
- [Supabase](https://supabase.com/) - An open-source Firebase alternative for backend services.