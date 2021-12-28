---
title: Markup Test page
featured_image: /media/images/docs/tutorials/build-blockchain/thumbnail.jpg
keywords:
  - node
  - template
  - basics
# tutorial data
difficulty: 1
duration: 60
skills:
  - Rust
  - Blockchain basics
# related pages
previous: /main-docs/why-substrate/choose-a-dev-platform/
next: /reference/glossary/
---

## Links

[link internal /main-docs](/main-docs)

[link external](https://example.com)

## Code

```bash
   rustup update nightly
   rustup target add wasm32-unknown-unknown --toolchain nightly
```

## Images

![Image1 caption](/media/images/docs/reference/substrate-arch.png)
![Image2 caption](/media/images/docs/reference/substrate-arch-missing.png)

### Remote image without caption

![](https://docs.substrate.io/static/399a08a0da5e076e00f1b6b39cfa2b2f/416ee/kitties-tutorial.png)

## Custom blocks feature

[[info]]
| This custom block uses **simple** `[[info]]` markup directly in vanilla markdown and renders as html

[[danger]]
| This custom block uses **simple** `[[danger]]` markup directly in vanilla markdown and renders as html

### Custom components

<custom-component>Custom native HTML component</custom-component>
