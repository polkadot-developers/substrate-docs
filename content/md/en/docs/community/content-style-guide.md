---
title: Content style guide
description:
keywords:
  - contribute
  - style guide
---

This guide focuses on best practices for writing technical documentation and on the style conventions to use when developing documentation for Parity Technologies products and audiences.
The goal of this guide is to help members of the documentation team and any one interested in contributing to documentation write material that is clear, concise, and consistent.

This guide also includes peculiarities to working with this repo specifically for active
contributors to be aware of available in the [Builder notes](#builder-notes) section.

If you can't find the answer to a style, voice, or terminology question in this guide, consult the following resources:

- [Google developer documentation style guide](https://developers.google.com/style)
- [Microsoft Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/)
- [Chicago Manual of Style](https://www.chicagomanualofstyle.org/book/ed17/frontmatter/toc.html)
- [Merriam-Webster Dictionary](https://www.merriam-webster.com/)

If you can't the answer in any of these resources, open an issue.

## General guidance for writing engaging content

There are three keys to writing content that engages the audience:

- Use the _second person_ point of view to directly address the reader.
- Use an _active voice_ and _present tense_ whenever possible.
- Use a _conversational tone_ that is not too formal or too chummy.

### Point of view

In most cases, address the reader directly. For tutorials, use either first person plural—we, us, our, ours—or second person point of view.
Because tutorials provide a more guided approach to a topic, using the first person plural is a more natural
and commonly-accepted practice than in other types of documentation.

Use the first person point of view sparingly and with intention. When overused, the first person narrative can
overwhelm the sense of a shared experience and obscure the reader’s journey.

Do not use “I” or “me” unless it appears in the text of a user interface element.

Do not use “we” to refer to Parity or the Substrate Developer Hub team. For example, if you are documenting a
recommended setting or practice, use “Parity Technologies recommends....” not “We recommend...”.

### Passive constructions

In spite of the axiom to never use the passive voice, there are situations where a passive sentence structure might be appropriate.
Don’t twist a sentence into knots just to avoid a passive construction. Passive voice does have its place, but be wary of using it.

When writing about software, it’s often tempting to describe what’s happening from the code point of view.
However, there’s almost always a human being with a goal or task to complete who is initiating the activity that the software is executing.
If you keep this human presence in mind, your writing will be more dynamic, easier to follow, and more interesting to read.

### Contractions and conversational tone

Contractions are generally acceptable because they give documentation a more natural conversational tone—at least for English speakers.
Be conscious of when and why you use contractions.

To keep the tone conversational but concise, adhere to the following common-sense guidelines:

- Use common, well-known words whenever possible.

- Don’t use flowery language or literary flourish words and phrases like “and so forth”, “albeit”, “heretofore”, or “thus”.

- Try to be precise in word choice. For example:

  - Don’t use “when”—implying eventuality and time—as interchangeable with “if”, which implies the possibility of something happening.

  - Don’t use phrases that introduce ambiguity. For example, instead of “When the process completes...” use “After the process completes...”.

  - Think carefully about word choices like using “since” (implying a period of time) instead of “because” (implying cause and result) or using “once” (single occurrence) instead of “after” (each time).

- Avoid using dead language words and phrases even if they are generally accepted as English words in practice. For example:

  - Instead of “i.e.”, use “that is” or rewrite the sentence to make the meaning clear without needing extra qualification.

  - Instead of “e.g.”, use “for example”.

  - Instead of “via”, use an appropriate English substitute such as “by”, “through”, or “using”.

  - Instead of “etc.”, use “and so on” or revise the content to make the term unnecessary. For example, revise to use such as or like followed by an example or two.

  - Instead of “caveat”, use an appropriate English substitute such as “notice”, “caution”, or “warning”.

- Avoid adding unnecessary words or phrases. For example:

  - Instead of “In order to”, just use “to”.

  - Instead of “as well as”, just use “and”.

  - Instead of “and then”, just use “then”.

- Avoid jargon, colloquialisms, and idiomatic phrases.
- Avoid adverbs and subjective statements. For example, don’t use words and phrases that include easily, rapidly, simply, quickly.

  - Experienced developers who truly prefer to skip the tutorial...

  - We can quickly test if this code is functioning as expected...

## Headings

All heading levels should use the following conventions:

- Use sentence style case.

- Use active, present tense verbs in headings wherever appropriate, especially in the context of tutorials and how-to guides.

- Serve as a summary of the content they contain.

- Avoid generic headings like overview and introduction, if possible. While generic heading can be conceptually useful, they add no value to the content or the navigational experience.

- Always contain content.
  A heading should never be immediately followed by another heading.
  As a best practice, avoid using headings strictly for navigation.

- Avoid using code, proper names, product-specific jargon, and backticks in headings.

- Keep headings as succinct as possible while providing meaningful clues about the content.

### Limit heading levels

As a best practice, avoid building an information hierarchy with more than three heading levels.
Most content can be effectively organized using two internal heading levels, making it easier to navigate and scan for relevant topics.

### Topic titles

Avoid using gerunds (verbs that end with -ing) in titles and headings.
Procedure titles and headings should answer the question: _What are you trying to do?_ For example, if the answer to _What are you trying to do?_
is _I want to create an account_, the article heading should be _Create an account_.
In most cases, concept and reference topics are named with a noun phrase, such as _Event hooks_.

## Lists

Introduce lists with a heading, a sentence, or a fragment that ends with a colon.

Use **numbered lists** for processes and procedures that must be completed in sequential order. Use **bulleted lists** for items that don't need to appear in order.

Make all list items parallel in structure. For example, start each item in the list using a noun or a phrase that starts with a verb.

### Bullets

Bullets are for unordered lists.
The order of items in a bulleted list can imply importance, but generally all list items are peers.

Each list item should start with a capital letter and end with a period unless all of the list items are
single words or short phrases of no more than four words.
Use parallel structure in phrasing the items in a list.
For example, each list item might start with a verb, noun, or gerund.

### Numbered steps

Only use numbered paragraphs for steps in procedures.
If a procedure has more than nine steps, always consider breaking it into subsections with headings. Ideally, each procedure or subtask should be three to six steps, not have nested sub-steps, and have minimal embedded paragraphs describing what happens—the result or outcome to expect—in an unnumbered paragraph following the step.

Don't combine different actions into one step except when two actions complete a task, such as "Enter the user name, then click **Next**."

## Pronouns

Use gender-neutral pronouns, like “they” whenever possible.
Generally, you can change any noun from singular to plural to have subject-verb-pronoun agreement and avoid the use of gender-specific pronouns like “he”, “him”, “his” or “she”, “her”, “hers”.

Be wary of impersonal and potentially ambiguous pronouns such as:

- all, another, any
- each, either
- few, many, neither, none,
- one, other
- same, several, some, such
- that, them, these, those

If you use any of these impersonal pronouns, be sure you answer “of what?”, “of which?”, or “as what?” in the sentence.

## Terminology and usage conventions

This section covers common terminology, style, and usage questions and recommended practices.

### Above and below

Don't use _above_ to mean _earlier_ or as an adjective preceding a noun (_the above section_) or following a noun (_the code above_). Use a hyperlink, or use _previous_, _preceding_, or _earlier_.

Don't use _below_ to mean _later_ or as an adjective preceding a noun (_the below section_) or following a noun (_the code below_).
Use a hyperlink, or use _later_ or _the following_.

For example:
Use the preceding code to display information about the database.
Use the following code to display information about the database.

### Dates and numbers

Use the DD Mon YYYY or DD Month YYYY format for dates.

In body text, spell out whole numbers from zero through nine.
Use numerals for 10 or greater.
Use commas in numbers with four or more digits.
Use _more than_ instead of _over_ (over is a spatial term).

### Emphasis and admonitionments

Use bold formatting for user interface elements that the user interacts with, including:

- Dialog titles
- Field labels
- Buttons labels
- Options displayed in the user interface

Don't use bold, italics, or underlining for emphasis. If there's text that requires more attention than the surrounding body,
consider isolating it as a standalone note or tip.

**Use admonishment components sparingly!** They are generally disruptive to the reader’s experience. Ask yourself if it is really necessary to stop the reader’s forward progress by adding a Note, Caution, or Tip component.

#### Note

Indicates neutral or positive information that emphasizes or supplements important points of the main text.
A note supplies information that may apply only in special cases. Examples are memory limitations, equipment
configurations, or details that apply to specific versions of a program.

#### Tip

Helps users apply the techniques and procedures described in the text to their specific needs.
A tip suggests alternative methods that may not be obvious and helps users understand the benefits and capabilities of the product.
A tip is not essential to the basic understanding of the text.

#### Caution

Advises users that failure to take or avoid a specific action could result in loss of data.

### Images

Diagrams and illustrations can help readers visualize and internalize complex ideas and processes.
So, use them liberally but with intention.
Images also help to break up long text flows, but they should always reinforce and reflect the text immediately preceding or immediately following the image.

If you include screenshots, only include the relevant parts of the screen and use callouts to highlight how what is captured in the image is relevant to the text.

Be wary of using diagrams or illustrations that include any information—visual or textual—that is likely to get stale.

### Log in formats

Most Linux distributions and macOS use log in to describe how a user initiates an interactive session. Windows uses log on.

- Use _log in_ as two words with no hyphen when describing an action (verb usage).

- Use _login_ as one word when used as a noun (rare but some platforms use login to mean user or an identity).

- Use _log-in_ with a hyphen when modifying a noun (adjective usage).

### Optional steps

Use (Optional) to the beginning of steps that are optional. For example:

1. Open a new terminal.
2. Open the attributes file in a text editor.
3. (Optional) Add a custom field.

### Punctuation

| Element                         | How to use it                                                                                                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| apostrophe (‘)                  | Use in contractions for a conversational tone. Avoid using the possessive form.                                                                                                                                          |
| capitalization                  | Use sentence style capitalization for all headings. When referring to elements in the user interface, follow the capitalization that is used in the labels or text. Do not capitalize common terms.                      |
| colon (:)                       | Use a colon at the end of the statement that introduces a procedure, bulleted list, or table.                                                                                                                            |
| comma (,)                       | Use a serial comma to separate three or more items in a series, including the item before the conjunction.                                                                                                               |
| em dash (—)                     | Use an em dash (—) to set off a parenthetical phrase with more emphasis than parentheses provide. Don’t add spaces around an em dash. Don’t capitalize the first word after an em dash unless the word is a proper noun. |
| hyphenation (-)                 | Avoid using hyphenated compound words. Use hyphens only if the meaning is unclear without them or if the only recognized form of the word includes a hyphen.                                                             |
| quotation marks (" ")           | Avoid using quotation marks unless you need to quote a message or as tring that would otherwise be confusing given its surrounding context.                                                                              |
| semicolons (;)                  | Don't use semicolons instead of commas to separate items in a list. If you think the content should use semicolons, consider rewriting it into subtopics or an unordered bullet list.                                    |
| Slashes (/) and backslashes (\) | Avoid using slashes or backslashes except when documenting paths that require either forward or backward slashes. Never use _and/or_ in documentation.                                                                   |

### Software versions

Use or later or and later to refer to multiple versions of software. For example:

- Firefox 3.6 or later
- Rust compiler (rustc) version 1.55.0 and later

### Tense

Use **present tense** whenever possible.
Use past tense only if you must describe something that has already occurred.
Use future tense only if you must describe something that has not yet occurred but can be safely assumed.

### User interface elements

In general, you should avoid writing about user interface elements. Instead, documentation should always focus on what the audience
needs to do or wants to accomplish and not what is displayed on the screen.

| Element  | What to do                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| button   | Use bold for the button label. Don't include "button" in the description. For example: Click **Submit**.                                                                                                                        |
| checkbox | Use checkbox, not box or check box, if you need to refer to a checkbox in the user interface. Use _select_ and _clear_ with checkboxes, not turn on and turn off, mark and unmark, check and uncheck, or unselect and deselect. |
| click    | Use click to describe taking action on a standalone button. Do not use click on. Click and select are not interchangeable.                                                                                                      |
| dialog   | If you need to refer to a dialog box, use dialog. Don't use pop-up window, dialog box, or dialogue box.                                                                                                                         |
| dropdown | Use _dropdown_ as an adjective, not as a noun. For example, use _dropdown list_.                                                                                                                                                |

### Verb usage

| Verb            | How to use it                                                                                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allow, enable   | Avoid using software as a point of view and consider rewriting to focus on the human interacting with the software.                                                                                                     |
| can, may, might | Use the verb _can_ when describing ability, capability, or capacity. Avoid using the verb _may_ because it implies permission. Use the past tense _might_ when describing the possibility or eventuality of an outcome. |
| clear           | Use \__clear_ rather than _deselect_ or _unselect_ if you have to describe removing a selection from a checkbox.                                                                                                        |
| displays        | Use the transitive verb displays rather than the intransitive verb appears. Use displays with a direct object. For example, The command displays log messages.                                                          |
| ensure          | Use _ensure_ to mean to make sure or to guarantee. Remember that this is not interchangeable with assure (to make confident) and insure (to provide insurance).                                                         |
| enter, type     | Use _enter_ to instruct the user to input a value by pressing the Enter or Return key. Use _type_ to instruct the user to type a value in a field.                                                                      |
| select          | Use select to describe taking action on a menu item, checkbox, or radio button. Note that click and select are not interchangeable.                                                                                     |
| set up, setup   | Use _set up_—two words, no hyphen—when used as a verb. Don't hyphenate. Use _setup_—one word, no hyphen—when used as an adjective or as a noun.                                                                         |
| want, wish      | Use _want_ instead of wish or desire when the user has a choice of actions.                                                                                                                                             |

### Word choice

| Word in question    | How to use it                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| affect, effect      | Use _affect_ as a verb and use _effect_ as a noun.                                                                                                                                                                                                                                                                                                                                                              |
| app, application    | Use _application_ or _applications_ unless there’s a specific reason for using the shorthand term _app_ or _apps_.                                                                                                                                                                                                                                                                                              |
| back-end, front-end | Using the hyphen in these terms is still more common than not using it. Both forms are acceptable, but for consistency use the hyphen.                                                                                                                                                                                                                                                                          |
| email               | It hasn’t been e-mail for thirty-plus years. Never use emails. Don’t use email as a verb.                                                                                                                                                                                                                                                                                                                       |
| file name           | Use _file name_ as two words, not _filename_.                                                                                                                                                                                                                                                                                                                                                                   |
| its, it’s           | Use _its_ as a possessive meaning belonging to or associated with an object or idea previously mentioned. Because it is a vague pronoun, be sure what _it_ refers to can be easily identified. Use _it’s_ only as a contraction for _it is_ or _it has_.                                                                                                                                                        |
| please              | Avoid using _please_ in documentation unless there’s a specific reason for using it. For example, you might use please if quoting the content of a message that asks the user to do something inconvenient.                                                                                                                                                                                                     |
| prerequisite        | As a section title, use _Before you begin_ instead. If you use _prerequisite_ in the text, there’s no hyphen.                                                                                                                                                                                                                                                                                                   |
| that, which         | Use _that_ at the beginning of a clause that’s necessary for the sentence to make sense. Don’t put a comma before it. Don't use that when introducing a clause referring to people. Use _who_. Use _which_ at the beginning of a clause that adds supporting or parenthetical information to a sentence. If you can omit the clause and the sentence still makes sense, use _which_, and put a comma before it. |
| user name           | Use user name as two words, not username.                                                                                                                                                                                                                                                                                                                                                                       |

## Best practices and common mistakes

This section highlights best practices and common mistakes to avoid.

### Make every word count

Concise sentences are easier to read, comprehend, and translate.

- Use simple words with precise meanings.

- Remove words that don’t add substance.

- Avoid using passive _to be_ verbs like been and being.

- Avoid weak or vague verbs, such as _have_, _make_, and _do_.

When in doubt, choose the simple word or phrase over a more formal or complex one. For example:

| Use this | Not this                      |
| -------- | ----------------------------- |
| use      | utilize, make use of          |
| remove   | extract, take away, eliminate |
| tell     | inform, let know              |
| to       | in order to, as a means to    |
| also     | in addition                   |
| connect  | establish connectivity        |

Whenever possible, choose words that have one clear meaning.
Omit unnecessary adverbs—words that describe how, when, or where. Unless they're important to the meaning of a statement, leave them out.

### Be consistent

Use one term consistently to represent one concept. For example, if you use extrinsic, dispatchable, and transaction interchangeably or ambiguously, you’ll leave the reader confused and uncertain. If terminology changes, be prepared to root out old terminology.

If you use words that can be both nouns and verbs—for example, words like file, post, mark, screen, record, and report—use sentence structure and context to eliminate ambiguity.

### Avoid dangling participles

Participles are modifiers so they must have a noun to modify. A dangling participle is a participle that doesn’t have a noun to modify. If you misplace or leave out the word being modified, you’ll end up with a sentence that is difficult to understand, illogical, or ambiguous (though potentially amusing). Here are a few examples of sentences with dangling participles:

- Looking around the yard, dandelions sprouted in every corner.

- Walking through the kitchen, the smoke alarm was going off.

- Driving like a maniac, the deer was hit and killed.

You can correct these sentences by bringing the participle phrase closer to the subject the phrase is intended to modify or changing the word order of the sentence to clarify who is doing what. You can also fix these types of problems by changing the tense or using the active voice. For example:

- Looking around the yard, I saw dandelions had sprouted in every corner.

- As I was walking through the kitchen, the smoke alarm was going off.

- Driving like a maniac, he hit a deer and killed it.

### Dangling prepositions

In modern English, it’s perfectly acceptable to end a sentence with a preposition. Don’t twist a sentence into knots just to avoid using a preposition at the end.

- This is something you might be interested in.

- This is an example you should pay attention to.

### Cross-reference formats

Most cross-references should include information that clarifies what the reader can expect to be found in the referenced topic.

- For cross-references to topics in the Substrate documentation, use the following formats:

  For more information about [task or concept], see [topic-title].

- For cross-references in a glossary entry to other glossary entries, use the following format:

  See [topic].

- For cross-references to external resources, use the title of the destination instead of the URL of the destination.

Avoid using links to unnamed destinations. For example, don’t use links like click <u>here</u> or see <u>this article</u>.

## Writing concept topics

Concept topics answer “why?” and “what is…?” questions.
Use concept topics to:

- Explain abstract ideas.

- Introduce new terminology.

- Offer analysis.

- Provide background information.

The goal of a concept topic is to help the reader understand the bigger picture, the key components of a system or architecture, relationships between components.

Concept topics tend to be relatively stable, requiring little, if any, ongoing maintenance.

At a minimum, a concept topic includes at least one heading and one or more body paragraphs. A concept topic can also include:

- One or more examples.

- Two or more subsections, marked by subheadings.

- A list of related topics.

## Builder notes

This repository has some conventions and peculiarities that you need to take into account when
modifying it (in any way). Please read this entire section to avoid common `gotchas` and help make
your life and the maintainers lives easier.

### New pages and moving files

- If you are adding or renaming a page, you **must** add it correctly in `src/components/DevNavMenu.tsx` and
  possibly `gatsby-config.js` and `gatsby-node.js`. Your `index.mdx` file's `title` is not the source for the navigation rendering.

### Internal link conventions

- All `/rustdoc/` internal links must end with `.html` or `.html#some-ID`.
  Reasoning can be found in [#425](https://github.com/substrate-developer-hub/substrate-docs/issues/425).

### Check rendering images by clearing `.cache`

From time to time, the development server local cache becomes corrupted. To fix this in a one liner:

```bash
yarn clean && yarn dev
```

**_PLEASE do this when reviewing a page before every PR_** - this ensures your state is what the
build CI see as well.

### New or updated `yarn` packages

From time to time, BREAKING changes happen in the `yarn` dependencies. To fix this in a one liner
on `main`:

```bash
git checkout main && git pull && yarn install && yarn clean && yarn dev
```

Change the branch above to your working brach of choice, or start a new on for a new PR based on
latest `main` this way.

NOTE: please discard the `"private": false,` field this adds to `package.json`.
