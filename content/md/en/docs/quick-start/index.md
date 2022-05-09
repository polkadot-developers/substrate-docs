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

### File view

This file lives at /code-snippets/markdown.js

`embed:markdown.js`

### Highlight view

This file highlights lines 8-12 using a comment inside the file // highlight-range{1-3}

`embed:markdown2.js`

`embed:markdown.rs`

### Subset of a file

This code block only shows a subset of a file (lines 8 to 12) by embedding the file with a suffix of #L8-12

`embed:markdown.js#L8-12`

### Diff view

Diff view didn't work until additional styling was added. This could mean there will need to be custom styling employed in order to achieve what we are looking for. Node that comments from remark embed plugin displays comments when showing the entire file.

`embed:markdown.diff`

It also works with code blocks inserted directly into the markdown file.

```diff
   // Configure your pallet.
+   impl pallet_something::Config for Runtime {
-   	type Event = Event;
   	type Call = Call;
   }
```

### Embed Snippet from file markdown.diff

`embed:markdown.diff{snippet: "rehype"}`

<hr/>

<div class='gatsby-highlight' data-language=''>
  <pre class='language-rust'>
   // Configure your pallet.
   /* hide-range{1-3} */
   impl pallet_something::Config for Runtime {
   	type Event = Event;
   	type Call = Call;
   }
   </pre>
</div>

```bash
   rustup update nightly
   rustup target add wasm32-unknown-unknown --toolchain nightly
```

## Custom blocks feature

[[info]]
| This custom block uses **simple** `[[info]]` markup directly in vanilla markdown and renders as html

[[danger]]
| This custom block uses **simple** `[[danger]]` markup directly in vanilla markdown and renders as html

### Custom components

We can use `<example-component data="string">Custom native HTML component</example-component>` for more complex UI components if needed.

## Images

![Image1 caption](/media/images/docs/reference/substrate-arch.png)

### Remote image without caption

![](https://docs.substrate.io/static/399a08a0da5e076e00f1b6b39cfa2b2f/416ee/kitties-tutorial.png)
