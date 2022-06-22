<h1 align="center">
  <a href="https://www.docs.substrate.io">
    <img alt="Substrate Logo" src="https://github.com/substrate-developer-hub/substrate-docs/raw/main/static/img/sub.gif" width="70%" />
  </a>
</h1>
<h1 align="center">Substrate Docs</h1>
<h3 align="center">https://docs.substrate.io</h3>

<!-- Badges -->

<p align="center">
  <a href="https://app.netlify.com/sites/substrate-docs/deploys" alt="Netlify Status">
      <img src="https://api.netlify.com/api/v1/badges/42dec01f-3723-4828-9f01-45ac5b3c8a11/deploy-status" />
  </a>
	<br>
	<br>
	<a href="https://substrate.stackexchange.com/" alt="Substrate Stack Exchange">
        <img style= "height: 30px" src="https://img.shields.io/static/v1?style=for-the-badge&logo=stackexchange&label=Substrate&message=Stack%20Exchange&color=green" /></a>
	<br>
	<br>
    <a href="https://twitter.com/intent/follow?screen_name=substrate_io">
        <img src="https://img.shields.io/twitter/follow/substrate_io?style=social&logo=twitter"
            alt="follow on Twitter"></a>
</p>

# Contributing

Thank you for your interest in contributing to documentation for the Substrate development
framework. As a member of the community, you are invited and encouraged to contribute by submitting
issues, offering suggestions for improvements to existing content, adding review comments to
existing pull requests, proposing new content, or creating new pull requests to fix issues or
provide new content. If you have any further questions, please do not hesitate to reach out on our
[Substrate technical community channel](https://matrix.to/#/#substrate-technical:matrix.org)! We
would love to get to know you and your work!

## Working with `/docs` content

### URL paths

All `.md` files added to `./content/md/en/docs/` folder will output an URL path without the `/docs` prefix, eg.:

- `index.md` for a category page : `./content/md/en/docs/reference/index.md` &rarr; `/reference/`
- `<article-name>.md` for an article in its parent category `./content/md/en/docs/reference/glossary.md` &rarr; `/reference/glossary/`

You can use any structure nesting needed, there is no limit of depth.

### Media / Images

- use `./content/media/images/docs/` folder for images to be included in `/docs/*/*.md` files
- source images in `.md`: `/media/images/docs/path/to/your/image/<image>.ext`

### Navigation config

- Use file `./content/config/nav.yaml` to add items and linking to your content

This config file is used to generate sidebar menu where:

- menu is populated from the `menu` sequence (respecting order)
- menu supports three level hierarchy
- menu accepts external links, eg.: `https://substrate.io`

# Local Development

## Install

Navigate into your cloned local repo directory and install all dependencies.

```shell
yarn
```

**Configure environment variables**

Copy `example.env.development` and rename to `.env.development`

Config URL variables based on your preferable local setup. URL will be used for links generation between Substrate websites.

Default localhost port configuration:

```env
GATSBY_WEBSITE_URL=http://localhost:8100
GATSBY_DOCS_URL=http://localhost:8200
GATSBY_MARKETPLACE_URL=http://localhost:8300
GATSBY_CAREERS_URL=https://careers.substrate.io
```

**Start development server**

Navigate into your new site’s directory and use the following command to start the development server locally.

```shell
yarn develop
```
