# Substrate Docs `.md`

## Staging

https://substrate-docs-md.netlify.app

[![Netlify Status](https://api.netlify.com/api/v1/badges/b76a25aa-5622-4303-9ff7-7dc24ab64add/deploy-status)](https://app.netlify.com/sites/substrate-docs-md/deploys)

## Development

> :warning: **note**: This is an orphan branch (`main-md`) using a different setup than the production release. **Clone and install it into a new separate directory**.

### Install

1. Clone this repository:

```bash
#clone into folder <substrate-docs-md>
git clone https://github.com/substrate-developer-hub/substrate-docs.git substrate-docs-md
```

2. Navigate into your cloned local repo directory and install all dependencies.

```bash
yarn
```

3. Add environment variables:

```bash
cp example.env.development .env.development
```

### Start development server

Navigate into your new site’s directory and use the following command to start the development server locally.

```bash
yarn develop
```

# Working with `/docs` content

## URL paths

All `.md` files added to `./content/md/en/docs/` folder will output an URL path without the `/docs` prefix, eg.:

- `index.md` for a category page : `./content/md/en/docs/reference/index.md` &rarr; `/reference/`
- `<article-name>.md` for an article in its parent category `./content/md/en/docs/reference/glossary.md` &rarr; `/reference/glossary/`

You can use any structure nesting needed, there is no limit of depth.

## Media / Images

- use `./content/media/images/docs/` folder for images to be included in `/docs/*/*.md` files
- source images in `.md`: `/media/images/docs/path/to/your/image/<image>.ext`

## Navigation config

- Use file `./content/config/nav.yaml` to add items and linking to your content

This config file is used to generate sidebar menu where:

- menu is populated from the `menu` sequence (respecting order)
- menu supports three level hierarchy
- menu accepts external links, eg.: `https://substrate.io`
