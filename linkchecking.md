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
