# Backend agent instructions

## Scope and precedence

This file applies to everything under `be/`. Follow a more deeply nested `AGENTS.md` if one is added later. Direct user instructions override this file.

Use the repository as evidence, not as unquestionable design authority. The project has not been actively maintained for some time and may contain outdated decisions, accidental inconsistencies, and defects. In descending order of authority, follow direct user guidance, executable configuration, verified tests, repeated coherent patterns, and then the nearest valid implementation. Do not treat an isolated typo, stale script, commented code, repeated workaround, or known defect as a convention.

When a choice is genuinely debatable from an engineering perspective and the repository does not establish a clearly correct answer, stop and ask the user before encoding the choice in code or documentation. Present the concrete options and trade-offs. Do not silently infer the user's preferred architecture from legacy code.

## Non-negotiable repository safety

- Never create a Git commit unless the user explicitly asks for a commit in the current conversation. Approval to edit, fix, build, or finish is not approval to commit.
- Do not stage files unless the user asks. Do not amend, rebase, reset, clean, restore, or discard user changes without explicit authorization.
- Before editing, inspect `git status --short`. Existing changes belong to the user. Keep unrelated files and overlapping edits intact.
- Keep the change focused. Do not mix feature work with broad renaming, formatting, dependency upgrades, or cleanup.
- Never read, print, copy, or commit secrets from `.env`. Use `.env.example` only as a list of expected variable names, and keep example values non-sensitive.
- Do not run destructive database or storage operations without explicit approval. This includes dropping schemas, truncating tables, deleting buckets, and reverting shared migrations.
- Do not silence failing checks, weaken types, disable guards, or add blanket lint suppressions merely to make validation pass.

## Backend at a glance

The backend is a NestJS 11 HTTP API written in strict TypeScript and backed by PostgreSQL through TypeORM 0.3. Authentication uses JWTs in cookies. Attachments are stored through an S3-compatible service.

Runtime flow:

1. `src/main.ts` creates `AppModule`, installs `cookie-parser`, sets the global `/api` prefix, and listens on `BE_PORT` or port `3000`.
2. `src/app/app.module.ts` loads configuration, TypeORM, feature modules, the S3 module, and a global `AuthGuard` through `APP_GUARD`.
3. A controller maps transport input to a service call.
4. A service owns application logic and uses injected repositories or other exported services.
5. TypeORM maps entities to PostgreSQL; migrations define durable schema evolution.

Confirmed stack:

- Node.js 20 in `Dockerfile`;
- pnpm and TypeScript 5;
- NestJS 11, Express adapter, `class-validator`, and `class-transformer`;
- TypeORM 0.3, PostgreSQL 16, and `SnakeNamingStrategy`;
- cookie-based JWT auth with access and refresh tokens;
- AWS SDK S3 client;
- Jest 30, `ts-jest`, Nest testing utilities, and Supertest;
- ESLint flat config, Prettier, and `simple-import-sort`.

## Project map

```text
be/
├── src/
│   ├── main.ts                 # process bootstrap and HTTP setup
│   ├── app/                    # root Nest module and database options
│   ├── modules/                # domain features: users, todos, articles, etc.
│   ├── processes/auth/         # cross-domain authentication flow
│   ├── shared/                 # guards, decorators, storage, generic utilities
│   ├── config/                 # configuration factories
│   ├── migrations/             # ordered TypeORM schema migrations
│   ├── types/                  # shared domain and Express type augmentation
│   └── data-source-cli.ts      # TypeORM CLI data source
├── test/                       # Jest unit tests and e2e placeholder
├── dev/                        # local infrastructure examples
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── jest.config.js
```

Feature modules generally keep `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.entity.ts`, and `*.interface.ts` together. A nested subdomain, such as article tags or todo checklists, may have its own module. `processes/` is reserved for workflows that coordinate domains; do not move ordinary CRUD features there.

## Working method

Before changing code:

1. Read this file, `package.json`, and configuration relevant to the task.
2. Inspect the complete target module: module metadata, controller, service, entity/DTOs, consumers, tests, and migrations.
3. Search for the endpoint, entity, provider token, and shared type across both `be/` and `../fe/` before changing a contract.
4. Identify authentication, authorization, transaction, relation-loading, and migration implications.
5. Separate confirmed behavior from assumptions. Ask the user about engineering-significant ambiguity before implementation.

During the change:

- Prefer the smallest coherent edit that preserves public behavior unless the task changes that behavior.
- Match the nearest valid naming and file-placement pattern.
- Update producers and consumers of changed types together.
- Add or update tests for observable behavior, not private implementation details.
- Avoid opportunistic changes in migrations and generated files.

