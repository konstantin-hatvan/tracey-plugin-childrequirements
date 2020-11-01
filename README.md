# tracey-plugin-childrequirements

Generates a table of child requirements for each parent.

## Usage

Link requirements in a parent-child relationship using the frontmatter key `parent`.

### Installation

Install the plugin

`npm install tracey-plugin-childrequirements --save-dev`

### Tracey configuration

Add the plugin to the project configuration

```js
// tracey.config.js

const ChildrequirementsPlugin = require('tracey-plugin-childrequirements');

module.exports = {
    plugins: [
        ChildrequirementsPlugin({ /* configuration options */ }),
    ],
};
```

### Plugin configuration

The configuration object has the following options

#### property

**Default**: `parent`

Use this option to configure the frontmatter key for linking requirements
