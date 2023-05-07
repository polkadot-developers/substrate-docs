---
title: Submitting articles to receive a bounty
slug: /v3/contribute/bounties
version: "3.0"
section: docs
category: style guide
keywords:
  - contribute
  - style guide
  - bounties
---

<Message
type="yellow"
title="Information"
text={`This section is still work in progress. There is no official Substrate Developer Hub bounty program although we plan to introduce one soon.`}
/>

To encourage community support and contributions to the developer ecosystem, we have established a bounty program.
The bounty program provides prizes—in the form of XXX—to content developers who submit articles that expand and improve
Substrate documentation by covering new “how-to” type topics.

## Participate

To participate in the program:

1. On the [Issues](https://github.com/substrate-developer-hub/substrate-docs/issues) page for
   the Substrate Developer Hub documentation repository, select the **how-to guide** and **new content**
   labels to filter the list of issues displayed.

1. Select an issue that you are interested in that requires a guide.

For example:

- [How to call a function from another pallet](https://github.com/substrate-developer-hub/substrate-docs/issues/75)

- [How to use benchmarking to calculate weights](https://github.com/substrate-developer-hub/substrate-docs/issues/88)

If there isn’t an issue for the topic you want to contribute, create an issue describing what you want to cover and at
least one use case where it is applicable first. It’s valuable to know the issues that are important to the community
to help us prioritize the topics to cover.

1. Use the [how-to-guide template](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/contribute-templates/how-to-template.md) to organize the information for your topic.

Be sure your article includes the following **required** sections.

- Overview
- Steps
- Examples

**If applicable**, your article should also include the following sections:

- Use cases
- Before you begin
- Related resources

Before submitting, verify your content meets the following requirements:

- Follows the how-to guide template structure.
- States a clear goal in the guide title or the overview section.
- Focuses on achieving the stated goal.
- Includes a link to working code or an example repo.
- Provides supporting references where relevant.

1. Add the appropriate tags to describe your content [complexity] and [category].

1. Create a branch in the [how-to-guides](https://github.com/substrate-developer-hub/substrate-docs/blob/main/content/md/en/docs/reference/how-to-guides/index.md) repository.

1. Create a Pull Request (PR) for the article you want to contribute.

1. Add the **Bounty submission** label to the PR for your article.

1. Update the issue you selected or created with a link to the PR for your article.

The article you submit will be evaluated as part of the Pull Request review and judged based on the following criteria:

- Usefulness. The material your article covers does not already exist and presents at least one clear use case.

- Structure. You’ve followed the [how-to guide template](https://github.com/substrate-developer-hub/substrate-docs/blob/main/static/assets/contribute-templates/how-to-template.md) structure and the conventions described in the [contributor guidelines].

- Correctness and completeness. Each step is clearly articulated, correct, and complete.

- Reproducibility. The steps achieve the expected result consistently.
