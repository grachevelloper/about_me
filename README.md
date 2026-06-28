# Сайт Николая Грачева

The application is available at <http://fe_fullstack-app.localhost> in both supported development modes. Local HTTPS is not configured.

## BE and FE on the host

Create local environment files once:

```bash
cp be/.env.example be/.env
cp fe/.env.example fe/.env
```

Start PostgreSQL and nginx:

```bash
docker compose -f be/dev/db/compose.yaml up -d
```

Then start the applications in separate terminals:

```bash
cd be
npm run start
```

```bash
cd fe
npm run start
```

Stop the infrastructure with:

```bash
docker compose -f be/dev/db/compose.yaml down
```

## Complete Docker stack

From the repository root:

```bash
docker compose up --build
```

Stop it with `docker compose down`.

## Requirements

Docker must be running, and ports 80, 3000, 5173, and 5432 must be free. Names ending in `.localhost` resolve to the loopback interface in modern browsers, so `/etc/hosts` normally does not need to be changed.
