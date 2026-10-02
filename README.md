# Fresh installation

## 1. Prerequisites

Install Node.js **22.12 or newer**, npm, and Git. MySQL 8 is optional; SQLite is the default and needs no database server.

## 2. Download and install

```bash
git clone https://github.com/prinnsipeeeee/tawreed-platform-website.git
cd tawreed-platform-website
npm ci
cp .env.example .env
```

On Windows, copy `.env.example` to `.env` using your file manager or `Copy-Item .env.example .env` in PowerShell.

## 3. Configure the fresh installation

Edit `.env`:

```dotenv
APP_URL=http://localhost:3000
DB_PROVIDER=sqlite
DATABASE_URL=file:./data/tawreed.db
STORAGE_DRIVER=local
UPLOAD_DIR=./data/uploads
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=replace-with-your-own-strong-password
```

Choose your own admin email and a password with at least 12 characters and at most 72 UTF-8 bytes. Do not commit `.env`. The SQLite database and private uploads are created under `data/`.

For a fresh installation targeting hosted storage, configure `STORAGE_DRIVER=blob` and `BLOB_READ_WRITE_TOKEN` from a **private** Vercel Blob store. Vercel requires hosted MySQL; local SQLite and local upload files are for a persistent local/server filesystem.

## 4. Initialize the database

For the default SQLite installation:

```bash
npm run db:generate
npm run db:migrate
```

For a fresh MySQL installation, first create an empty database and application user with schema permissions:

```sql
CREATE DATABASE tawreed CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tawreed'@'localhost' IDENTIFIED BY 'choose-your-database-password';
GRANT ALL PRIVILEGES ON tawreed.* TO 'tawreed'@'localhost';
```

Then set these values in `.env` before running the same initialization commands:

```dotenv
DB_PROVIDER=mysql
DATABASE_URL=mysql://tawreed:your-url-encoded-database-password@localhost:3306/tawreed
```

Use your hosted MySQL hostname when applicable. Add `?ssl=true` to require TLS with certificate verification. Percent-encode special characters in the username/password. `localhost` on Vercel refers to its runtime, not your computer.

```bash
npm run db:generate
npm run db:migrate
```

## 5. Seed landing content and the administrator

```bash
npm run seed:landing-page-seeder-default
npm run seed:admin-account
```

The first command adds the landing defaults and initial Arabic translations. The second creates the administrator configured in `.env`. Rerunning either preserves existing edits and passwords.

## 6. Start locally

```bash
npm run dev
```

Open [the English landing page](http://localhost:3000/en), [the Arabic landing page](http://localhost:3000/ar), or [admin login](http://localhost:3000/admin/login). Sign in with the email and password you configured. Use the admin language switch for English/Arabic.

For a local production run instead:

```bash
npm run build
npm start
```
