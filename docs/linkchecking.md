## Running link-checking locally

There are more than 10,000 links in the doc. So we have a link checker to check both internal and external links, with some external links being excluded by default.

We use [`blc`](https://github.com/stevenvachon/broken-link-checker) (broken-link-checker) for link-checking, which is nicely written in javascript. It will be installed when you run `yarn install` in this package as it is depended on as developement package.

Now, to run link checker:

TK>>>



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
- https://substrate.dev/docs-test/en/tutorials/build-a-dapp
- https://substrate.dev/docs-test/en/tutorials/build-a-dapp/prepare
- https://substrate.dev/substrate-how-to-guides-test
- https://substrate.dev/substrate-how-to-guides-test/docs/basics/basic-pallet-integration
