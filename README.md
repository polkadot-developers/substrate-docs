<h1 align="center">
  <a href="https://www.substrate.io">
    <img alt="Substrate Logo" src="static/img/sub.gif" width="70%" />
  </a>
</h1>
<h1 align="center"> Substrate Developer Hub </h1>
<h3 align="center"> https://docs.substrate.io/ </h3>
<br/>

<!-- Badges -->

[![Netlify Status](https://api.netlify.com/api/v1/badges/42dec01f-3723-4828-9f01-45ac5b3c8a11/deploy-status)](https://app.netlify.com/sites/substrate-docs/deploys) ![linkcheck workflow](https://github.com/substrate-developer-hub/substrate-docs/actions/workflows/check-links.yml/badge.svg) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://docs.substrate.io/v3/contribute/style-guide/) [![Matrix](https://img.shields.io/matrix/frontier:matrix.org)](https://matrix.to/#/#substrate-technical:matrix.org)

<!-- Description -->

This repository serves as the **developer hub** for the **[Substrate](https://substrate.io)** blockchain
framework. The docs are written in [MDX](https://mdxjs.com/) format an extension of
[markdown](https://www.markdownguide.org/), processed by [Gatsby](https://www.gatsbyjs.com/), and
published to https://docs.substrate.io/ .

## Contributing

Thank you for your interest in contributing to documentation for the Substrate development
framework. As a member of the community, you are invited and encouraged to contribute by submitting
issues, offering suggestions for improvements to existing content, adding review comments to
existing pull requests, proposing new content, or creating new pull requests to fix issues or
provide new content. Please review our 
[contributor guidelines](https://docs.substrate.io/v3/contribute/style-guide/) prior to
any contribution. If you have any further questions, please do not hesitate to reach out on our
[Substrate technical community channel](https://matrix.to/#/#substrate-technical:matrix.org)! We
would love to get to know you and your work!

### Directory structure

The content of this website is versioned in separate directories, where `v<VERSION>` is the convention
used. The devhub is then hierarchically separated into the three main types of
content: docs, how-to-guides, and tutorials.

Sub folders in these are of the form:

```
- v<VERSION>
  - <content type>
    - <XX-section>
      - <Y-page>
        - `index.mdx`
```

By convention we use `XX` numbering starting at `00` for sections, and `Y` lettering starting at `a`
for pages.

File directory example: `/v3/docs/00-style-and-contributor-guidelines/a-contributor-guidelines/index.mdx`

Each `index.mdx` page has the content to be rendered to this page, and all pages include a header
section with a `slug` item that is used for navigation on the generated site,

URL example: https://docs.substrate.io/v3/contribute/style-guide/

Configuration and styling files for gatsby live primarily in the `src` folder.

> NOTE: there are more peculiarities to contributing to this specific repo's content. Please review
> the contributor guidelines on [Build and Deploy](https://docs.substrate.io/v3/contribute/writing#build-and-deploy) to be aware of them! 

### Production deployment

- `main` branch is available at: https://docs.substrate.io/

### Staging deployment

- `develop` branch is available at: https://develop--substrate-docs.netlify.app/

If you are submitting a PR, make sure to submit it to the `develop` branch. Only once PRs are merged into 
develop will they get merged into `main`.

## 🚀 Quick start

1.  **Clone the repo**

    ```bash
    # create a new folder to get going
    git clone https://github.com/substrate-developer-hub/substrate-docs.git
    ```

2.  **Get setup**

    Navigate into your new site’s directory and install all dependencies.

    ```bash
    cd substrate-docs/
    yarn # alias for `yarn install`
    ```

3. **Configure environment variables**

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
    and your GraphQL data layer is running at 
	[http://localhost:8000\_\_graphql](http://localhost:8000__graphql).

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
yarn checklinks
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
The image is then launched as a service in the next CI/CD job. `checklinks` is run against the
running gatsby site in the docker container to check all links.

## Security

Please report _security_ bugs as stated in the [`static/security.txt` file](static/security.txt) in
this repository.

## License

TBD
<!-- Substrate **documentation** is licence under the [Apache 2 license](./LICENSE). -->
