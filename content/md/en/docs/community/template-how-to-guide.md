---
title: Template - How-to guide
description:
keywords:
  - template
  - contribute
  - style guide
---

We recommend you use the following template to structure articles that you want to submit as to “how-to” topics.
You can download a copy of the Markdown how-to-template directly from [here](/assets/contribute-templates/how-to-template.md).
After downloading the template, rename the file and replace the description of each section with the relevant content.

## Front matter

Your _How-to_ guide should start with a front matter section delineated by typing three dashes on the first line.
The front matter consists of the following fields:

`---`

title: Keep titles short

description: Write a descriptive sentence to summarize the content of the article.

keywords:

`---`

Only the title field is required and you can specify additional metadata fields.
You close the front matter section by typing three dashes on the line following the last front matter entry.

### [Guide title]

The guide title should summarize the goal of the article.
For “how-to” guides, the title should complete the “How do I …?” sentence.
For example, if the goal of the guide is to illustrate "How do I mint a token supply?," you can set the title in the front matter like this:

`title: Mint a token supply`

In general, you should keep titles short so they are easy to scan for keywords.

### [Guide description]

The guide description is optional, but if you include it, use a single sentence to convey any additional information about the content that the title doesn't convey.
For example:

`description: Illustrates how you can mint a token supply owned by a single account.`

### [Guide keywords]

Keyword are optional, but if you include them, indent two spaces, then use a dash and a single keyword per line.
For an example, see the [how-to template](/assets/contribute-templates/how-to-template.md).

## Introductory paragraph

The first paragraph of the article should provide a brief overview of what the article is about and why this information is useful to its audience.
The overview section does not require an **Overview** heading and it might be more than one paragraph.

The opening section of each article sets the stage for what follows and should answer the obvious questions so readers can decide whether the content is relevant to them.
Readers should know—just from reading this section—whether they should continue or the content doesn’t apply to them and they should move on to something else.

For your overview, try to answer the following questions:

- What is this article about?

- What is the purpose or goal to be accomplished by following the procedure or technique?

- Why would someone want to use this procedure or technique? For example, are there specific use case scenarios that are applicable?

- When would someone use this procedure? For example, is this an activity that is done once or repeated? Is it a pattern or a unique case?

- Where is the procedure or technique applicable?

- Who would use this procedure or technique? For example, are special skills required? Do specific permissions or restrictions apply?

The overview section is also a good place to link to other resources, including other guides.
As the content creator, you want readers to have confidence that the guide will be useful for them.

### Use cases

This section is optional because the guide title might be sufficient if your article is tightly focused on a single use case.

If your article has more than one practical application, use this section to briefly describe each of them.

If the only use case is a repetition of the article title or sufficiently covered in the overview section, skip this section.

If your article only has one use case but it requires more explanation than the title provides, add this section and one or more sentences to provide the additional explanation. For example:

- This guide illustrates implementing a second currency for paying fees. If you want to support multiple currencies in your runtime, this guide provides practical advice and detailed steps that you can apply for the additional currencies you want to support.

- This guide shows you how to perform a runtime migration from a `Vec<u32>` to SomeStruct

If your article has more than one use case, use a bulleted list.

## Before you begin

This section is optional but **recommended**.
Use the Before you begin heading and use the section body to describe any prerequisites that apply to your article.

This section should answer the following questions:

- What should someone **have** before reading this article?

- What should someone **know** before reading this article?

- What should someone **do** before reading this article?

## Procedural steps

Use **Steps** as a heading only if the article has one set of steps that achieve a single goal.
For example, use Steps if an article is tightly focused on a single use case and a more descriptive heading would simply repeat the article title.

For more complex procedures and techniques, use clear, concise headings to describe each part of the procedure or technique.

Each step should be action driven.
In most cases, each step starts with a verb and ends with a period.
The paragraph following a step should describe the result or outcome the reader should expect.
If you feel a step needs any additional information, link to that information rather than embedding too much extraneous detail within the step.

Code snippets can help illustrate the steps but should not overwhelm the focus on "how do I do this" (not on "what do I do").

Keep in mind that most steps have results and readers like confirmation that they have taken the correct action as they progress through a procedure.

## Examples

This section is optional but **recommended**.
You can use this section to provide links to one or more code-based examples that make practical use of your article.
This section should include at least one reference to a repository that exposes what this guide covers in the form of a working example.
You can use reference an existing codebase within Substrate or new code in any publicly-available repository.
For example, if you have a repository where you have tested the procedure you are writing about, include a link to it in this section.

## Related resources

This section is optional.
If you include it, add a bulleted list of links to similar guides, other Developer Hub resources, or related material.
For example, you might add links to other how-to guides, tutorials, or Rust docs.
