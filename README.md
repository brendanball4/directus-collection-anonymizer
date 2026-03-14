# Collection Data Anonymizer

Directus module that anonymizes collection data by replacing real values with fake but realistic ones (names, emails, phones, addresses, etc.). Handy for scrubbing dev/staging databases.

**Requires Directus 10.10+**

## Setup

Directus needs a folder with `package.json` and `dist/` inside.

```
extensions/
└── collection-data-anonymizer/
    ├── package.json   # required
    └── dist/         # required
```

**Option A — Clone into extensions, then build:**

```bash
cd /path/to/directus/extensions
git clone <repo-url> collection-data-anonymizer
cd collection-data-anonymizer
npm install
npm run build
```

Restart Directus.

**Option B — Build elsewhere, then copy:**

```bash
git clone <repo-url> collection-data-anonymizer
cd collection-data-anonymizer
npm install
npm run build
```

Copy the `collection-data-anonymizer` folder (with `package.json` and `dist/` inside) into your Directus `extensions/` directory. Restart Directus.

## Usage -- On Directus Web App

1. Open the **Data Anonymizer** module in the sidebar. If you are not able to see it in the sidebar, go to settings > settings > modules, and select the Data Anonymizer and make sure to save. It will appear on the sidebar.
2. Pick one or more collections. You are able to multi-select using ctrl, or cmd. Else it will just select one collection at a time.
3. Check the fields you want to anonymize and choose a type for each (first name, email, phone, etc.).
4. Check the destructive-action warning.
5. Hit **Run anonymization**.

**Heads up:** This permanently overwrites data. Use it only on local dev or staging... never production.

## Anonymizer Types

First name, last name, full name, email, phone, company, address, city, state, province, country, UUID, generic text. All fake data is North America–centric (US/Canada cities, states, provinces).

## Development

```bash
npm run dev   # watch mode
npm run build # production build
```
