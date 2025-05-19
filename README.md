# [Augustin Chan's Portfolio & Blog](https://augustinchan.dev)

> The noblest pleasure is the joy of understanding.

![](https://augchan42.github.io/img/blog-desktop.jpg)

This site is built with Jekyll using a modified version of the Hux Blog theme.

## [User Manual for Original Theme (reference) 👉](_doc/Manual.md)

### Prerequisites

1.  **Ruby & Bundler**: Ensure you have Ruby installed. Then install Bundler: `gem install bundler`.
2.  **Node.js & npm**: Ensure you have Node.js (which includes npm) installed. This is needed for Grunt (to compile Less).

### Getting Started (Development)

1.  **Install Dependencies**:

    - Install Ruby gems: `bundle install`
    - Install npm packages: `npm install` (This will install Grunt and its plugins)

2.  **Run Development Server**:

    - To compile CSS, watch for changes, and serve the site locally (usually at `http://localhost:4000`):
      ```sh
      npm run dev
      ```
    - This command does the following:
      - `npx grunt less`: Compiles Less files to CSS.
      - `npx grunt watch`: Watches Less files for changes and recompiles them automatically.
      - `bundle exec jekyll serve`: Starts the Jekyll development server.

3.  **Alternative Start Command**:
    - If you only want to compile CSS once and serve the site without watching for Less changes:
      ```sh
      npm start
      ```

### Building CSS Manually

- If you only need to compile the Less files to CSS without starting the server or watcher:
  ```sh
  npm run build:css
  ```

### Key Customizations & Structure

- **Portfolio Pages**: The main portfolio page (`index.html`) and offerings page (`offerings/index.html`) use the `_layouts/portfolio.html` layout.
- **Styling**: Custom styles for the portfolio are primarily in `less/portfolio.less`. This is imported into `less/hux-blog.less`, which Grunt compiles into `css/hux-blog.css`.
- **Blog Posts**: Reside in `_posts/` and use the default theme layouts and styles.
- **Jekyll Configuration**: `_config.yml` contains site-wide settings.
- **Theme Assets**: Original theme assets and includes are in `_includes/`, `_layouts/` (for blog part), `js/`, etc.

### Other Resources (from original theme)

Ports

- [**Hexo**](https://github.com/Kaijun/hexo-theme-huxblog) by @kaijun
- [**React-SSR**](https://github.com/LucasIcarus/huxpro.github.io/tree/ssr) by @LucasIcarus

[Starter/Boilerplate (likely out of date)](https://github.com/huxpro/huxblog-boilerplate)

Translation (likely out of date)

- [🇨🇳 中文文档（有点过时）](https://github.com/Huxpro/huxpro.github.io/blob/master/_doc/README.zh.md)

## License

Apache License 2.0.
Copyright (c) 2015-present Huxpro

Modifications by Augustin Chan.

Hux Blog is derived from [Clean Blog Jekyll Theme (MIT License)](https://github.com/BlackrockDigital/startbootstrap-clean-blog-jekyll/)
Copyright (c) 2013-2016 Blackrock Digital LLC.
