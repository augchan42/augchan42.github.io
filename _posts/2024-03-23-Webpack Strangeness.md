---
layout:       post
title:        "Solving Webpack Issues: Eliminating Double Script Loading and FOUC"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Webpack
    - Flash of Unstyled Content (FOUC)
    - JavaScript Bundling
    - Web Development
    - Frontend Optimization
    - Code Efficiency
    - Webpack Configuration
    - CSS Loading
    - Performance Improvement
    - Webpack Tips
---

Here's an brief summary of what Webpack is:

> Webpack is an open-source JavaScript module bundler. It was initially released on March 10, 2012, by Tobias Koppers. Webpack is designed to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset. It allows developers to bundle their JavaScript applications into a single file or split them into chunks that can be loaded on demand, improving the performance of web applications.

> Webpack processes your application by starting from one or more entry points and then tracking down all the dependencies, creating a dependency graph. It then bundles all these dependencies into static assets. It's highly extensible via loaders and plugins, allowing it to handle not only JavaScript but also HTML, CSS, images, and more by converting them into valid modules.

Be careful with how your javascript is being bundled 
and injected with Webpack.  I was seeing strange behavior with
my app where things were happening twice (again!) and after checking the html generated in dist, I was the same
script being imported twice!

This was due to me manually importing the js in my index.html
like: 

```
<script src="dist/bundle.js"></script>
```


And the same script being loaded in my webpack.config.js:

```
entry: './src/main.js', // Adjust this to the path of your main JS file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
```

Another tip - if you see FOUC (Flash of Unstyled Content) when loading your page, double check how webpack is building and deploying your project, and make sure poduction mode is properly being set.

My package.json build target was previously:

```
"build": "webpack --mode production",
```

But this wasn't properly distributing my .css because production mode wasn't properly being registered.  I had to fix it by using cross-env:

```
build": "cross-env NODE_ENV=production webpack --mode production",
```

This relies on the following code in the webpack.config.js:

```
plugins: [
    ...
...(process.env.NODE_ENV === 'production' ? [new MiniCssExtractPlugin()] : []),
    ...
```

This generates a main.css under dist that is properly preloaded in the head of my dist index.html.

