# tracey-plugin-childrequirements

Allows linking requirements in a parent-child relationship by using the frontmatter key `parent`.
Generates a table of child requirements for each parent.

## Usage

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
        ChildrequirementsPlugin(),
    ],
};
```
