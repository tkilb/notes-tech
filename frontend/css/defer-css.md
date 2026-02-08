---
id: defer-css
aliases: []
tags: []
---

```html
<link
  rel="preload"
  href="path/to/mystylesheet.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="path/to/stylesheet.css" /></noscript>
```
