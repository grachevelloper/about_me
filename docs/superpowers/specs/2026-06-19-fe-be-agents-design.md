# FE and BE AGENTS.md design

## Goal

Create `be/AGENTS.md` and `fe/AGENTS.md` as detailed, directory-scoped operating instructions for coding agents. The files must reduce accidental architectural drift and make validation expectations explicit without presenting existing defects or isolated patterns as preferred architecture.

## Source of truth

Rules must be derived from the repository itself, in this priority order:

1. Executable configuration: `package.json`, TypeScript, ESLint, Jest, Webpack, Nest, Docker, and TypeORM configuration.
2. Repeated patterns in current modules and features.
3. Existing tests and recent repository changes.
4. Recommendations clearly labelled as recommendations when the codebase does not establish a single convention.

Known inconsistencies must be documented as sharp edges rather than copied into new code. Examples include missing or stale test/build configuration and alias differences between tools.

## Shared document structure

Both files will contain:

- scope and instruction precedence;
- a concise architecture and directory map;
- confirmed stack and runtime assumptions;
- package-manager and command conventions;
- mandatory workflow before, during, and after an edit;
- boundaries for focused changes and preservation of unrelated work;
- coding and naming conventions supported by configuration;
- validation matrices proportionate to the changed area;
- security and secret-handling rules;
- known project sharp edges;
- task-specific checklists and definition of done.

Requirements use normative language only when repository evidence is strong. Guidance for ambiguous areas uses non-normative language and asks the agent to follow the nearest coherent local pattern.

## Backend document

`be/AGENTS.md` will describe the NestJS 11 application, its module/process/shared boundaries, dependency injection, controller-service-repository responsibilities, TypeORM entities and relations, DTO validation, global `/api` prefix, cookie-based JWT authentication, global authorization guard, role guard, PostgreSQL migrations, and S3 integration.

It will include checklists for:

- adding or changing an endpoint;
- adding a module or provider dependency;
- changing an entity or relation;
- creating and applying a migration;
- changing authentication or authorization;
- writing unit or e2e tests.

Validation will distinguish commands that currently exist and work from declared commands whose supporting configuration is absent. Database-destructive operations and `synchronize: true` will be prohibited.

## Frontend document

`fe/AGENTS.md` will describe the React 19 application built by Webpack 5, the `entries`/`units`/`shared` organization, route composition, API wrappers, Axios interceptors and cookie credentials, TanStack Query server state, context-based application state, Ant Design, SCSS with `bem-cn-lite`, responsive behavior, i18next RU/EN resources, error boundaries, and optional MSW startup.

It will include checklists for:

- adding a route or page;
- adding a component;
- changing an API contract;
- adding a query or mutation and maintaining cache correctness;
- adding user-visible copy in both locales;
- changing styles or responsive behavior;
- adding mocks or tests.

Validation will use the actual `type-check`, `lint`, and `build` scripts. The absence of a frontend test runner will be explicit; MSW handlers will not be described as executable unit tests.

## Accuracy and maintenance

The documents will not claim that every existing file is exemplary. They will separate:

- enforced configuration;
- stable local conventions;
- known technical debt;
- preferred behavior for new work.

Every referenced path and script will be checked against the current tree. Final verification will scan for placeholders, stale command names, unsupported claims, and accidental edits outside the two requested files plus this design document.
