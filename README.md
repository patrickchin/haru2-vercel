# Streamlined Construction Management

## Getting Started

### Dependencies

- [nodejs](https://nodejs.org/) > 20.0.0
- [pnpm](https://pnpm.io/)
- [docker](https://www.docker.com/)

### Development

Clone this repository

```bash
git clone git@github.com:patrickchin/haru2-vercel.git
cd haru2-vercel
```

Copy the example env file which contains all the necessary enviroment variables
sufficient for most development. For file uploads, email and text sending more
variables need to be set.

```bash
cp .env.example .env.local
```

Install the node dependencies

```bash
pnpm install
```

Start the database in a local container

```bash
docker compose up
```

Push the schemas to your local database using [Drizzle ORM](https://orm.drizzle.team)

```bash
pnpm drizzle-kit push
```

Then finally, run the development server using

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The production server can be built and run using

```bash
pnpm build
pnpm start
```

### Database Development Workflow

Drizzle makes database changes a lot easier!

- After modifying `drizzle/schema.ts` file the changes are pushed to the database with the following commands:
  > [!CAUTION]
  > Very easy to delete data with this command, drizzle will warn

```bash
# to generate sql migration files from the schema changes
pnpm drizzle-kit generate

# to execute the migration files on the databse
pnpm drizzle-kit migrate
```

### The Deployment

We are running on vercel, and using their provided postgres server and blob store.

### Testing

```bash
pnpm playwright install
pnpm playwright test
```

We currently have very minor playwright testing on [Github Actions](https://github.com/patrickchin/haru2-vercel/actions)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
