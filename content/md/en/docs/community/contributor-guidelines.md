---
title: Contributor guidelines
description:
keywords:
  - contribute
  - style guide
---

Thank you for your interest in contributing to documentation for the Substrate development framework.
As a member of the community, you are invited and encouraged to contribute to the ever-evolving technical documentation and to the code base.
There are a lot of ways to get involved.
For example, you can contribute by:

- Submitting issues
- Offering suggestions for improvements to existing content
- Adding review comments to existing pull requests
- Proposing new content
- Creating new pull requests to fix issues yourself
- Creating pull request for new content other community members might find useful

We value, respect, and appreciate all contributions from the developer community and only ask that you agree to abide by our [Code of conduct](https://github.com/paritytech/substrate/blob/master/docs/CODE_OF_CONDUCT.md) and follow these Contributor guidelines.

To learn more about how to contribute, see the following topics:

- [Before you contribute](#before-you-contribute)
- [How to contribute](#how-to-contribute)
- [What to contribute](#what-to-contribute)

## Before you contribute

Before contributing, please take a few minutes to review these contributor guidelines.
The contributor guidelines are intended to make the contribution process easy and effective for everyone involved in addressing your issue, assessing changes, and finalizing your pull requests.

Before contributing, consider the following:

- If you want to report an issue, click **Issues** and provide as much information about the problem as possible.

- If you have a technical question or need help finding specific information, post your question on [Stack Exchange](https://substrate.stackexchange.com/).

If you want to contribute directly to this repository, typical fixes might include any of the following:

- Spelling, grammar, or typo fixes.
- Code indentation, white space, or formatting changes.
- Broken or missing links.

Note that any contribution to this repository must be submitted in the form of a **pull request**.
Before you create a pull request, be sure that the pull request only implements one bug fix.

If you are new to working with GitHub repositories and creating pull requests, consider exploring [First Contributions](https://github.com/firstcontributions/first-contributions) or [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

## How to contribute

This repository contains the documentation source for the [docs.substrate.io](https://docs.substrate.io) site and is focused primarily on documentation for Substrate blockchain developers and parachain developers.

### Making simple edits

For simple changes, like fixing a typo or making minor changes to a sentence:

1. Click **Edit this page**.

2. Edit the page in GitHub.

3. Replace the default commit message with a short description of your change, then click **Commit Changes**.

4. Select **Create a new branch for this commit and start a pull request**.

### Creating branches and pull requests

If your contribution is more than a simple change, you'll need to follow the full work flow for creating a working branch and submitting a pull request.
Here's a summary of what you need to do:

1. Navigate to the [substrate-docs](https://github.com/substrate-developer-hub/substrate-docs) public repository in a web browser.

2. Clone or fork the repository to create a copy of the repository on your local machine.

3. Create a new branch for your fix by running a command similar to the following:

   ```text
   git switch -c my-initials/my-branch-name-here
   ```

4. Open the file you want to fix in a text editor and make the appropriate changes for the issue you are trying to address.

5. Add the file contents of the changed files by running a command similar to the following:

   ```text
   git add path-to-changed-file
   ```

6. Commit your changes to store the contents you added along with a descriptive message by running a command similar to the following:

   ```text
   git commit -m "Description of the fix being committed."
   ```

7. Push the changes to the remote repository by running a command similar to the following:

   ```text
   git push origin my-initials/my-branch-name-here
   ```

8. Click **Create pull request** to start a new pull request and provide any additional information about the changes you made.

   A maintainer will review your pull request and approve or request changes.
   If no changes are required, the maintainer will merge your pull request.
   If a maintainer requested changes or clarification, update your pull request and request another reviewer.

9. When you see your changes have been merged, celebrate your success!
   🥂

## What to contribute

The most valuable contributions from the community typically take the form of how-to guides or tutorials that help other developers solve specific problems, learn specific skills, or demonstrate specific tasks.

If you would like to contribute, you might be wondering “What is the difference between a ‘how-to’ guide and a tutorial?”.

### How-to guides

A how-to guide describes how to achieve a goal or complete a task.
Only the information that is pertinent to achieving that goal or completing the task is included.
With how-to guides, readers have enough information to know what they want to do—for example, open a bank account—but not necessarily enough information to know how to do it.
For example, the how-to guide for opening a bank account wouldn't explain what a bank account is or why you might want to open one, but would focus on specific steps such as:

1. Select an institution.
2. Fill out an application.
3. Deposit a minimum amount of currency.

How-to guides often include links to additional information, but should not include explanations that take the focus away from what the reader wants to accomplish.
For more information about writing _How-to_ guides, see the [Template - How-to guide](/community/template-how-to-guide) and the [Markdown template](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/contribute-templates/how-to-template.md).

### Tutorials

A tutorial is a hands-on illustration or lesson that enables the reader to achieve a
**highly-predictable** result.
Tutorials assume that readers have no prior knowledge on the subject being covered and that they require explicit guidance to complete each step to reach a **well-known** outcome.
Typically, a tutorial is a guided tour that helps the reader complete one organic task from
start to finish.
There are no detours and the information should not be broken out into subtopics
because the steps must be completed in order, not in a sequence of the reader’s choosing.

The single most important aspect of a tutorial is that it should always result in a successful, expected outcome.
The successful outcome is what inspires confidence and delight in the reader.
The single most important distinction between a how-to guide and a tutorial is that, in a tutorial, the author decides what the goal should be and the author eliminates all distractions that would detract from the successful achievement of the goal.

<!--
### Recommendations for writing how-to guides

The Substrate Developer Hub is intended to provide a modular and extensible framework of resources for the Substrate developer community and broader ecosystem.
To achieve this goal, we want to make it easy for contributors to integrate new content that follows a few guiding principles and basic conventions for structure and style.
As a content creator, you should keep the following general principles in mind:

- ◼️ Modularity. Each guide has a well-defined focus.
  However, if information is useful in more than one guide, you can abstract it into a standalone topic and reuse it in multiple places.

- 🔗 Linking. Guides should use links where they are useful—for example, to guide readers to
  concepts or reference topics—but be mindful that stale links frustrate readers.

- ⏯️ Examples. Useful code examples are a critical component of creating a useful guide.

- 🛰️ Related references. Guides can include links to related resources, like Rust docs, video content, or other guides and tutorials.

### Categories for how-to guides

The How-to guides are grouped into categories to help keep them organized.
The source files use tags to identify the categories that apply and the level of complexity for each guide.
As a content contributor, you can also use tags to identify the level of complexity and the most appropriate category for your content.
The current groupings reflect the different areas of development within Substrate:

- Basics. Where the really simple guides live, those that can be referenced by more complex ones.

- Pallet design. Everything to do with building custom pallets with or without FRAME.

- Weights. Any content that covers configuring weights for specific use cases.

- Testing. A collection of guides for testing.

- Storage migrations. Anything to do with storage migrations.

- Consensus. Peer-to-peer networking, different consensus models, bridges, node configurations.

* Parachains. Guides related to building parachain capabilities.

### Complexity

Specify the level of complexity by adding the most appropriate tag from the following list:

- beginner
- intermediate
- advanced

#### Information category

Specify the category for your article by adding the most appropriate tag from the following list:

- basics
- client
- consensus
- currency
- fees
- frame-v1
- migration
- node
- pallet design
- proof-of-work
- runtime
- storage
- testing
- weights
- parachains
- contracts
-->
