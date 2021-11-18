---
title: Site builder guidelines
slug: /community/02-site-guide
section: community
category:
keywords: contribute, style guide
---

This repository is used to build the documentation in the Substrate Developer Hub.
Before you modify the structure or content in any way, be sure you know the conventions to follow and how to avoid making changes that break the site.

## New pages and moving files

- The `i18n` folder is used for translation and for the rendering of the **navigation** and **elements** sections.
  Your `index.mdx` file's `title` is not the source for this.
- If you are adding or renaming a page, you **must** add it correctly in `src/components/DevNavMenu.tsx` and possibly the `gatsby-config.js` and `gatsby-node.js` files.

## Internal link conventions

- All `/rustdoc/` internal links must end with `.html` or `.html#some-ID`.
  Reasoning can be found in [#425](https://github.com/substrate-developer-hub/substrate-docs/issues/425).

## Check rendering images by clearing `.cache`

From time to time, the development server local cache becomes corrupted.
To fix this issue, run the following command:

```bash
yarn clean && yarn dev
```

**_PLEASE do this when reviewing a page before every PR_** - this ensures your state is what the build CI sees as well.

## New or updated `yarn` packages

From time to time, BREAKING changes happen in the `yarn` dependencies.
To fix this issue, run the following command:

```bash
git checkout main && git pull && yarn install && yarn clean && yarn dev
```

Change the branch above to your working brach of choice, or start a new on for a new PR based on latest `main` this way.

NOTE: Discard the `"private": false,` field that this steps adds to the `package.json` file.
