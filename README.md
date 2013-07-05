
Nifty.js
=========

### What is it?

Here's the story: some talented people created some modal window effects that I thought were cool. [Here is the article on Codrops](http://tympanus.net/codrops/?p=15313).

I wanted to use these effects so I wrote some Backbone views that leverage the CSS work done by others.

[Here's a demo](http://blashill.com/nifty/)

### Getting Started

Link to the css:

```html
<link href="http://blashill.com/nifty/nifty.min.css" rel="stylesheet"/>
```

Include the JavaScript:

```html
<script src="http://blashill.com/nifty/nifty.min.js"></script>
```

Show a modal dialog:

```javascript
Nifty.alert("Hello", "This looks amazing!");
```

### Dependencies

This library is built with Backbone views and thus the standard Backbone dependencies are required for it to work:

- JQuery
- underscore.js
- backbone.js