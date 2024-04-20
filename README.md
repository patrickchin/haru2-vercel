# Next.js + PostgreSQL Auth Starter

This is a [Next.js](https://nextjs.org/) starter kit that uses [NextAuth.js](https://next-auth.js.org/) for simple email + password login, [Drizzle](https://orm.drizzle.team) as the ORM, and a [Neon Postgres](https://vercel.com/postgres) database to persist the data.

## Getting Started

### Dependencies

- [nodejs](https://nodejs.org/) > 20.0.0
- [pnpm](https://pnpm.io/)

### Development

Clone this repository
```bash
git clone git@github.com:patrickchin/haru2-vercel.git
```
Copy the example env file, and fill out all the values
```bash
cp .env.example .env.local
```
Install the node dependencies
```bash
pnpm install
```
Then run the development server using
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

- After modifying `drizzle/schema.ts` file the changes are pushed to the database with:
> [!CAUTION]
> Very easy to delete data with this command, drizzle will warn 
```bash
pnpm drizzle-kit push:pg
```
- After modifying the database via other means, these changes are pulled into the code with:
```bash
pnpm drizzle-kit introspect:pg
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