After the change:

- Review the diff for leaked secrets, unrelated formatting, accidental generated output, missing migrations, and unhandled contract changes.
- Run validation proportionate to the risk; use the matrix below.
- Report commands actually run and any checks that could not run. Never claim a check passed without current output.

## NestJS boundaries

### Modules and dependency injection

- Register repositories with `TypeOrmModule.forFeature([Entity])` in the module that owns them.
- Put controllers in `controllers`, providers in `providers`, and imported module dependencies in `imports`.
- Export a service only when another module consumes it. Import the exporting module rather than reconstructing or manually instantiating the provider.
- Use constructor injection. Do not call `new SomeService()` in application code.
- Before adding `forwardRef`, investigate the cycle and prefer a clearer boundary or shared abstraction. The current project does not establish `forwardRef` as a standard pattern.
- Add every new top-level feature module to `AppModule`; nested modules should be imported by their parent or actual consumer.

### Controllers

- Controllers own HTTP concerns: route decorators, params, query/body extraction, pipes, status codes, request user access, and response shape.
- Keep business rules and repository access in services.
- All routes are already prefixed with `/api`; controller paths must not repeat `api`.
- Use Nest pipes such as `ParseUUIDPipe` when the route contract requires them.
- Declare intentional status codes with `@HttpCode`, especially for non-default success codes and `204 No Content`.
- Return typed values. If the API contract changes, update the frontend API types and callers in the same task or explicitly report the cross-project work required.
- Avoid decorating one method with multiple HTTP verbs unless the behavior is intentionally identical and covered by tests. Existing occurrences are not a pattern to copy blindly.

### Services

- Services own application and persistence orchestration.
- Use injected `Repository<Entity>` instances through `@InjectRepository`.
- Throw Nest HTTP exceptions at established service boundaries for absent resources, invalid state, or unauthorized actions. Do not return ambiguous `undefined` for an endpoint that promises a resource.
- Keep counters and conditional updates atomic when possible; the existing query-builder updates for like counts demonstrate the intended direction.
- Load relations deliberately. Do not assume a relation is present merely because another query used `relations` or the entity currently marks it eager.
- Avoid non-null assertions after database reads unless absence was checked in the same control flow.
- For multi-write operations that must succeed or fail together, use an explicit transaction. Do not add a transaction around a single independent write without a reason.

## DTOs, validation, and contracts

- External input should have a dedicated DTO class when runtime validation is required. Interfaces and type aliases disappear at runtime and cannot be validated by Nest.
- Use `class-validator` decorators that match the actual contract, including optionality, bounds, formats, and nested validation where applicable.
- Do not assume validation is global: this application currently has no global `ValidationPipe` in `main.ts`. Some endpoints install pipes locally. When adding validation, wire the pipe explicitly or make a deliberate, tested global change.
- Do not place new request validation only on TypeORM entity fields. Persistence models and transport contracts have different responsibilities.
- Keep request DTOs, response types, entities, and frontend contract types distinct when their shapes differ.
- Whitelist or map user-controlled sort fields before interpolating them into query-builder expressions.
- Preserve the Axios interceptor behavior on the frontend: successful backend responses are consumed as response bodies rather than raw Axios responses.

## Entities and database rules

- Use the shared base classes in `src/shared/utils/entity.ts` for UUID and timestamp columns when their semantics fit.
- Keep TypeORM decorators explicit for column type, nullability, defaults, uniqueness, joins, cascade behavior, and delete behavior.
- In strict TypeScript mode, TypeORM-populated entity fields, including relations and database-defaulted columns, must either have a real TypeScript initializer or use definite assignment (`!`). Do not add required entity properties that trigger `ts(2564)` strict-property-initialization errors.
- Treat cascade and eager loading as high-impact choices. Add them only after checking write ownership, deletion behavior, query volume, and serialization.
- Follow the configured snake-case database naming strategy, but use explicit join/table names where the existing schema or API requires stability.
- Prevent unbounded or negative counters in database updates.
- Avoid N+1 queries: inspect relations and use repository options or query-builder joins intentionally.
- Never edit an already-applied migration to change production history. Add a new forward migration unless the user explicitly confirms the earlier migration is unpublished and may be rewritten.
- Every entity/schema change requires a migration in the same change. Review both `up` and `down` paths for data loss and reversibility.
- Do not generate a migration until the database connection and target schema are understood. Inspect generated SQL; generated output is not automatically correct.

