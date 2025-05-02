# ⚖️ Lex Bot 🇨🇭

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## Prompts ideas

```
Voici un cas reçu pour un avis juridique:

[...]

Donne une liste de mots-clés très spécifiques et techniques, appropriés pour effectuer une recherche juridique pertinente dans les textes de la juridiction concernée. Limite-toi à énumérer les mots-clés sous forme de chaîne de caractères séparés par des virgules, sans donner de contexte.
```

## Requests examples

```
J'ai reçu un notification de résiliation de mon bail et je souhaite savoir
si je peux le contester car je ne souhaite pas quitter mon appartement.
Mon bail mentionne qu'il se reconduit automatiquement d'année en année et
que l'échéance est au 15 décembre avec 3 mois de préavis.
La notification ne mentionne pas de raison particulière pour la résiliation,
et je l'ai reçue le 20 septembre 2024 pour le 15 décembre prochain.
J'habite dans le canton de Vaud.
```

## Project Setup

### Pre-requisites

**Make sure nodejs is installed**

```sh
node -v
```

```sh
pnpm install
```

**Installing SSL self-signed certificates**

```sh
openssl req -x509 -out .certs/localhost.crt -keyout .certs/localhost.key -newkey rsa:2048 -nodes -sha256 -days 365 -subj "/CN=localhost"
sudo cp .certs/localhost.crt /usr/local/share/ca-certificates/.
sudo update-ca-certificates
```

Then in [brave](brave://settings/certificates):

- Under Authorities, click Import.
- Select the .crt file you created (e.g., .certs/localhost.crt).
- Choose to Trust this certificate for identifying websites.

**Register at [Mistral](https://mistra.ai) and create an API Key**

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
pnpm test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm build
pnpm test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

# Amplify day-to-day cheatsheet

| I want to…                                          | Local command                                  | What happens in CI after I push                                                 |
| --------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| **Add/modify data models**                          | Edit `amplify/data/*.ts` → save                | `ampx pipeline-deploy` updates DynamoDB tables & GraphQL resolvers              |
| **Add a Lambda function**                           | `npx create amplify function myFn`             | Function built & deployed; role & permissions auto-generated                    |
| **Add custom auth flows, groups, triggers**         | Edit `amplify/auth/resource.ts`                | Cognito user-pool updated with diff-based migration                             |
| **Store/rotate a secret**                           | _Amplify Console → Backend → Secrets_          | Secret injected into sandbox on next `npx ampx sandbox` and into builds via SSM |
| **Try changes quickly**                             | `npx ampx sandbox` (already running)           | Hot-reloads backend in <60 s                                                    |
| **Preview a PR**                                    | Push branch `feature/foo`                      | Amplify spins up isolated **feature/foo** backend + frontend preview URL        |
| **Run end-to-end tests** (you already have Cypress) | `pnpm cypress run` locally                     | Add a **test** phase in `amplify.yml`; fails the build if tests fail            |
| **Rebuild everything from scratch**                 | `npx ampx sandbox cleanup && npx ampx sandbox` | Delete/recreate sandbox stack                                                   |

# Amplify sandbox

```
npx ampx sandbox
```

```
npx ampx sandbox cleanup
```
