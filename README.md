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
    yarn install
    ```

3.  **Fire the engine**

    Navigate into your new site’s directory and use the following command to start the development server locally.

    ```shell
    cd substrate-docs/
    yarn dev
    ```

4.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!
    And your GraphiQL data layer is running at http://localhost:8000/\_\_graphql

    Edit to see your site update in real-time!

5.  **Learn more about GatbsyJS**

    - [Documentation](https://www.gatsbyjs.com/docs/)

    - [Tutorials](https://www.gatsbyjs.com/tutorial/
    - [Guides](https://www.gatsbyjs.com/tutorial/)

    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/)

    - [Plugin Library](https://www.gatsbyjs.com/plugins)

    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/)

## Github Workflow Configuration

### Link Checking ([`check-links.yml`](github/workflows/check-links.yml))

We configured Github workflow to build the site and perform links checking. It build this Gatsby site in production as a docker image and push it to Docker hub at [`jimmychu0807/substrate-docs`](https://hub.docker.com/repository/docker/jimmychu0807/substrate-docs). The image is then launched as a service in the next job `check-links`. [`blc`](https://github.com/stevenvachon/broken-link-checker) utility is run against the running gatsby site in a docker container to check all the links.

This workflow is triggered if you push or make a pull request to `main` or `develop` branches. It is configured to only check internal links, as external links are sometimes flaky and out of our control. Another point to note is it checks for link anchor as well. If the link anchor cannot be found, warning is thrown, and can be inspected when viewing the details of the github action log.

**Running link checker locally**

You can run the link checker locally by:

- Download [the `linkcheck` binary](https://github.com/filiph/linkcheck/releases), and put it under $PATH.
- Run `yarn serve:fresh` in one terminal to build the gatsby site and serve it.
- Run `yarn checklinks:v3`. If you want to check for external links as well, run `yarn checklinks:v2:e`.

## Link Redirection Test

- https://substrate.dev/docs-test/en/tutorials/create-your-first-substrate-chain
- https://substrate.dev/docs-test/en/tutorials/create-your-first-substrate-chain/setup
- https://substrate.dev/docs/en/tutorials/build-a-dapp
- https://substrate.dev/docs/en/tutorials/build-a-dapp/prepare
- https://substrate.dev/substrate-how-to-guides-test
- https://substrate.dev/substrate-how-to-guides-test/docs/basics/basic-pallet-integration
