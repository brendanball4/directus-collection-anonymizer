# Collection Data Anonymizer

Directus module that anonymizes collection data by replacing real values with fake but realistic ones (names, emails, phones, addresses, etc.). Handy for scrubbing dev/staging databases.

**Requires Directus 10.10+**

## Setup

```bash
npm install
npm run build
```

Drop the extension into your Directus `extensions` folder (or use `npm run link` if you're linking locally).

## Usage

1. Open the **Data Anonymizer** module in the sidebar. If you are not able to see it in the sidebar, go to settings > settings > modules, and select the Data Anonymizer and make sure to save. It will appear on the sidebar.
2. Pick one or more collections. You are able to multi-select using ctrl, or cmd. Else it will just select one collection at a time.
3. Check the fields you want to anonymize and choose a type for each (first name, email, phone, etc.).
4. Check the destructive-action warning.
5. Hit **Run anonymization**.

**Heads up:** This permanently overwrites data. Use it only on local dev or staging... never production.

## Anonymizer Types

First name, last name, full name, email, phone, company, address, city, state, province, country, UUID, generic text. All fake data is North America–centric (US/Canada cities, states, provinces).

## Dev

```bash
npm run dev   # watch mode
npm run build # production build
```
