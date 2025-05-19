# ⚖️ Judicia 🇨🇭

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
Une entreprise suisse basée à Zurich a transféré des données personnelles de ses clients vers un prestataire basé en Floride. Un client suisse s'est plaint que ses données aient été utilisées à des fins de marketing sans consentement explicite. L’affaire soulève la question de la conformité au droit suisse sur la protection des données et au principe du transfert international.
```

```
Un ingénieur software demandeur d'emploi de nationalité allemande affirme que sa candidature a été rejetée par une entreprise semi-publique suisse en raison de sa nationalité. Il invoque une discrimination contraire à l’accord sur la libre circulation des personnes et aux dispositions suisses sur l’égalité de traitement.
```

```
Une PME suisse accuse une entreprise concurrente d’avoir copié un procédé breveté dans le domaine de la chimie verte, utilisé dans toute la Suisse. Elle saisit le Tribunal fédéral des brevets pour violation de brevet, demandant l’interdiction de vente et des dommages-intérêts.
```

```
Un citoyen suisse voit ses données fiscales compromises après une cyberattaque sur un portail cantonal de déclaration en ligne. Il intente une action contre la Confédération, affirmant une responsabilité subsidiaire pour défaut de surveillance ou standards insuffisants de cybersécurité imposés aux cantons.
```

```
Un thérapeute en médecine complémentaire attaque une décision de l’Office fédéral de la santé publique (OFSP) lui refusant l'autorisation de facturer via l’assurance de base (LAMal). Il estime que la décision viole son droit de pratiquer et demande au Tribunal administratif fédéral d’annuler la décision.
```

```
Un cadre supérieur d’une banque zurichoise est poursuivi pour avoir vendu des actions la veille d’une annonce de fusion confidentielle. La FINMA a transmis le dossier au Ministère public de la Confédération pour soupçon de délit d’initié, en application de la Loi sur les bourses (LBVM).
```

```
Un ressortissant érythréen, débouté de sa demande d’asile, fait recours contre sa mise en détention en vue du renvoi, décidée par le SEM. Il soutient que son renvoi est impossible et que sa détention viole l’article 5 CEDH et la jurisprudence fédérale sur la proportionnalité.
```

```
Une société suisse importe des pièces électroniques de Chine via un entrepôt sous douane à Bâle. L’Administration fédérale des douanes lui inflige une amende pour fausse déclaration de valeur. L’entreprise fait recours en affirmant avoir suivi les instructions d’un transitaire autorisé.
```

```
Un objecteur de conscience témoigne que le refus de son admission au service civil, malgré ses convictions religieuses pacifistes, viole sa liberté de conscience garantie par la Constitution fédérale.
```

```
Un journaliste demande à l’OFEV l’accès à un rapport interne sur des risques environnementaux liés à une entreprise de recyclage. Le département refuse en invoquant des raisons de confidentialité industrielle. Le journaliste saisit le Préposé fédéral à la transparence puis fait recours devant le Tribunal administratif fédéral.
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
