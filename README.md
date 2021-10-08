<p align="center">
  <a href="https://www.parity.io">
    <img alt="Parity Logo" src="https://www.parity.io/images/parity_logo_light.png" width="60" />
  </a>
</p>
<h1 align="center">
  Substrate Docs
</h1>
<h3 align="center">
  Work-In-Progress Substrate Docs for DevHub Team. 
</h3>

Important Convention Note

> Always create your own branch to work on the site. Use `develop` for testing. Both Netlify flags towards the bottom display status of `develop` and `main` site. `main` is production ONLY and deployed by dedicated Dev or Comms team through Forestry.

### Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/65f522fe-eefa-434b-bdb3-6345d363c177/deploy-status)](https://app.netlify.com/sites/ecstatic-babbage-c109a3/deploys) ![linkcheck workflow](https://github.com/substrate-developer-hub/substrate-docs/actions/workflows/check-links.yml/badge.svg)

[Staging Site](https://substrate-docs-staging.netlify.app)

## 🚀 Quick start

1.  **Clone the Repo**

    ```shell
    # create a new folder to get going
    git clone https://github.com/substrate-developer-hub/substrate-docs.git
    ```

2.  **Get Setup**

    Navigate into your new site’s directory and install all dependencies.

    ```shell
    cd substrate-docs/
    yarn
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

    ```shell
    cd substrate-docs/
    yarn dev
    ```

5.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!
    And your GraphiQL data layer is running at http://localhost:8000/\_\_graphql

    Edit to see your site update in real-time!

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
package as it is depended on as a developement package.

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
production as a docker image and push it to Docker hub at [`jimmychu0807/substrate-docs`](https://hub.docker.com/repository/docker/jimmychu0807/substrate-docs).
The image is then launched as a service in the next CICD job. `checklinks:v3` is run against the
running gatsby site in the docker container to check all links.
