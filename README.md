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
