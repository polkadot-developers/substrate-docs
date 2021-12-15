/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable security/detect-non-literal-require */

const lunr = require('lunr')
const remark = require('remark')
const strip = require('strip-markdown')

const createIndexLunr = async (docNodes, cache) => {
  const cacheKey = `IndexLunr`
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached
  }
  const documents = []
  const store = {}

  for (const node of docNodes) {
    const slug = node.frontmatter.slug
    const section = node.frontmatter.section
    const category = node.frontmatter.category
    const title = node.frontmatter.title
    const keywords = node.frontmatter.keywords

    var body
    remark()
      .use(strip)
      .process(node.rawBody, function (err, file) {
        if (err) throw err
        body = file
      })
    documents.push({
      slug: slug,
      title: title,
      section: section,
      category: category,
      keywords: keywords,
      content: body,
    })
    // eslint-disable-next-line security/detect-object-injection
    store[slug] = {
      title,
      section,
      category,
      keywords,
    }
  }
  const index = lunr(function () {
    console.log('Updating Lunr Search Index')
    this.ref(`slug`)
    this.field(`title`)
    this.field(`section`)
    this.field(`category`)
    this.field(`keywords`)
    this.field(`content`)

    for (const doc of documents) {
      this.add(doc)
    }
  })
  const json = { index: index.toJSON(), store }
  await cache.set(cacheKey, json)
  return json
}

module.exports = {
  createIndexLunr,
}
