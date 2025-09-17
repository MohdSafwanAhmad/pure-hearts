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
2. Create a `.env` file at the root of your project for the moment add nothing to it.

### Set Up Supabase to run the project locally

The goal of running Supabase locally is to be able to develop the database, authentication, and edge functions without deploying them to the cloud. And when ready, we can deploy them to the cloud version of Supabase.

- Useful Documentation [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

1. Inside the root supabase folder add a folder named `public-images`. This is where the images uploaded to the `public-images` storage bucket will be stored locally. To get the images contact a developer.
2. Install Docker Desktop if you haven't already: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
3. On the root of your project, run `npx supabase start` to install the Supabase CLI globally.
   -- It should download the Supabase Docker image and start the local Supabase instance. It takes time, so be patient.
4. After the local Supabase instance is running, you can access the different services supabase is running locally - There url should be printed in the terminal.
   It should like that:

```
Started supabase local development setup.
API URL: http://localhost:54321 -- The RESTful API endpoint for your database and edge functions.
DB URL: postgresql://postgres:postgres@localhost:54322/postgres -- Never used it
Studio URL: http://localhost:54323 -- The web interface to manage your database and authentication, just like the cloud version of Supabase.
Mailpit URL: http://localhost:54324 -- A web interface to view the emails sent by your application during development. Good for login/signup email testing.
anon key: eyJh......
service_role key: eyJh......
```

4. In your environment variables file `.env`, set the:

   - `NEXT_PUBLIC_SUPABASE_URL` to the local Supabase URL printed in the terminal after running `npx supabase start`:
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the anon key that is also printed in the terminal after running `npx supabase start`

5. Run `npx supabase functions serve` in another terminal window to start the local edge functions server. This will allow you to test edge functions locally.
   - If the Edge functions rely on some environment variables, contact a developer to get them.

### Start the Development Server

1. Run the development server with: `npm run dev`
   - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

### Making change on Supabase/Database

1. Run first `npx supabase db pull` to make sure your local database is up to date with the remote database
2. Update local database using studio
3. Test it locally
4. Create migration file using `npx supabase db diff --schema public -f <migration_name>`
5. Apply migration to local database using `npx supabase db reset`
6. **When you want to push migration file to production**
   - Run `npx supabase db pull` to make sure your local database is up to date with the remote database
   - Create migration file using `npx supabase db diff --schema public -f <migration_name>`
   - Test migration file by running `npx supabase db reset`
   - If everything works as expected run `npx supabase db push` to push migration to remote database

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
