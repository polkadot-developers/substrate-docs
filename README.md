<h1 align="center">
  <a href="https://www.substrate.io">
    <img alt="Substrate Logo" src="static/img/sub.gif" width="70%" />
  </a>
</h1>
<h1 align="center"> Substrate Developer Hub </h1>
<h3 align="center"> https://docs.substrate.io/ </h3>
<br/>

<!-- Badges -->

[![Netlify
Status](https://api.netlify.com/api/v1/badges/65f522fe-eefa-434b-bdb3-6345d363c177/deploy-status)](https://app.netlify.com/sites/ecstatic-babbage-c109a3/deploys)
![linkcheck
workflow](https://github.com/substrate-developer-hub/substrate-docs/actions/workflows/check-links.yml/badge.svg)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](v3/docs/00-style-and-contributor-guidelines/a-contributor-guidelines/index.mdx)
[![Matrix](https://img.shields.io/matrix/frontier:matrix.org)](https://matrix.to/#/#substrate-technical:matrix.org)

<!-- Description -->

This repository serves as the **developer hub** for the **[Substrate](https://substrate.io)** blockchain
framework. It includes Substrate documentation, how-to guides, tutorials, and more! The content is written in [MDX](https://mdxjs.com/) format (an extension of
[markdown](https://www.markdownguide.org/)), processed by [Gatsby](https://www.gatsbyjs.com/), and
hosted on the Substrate Developer Hub: https://docs.substrate.io/ .

## Contributing

Thank you for your interest in contributing to documentation for the Substrate development
framework. As a member of the community, you are invited and encouraged to contribute by submitting
issues, offering suggestions for improvements to existing content, adding review comments to
existing pull requests, proposing new content, or creating new pull requests to fix issues or
provide new content. Please review our [contributor guidelines](/v3/contribute/style-guide) prior to
any contribution. If you have any further questions, please do not hesitate to reach out on our
[substrate technical community channel](https://matrix.to/#/#substrate-technical:matrix.org)! We
would love to get to know you and your work!

### Directory Structure

The content of this website is versioned in separate directories `v<version>` is the convention
used. The devhub is then hierarchically separated into the three main types of
content: docs, how-to-guides, and tutorials.

Sub folders in these are of the form:

```
- <version>
  - <content type>
    - <XX-section>
      - <Y-page>
        - `index.mdx`
```

By convention we use `XX` numbering starting at `00` for sections, and `Y` lettering starting at `a`
for pages.

File directory example: `v3/docs/00-style-and-contributor-guidelines/a-contributor-guidelines/index.mdx`

Each `index.mdx` page has the content to be rendered to this page, and all pages include a header
section with a `slug` item that is used for navigation on the generated site,

URL example: https://docs.substrate.io/v3/contribute/style-guide

Configuration and styling files for gatsby live primarily in the `src` folder.

Some gotchas:

- The `i18n` folder is used for translation **but also for the rendering of the navigation**
  **elements sections**. Your `index.mdx` file's `title` is not the source for this.
- If you are adding or renaming a page, you **must** add it correctly in `src/components/DevNavMenu.tsx` and
  possibly `gatsby-config.js` and `gatsby-node.js`.

### Production Deployment

- `main` branch is available at: https://docs.substrate.io/

### Staging Deployment

- `develop` branch is available at: https://substrate-docs-staging.netlify.app

## 🚀 Quick start

1.  **Clone the Repo**

    ```bash
    # create a new folder to get going
    git clone https://github.com/substrate-developer-hub/substrate-docs.git
    ```

2.  **Get Setup**

    Navigate into your new site’s directory and install all dependencies.

    ```bash
    cd substrate-docs/
    yarn # alias for `yarn install`
    ```

3.  **Configure environment variables**

    Copy `example.env.development` and rename to `.env.development`

    Config URL variables based on your preferable local setup. URL will be used for links generation between documentation and platform stack

    - `GATSBY_DOCS_URL` represents this project serving documentation
    - `GATSBY_IO_URL`: represents platform website

    ```
    GATSBY_IO_URL=http://localhost:8000  // local or hosted URL
    GATSBY_DOCS_URL=http://localhost:8001 // default docs.substrate.io if not set
    ```

4.  **Fire the engine**

    Navigate into your new site’s directory and use the following command to start the development server locally.

    ```bash
    yarn dev # alias for `yarn start` and `yarn develop`
    ```

5.  **Open the code and start customizing!**

    Your site is now running at [http://localhost:8001](http://localhost:8001)
    And your GraphiQL data layer is running at [http://localhost:8000\_\_graphql](http://localhost:8000__graphql)

    Edit to see your site update in real-time on save.

6.  **Learn more about GatbsyJS**

    - [Documentation](https://www.gatsbyjs.com/docs/)

    - [Tutorials](https://www.gatsbyjs.com/tutorial/)
    - [Guides](https://www.gatsbyjs.com/tutorial/)

    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/)

    - [Plugin Library](https://www.gatsbyjs.com/plugins)

    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/)

## Running link-checking locally

There are more than 10,000 links in this doc repo. So we have a link checker to go through most of
them, both internal and external links, to make sure they are valid. We have settings to exclude
some external links by default (more on this later).

We use [`blc`](https://github.com/stevenvachon/broken-link-checker) (broken-link-checker) for links
checking, which is a javascript project. It will be installed when you run `yarn install` in this
package as it is depended on as a development package.

To run link checker, first in one terminal, build the gatsby site with clean cache:

```bash
yarn serve:fresh
```

This command takes a minute or two for the above command to complete, have the site built, and
finally serving it at `https://localhost:9000`.

In another terminal, run:

```bash
yarn checklinks:v3
```

You can further configure it in `package.json` file. Currently it has a list of paths being
excluded. These paths are not regex-supported and just doing a plain string matching. They are
excluded because for:

- `/substrate-io-staging.netlify.app`: internal staging site.

- `/rustdocs`: all paths to `/rustdocs/<splat>` are going to be redirected to
  [https://paritytech.github.io/substrate/<splat>](https://paritytech.github.io/substrate). The
  redirection is handled by netlify redirect feature. Gatsby server will just rendered them as 404
  pages.

- `/www.substrate.io`, `/docs.substrate.io`: these are public substrate.io pages that can be remove
  from the excluded list once [substrate.io](https://www.substrate.io) is launched.

- `/crates.io`, `/fonts.gstatic.com`, `/github.com`, `/wwww.nuget.org`: they either have
  rate-limiting check or doesn't welcome web crawlers to fetch them and just return a 404 page.

## Link checking as part of Github workflow

We configured a [Github workflow](../.github/workflows/check-links.yml) to build the Gatsby site in
production as a docker image and push it to Docker hub at
[`jimmychu0807/substrate-docs`](https://hub.docker.com/repository/docker/jimmychu0807/substrate-docs).
The image is then launched as a service in the next CICD job. `checklinks:v3` is run against the
running gatsby site in the docker container to check all links.

## License

Substrate **documentation** is licence under the [Apache 2 license](./LICENSE).
