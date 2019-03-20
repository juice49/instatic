# Instatic

👉 *Work in progress.*

Maintain and publish a static archive of your Instagram posts using Gatsby.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Instatic will help you to:

- Archive your Instagram posts in git.
- Keep your archive up to date using serverless functions.
- Publish your Instagram feed as a static site.

The serverless functions are designed to run on [Zeit's Now platform](https://now.sh).
You will need a paid plan to allow the function to run for more than ten seconds,
but Instatic should be very inexpensive to run.

## Todo

- Support posts containing multiple images.
- Support videos.
- Adopt Now's scheduled tasks whenever they become available.
- Reduce or remove transpilation once Now supports newer node.js versions.