## Authentication and authorization

- `AuthGuard` is global through `APP_GUARD`. New endpoints are private by default.
- Use `@Public()` only for routes that genuinely require unauthenticated access. Do not add it to bypass a failing auth test.
- `req.user` is populated from the verified access-token payload. Treat client-supplied user IDs as untrusted; ownership-sensitive actions should derive identity from the authenticated request where appropriate.
- Role restrictions use `@Roles(...)` and `RolesGuard`. Check guard ordering and authenticated-user availability when modifying these paths.
- Access and refresh tokens are stored in cookies. Preserve `httpOnly`, environment-sensitive `secure`, `sameSite`, expiry, and path behavior unless the task explicitly redesigns auth.
- Never log tokens, cookie headers, passwords, JWT secrets, refresh-token hashes, or complete auth payloads.
- New password flows must hash credentials and use timing-safe verification. The existing direct password comparison is technical debt, not a convention to reproduce.
- Ensure user responses never serialize password hashes or other secret fields. Use explicit response mapping when necessary.
- Auth changes require negative-path tests: missing cookie, invalid/expired token, revoked refresh token, insufficient role, and cross-user ownership where relevant.

## S3 and attachments

- Access S3 through `S3Module`/`S3Service`; do not instantiate SDK clients throughout feature code.
- Validate attachment ownership, entity type, MIME type, size, and object key at the API boundary appropriate to the task.
- Keep database metadata and object-storage operations consistent. For partial-failure scenarios, define cleanup or compensation behavior.
- Never expose S3 credentials. Public URLs may use `S3_PUBLIC_DOMAIN`; secrets must come from configuration.
- Deletion is irreversible external state. Tests should mock S3 calls; manual deletion against a real bucket requires explicit user approval.

## Errors, logging, and observability

- Use specific Nest exceptions with stable, non-sensitive messages.
- Do not leak SQL, stack traces, token data, credentials, or internal object keys to clients.
- `console.warn` and `console.error` are allowed by lint; ordinary `console.log` produces a warning. Prefer Nest `Logger` for new persistent server logging.
- Log enough context to diagnose an operation, but redact personal and secret data.
- Do not catch an error only to suppress it. Re-throw, translate it, or implement a documented compensation path.

## Imports, TypeScript, and formatting

- TypeScript uses `strictNullChecks`, `noImplicitAny`, `strictBindCallApply`, and `noFallthroughCasesInSwitch`.
- Prefer the configured aliases such as `@/articles/*`, `@/users/*`, `@/shared/*`, and `@/types/*` for cross-area imports; use relative imports within a tightly related local folder.
- Verify aliases against `tsconfig.json`. The ESLint alias for `@/todos/*` is currently stale and points at users; do not use that setting as architectural evidence.
- Use `import type` when an import exists only for types and local style permits it.
- Let `simple-import-sort` determine import/export ordering.
- The repository contains inconsistent historical spacing. Do not reformat untouched files. For modified code, follow ESLint/Prettier output rather than hand-formatting large areas.
- Avoid new `any`, unchecked casts, and non-null assertions. Existing lint relaxations are migration tolerance, not encouragement.
- Await promises or deliberately handle them. The lint rule for floating promises is only a warning, but unhandled async work is still a correctness issue.

## Tests

- Unit tests live under `test/` and use Nest `TestingModule`, repository tokens, and Jest mocks.
- Service tests should cover success, not-found/invalid-state behavior, dependency interaction, and persistence calls.
- Controller tests should cover request mapping, guards/decorators where relevant, status behavior, and service delegation.
- Mock repositories with `getRepositoryToken(Entity)` and mock external S3/JWT dependencies. Do not connect unit tests to real infrastructure.
- Prefer behavior assertions. Avoid assertions coupled only to private helper structure.
- Do not write tautological mock pass-through tests: if a dependency mock is configured to return a value, do not merely assert that an unchanged value is returned by the subject. Such an assertion is useful only when the subject transforms, filters, composes, validates, or otherwise gives the result additional observable semantics. Test meaningful dependency parameters and interactions instead.
- Add regression coverage before or with a bug fix.
- The declared `test:e2e` script references `test/jest-e2e.json`, which is absent. Do not report e2e tests as available until the config is added or the script is corrected.

## Commands

Run commands from `be/` unless noted.

```bash
pnpm install
pnpm run start:dev
pnpm run build
pnpm run test
pnpm run test -- --runInBand
pnpm run test -- test/entities/todos/todos.service.spec.ts --runInBand
pnpm run test:cov
```

