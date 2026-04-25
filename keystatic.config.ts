import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: "anthonymgclark/Messageof-life",
  },
  ui: {
    brand: {
      name: "Message of Life",
    },
  },
  collections: {
    blog: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "src/data/blog/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDatetime: fields.datetime({
          label: "Publish Date",
          validation: { isRequired: true },
        }),
        modDatetime: fields.datetime({
          label: "Modified Date",
        }),
        author: fields.text({
          label: "Author",
          defaultValue: "Anthony Clark",
        }),
        featured: fields.checkbox({
          label: "Featured",
          defaultValue: false,
        }),
        draft: fields.checkbox({
          label: "Draft",
          defaultValue: false,
        }),
        tags: fields.array(
          fields.text({ label: "Tag" }),
          {
            label: "Tags",
            itemLabel: props => props.value,
          }
        ),
        canonicalURL: fields.url({
          label: "Canonical URL",
        }),
        content: fields.markdoc({
          label: "Content",
        }),
      },
    }),
  },
});