Mutating quality commands:

```bash
pnpm run lint
pnpm run format
```

`lint` includes `--fix`, and `format` writes files. Run them only when automatic changes are intended, then inspect the complete diff. For a non-mutating lint check, use:

```bash
pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
```

Migration scripts declared by `package.json`:

```bash
pnpm run migration:run
pnpm run migration:generate -- src/migrations/<descriptive-name>
pnpm run migration:create -- src/migrations/<descriptive-name>
pnpm run migration:revert
```

Before using a migration command, confirm environment variables, inspect its composed `npm run typeorm` invocation, and verify it targets the intended database. `migration:revert` changes database state and requires explicit user authorization.

## Validation matrix

| Change                      | Minimum validation                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| Markdown/instructions only  | `git diff --check` and manual path/command verification                                    |
| Pure TypeScript helper/type | targeted Jest test, non-mutating ESLint, `pnpm run build`                                  |
| Controller/service behavior | targeted controller/service tests, non-mutating ESLint, build                              |
| Entity/repository/query     | targeted tests, migration review, build; integration test when infrastructure is available |
| Auth/roles/cookies          | targeted positive and negative tests, build, manual contract review                        |
| S3/attachments              | mocked unit tests, build, failure/cleanup-path review                                      |
| Cross-project API contract  | backend tests/build plus frontend type-check/build                                         |

If a command fails because of an existing unrelated issue, capture the exact failure and distinguish it from regressions introduced by the current diff.

## Known sharp edges

Do not silently normalize these into new code:

- `test:e2e` references a missing Jest e2e config.
- `data-source.ts` and `data-source-cli.ts` duplicate connection options and use different runtime contexts; inspect both for migration work.
- The entity glob in `src/app/data-source.ts` should be verified against compiled output before relying on it.
- Global request validation is not configured; validation coverage varies by endpoint.
- Some DTOs are interfaces, some validation decorators are placed on entities, and some controller-local DTOs exist. Prefer an explicit runtime DTO for new external input.
- Some controllers repeat `AuthGuard` even though it is global. Do not remove or add guards mechanically; verify effective authorization.
- Existing auth code compares passwords directly. Treat this as a security defect.
- Existing source contains spelling mistakes and route/behavior inconsistencies. Preserve public compatibility unless the task explicitly fixes them; do not copy the mistakes into new names.
- Docker Compose environment-file paths and exposed ports should be validated before using the full stack.

## Task checklists

### New or changed endpoint

- [ ] Route, method, status code, and response shape are explicit.
- [ ] Input has appropriate pipes and runtime validation.
- [ ] Authentication is private by default; any `@Public()` is justified.
- [ ] Role and ownership checks are enforced server-side.
- [ ] Controller delegates business logic to a service.
- [ ] Service handles absence and invalid state with stable exceptions.
- [ ] Frontend consumers and shared contract types are updated.
- [ ] Success and relevant failure paths are tested.

### New module or provider dependency

- [ ] Entity repositories are registered with `forFeature`.
- [ ] Providers/controllers are registered once in the owning module.
- [ ] Services are exported only for real consumers.
- [ ] Consumer modules import the provider's module.
- [ ] No avoidable circular dependency is introduced.
- [ ] Top-level module is connected to `AppModule`.

### Entity or relation change

- [ ] Nullability, defaults, uniqueness, indexes, cascades, and delete behavior are deliberate.
- [ ] Query and serialization behavior is checked for affected relations.
- [ ] A forward migration accompanies the entity change.
- [ ] Generated SQL is reviewed for locks and data loss.
- [ ] `down` behavior is reviewed; irreversible steps are documented.
- [ ] Backend tests and frontend contract types are updated.

### Authentication or authorization change

- [ ] Cookie/token lifecycle and revocation remain coherent.
- [ ] Secrets and credentials never enter responses or logs.
- [ ] Public/private route status is explicit.
- [ ] Roles and resource ownership are tested separately.
- [ ] Missing, invalid, expired, and revoked-token paths are covered.
- [ ] Cross-user access is denied where appropriate.

## Definition of done

- The requested behavior is implemented with no unrelated edits.
- Module wiring, runtime validation, authorization, persistence, and external-storage effects are correct for the changed area.
- Tests cover the changed behavior and meaningful failure paths.
- Applicable validation passes, or exact pre-existing blockers are reported.
- The final diff contains no secret, debug output, broad suppression, generated junk, or accidental formatting churn.
- Documentation and frontend contracts are updated when behavior changes.
- Nothing is staged or committed unless the user explicitly requested it.
