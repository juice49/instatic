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

## Config

Instatic requires the following evrionment variables:

| Variable | Description |
| --- | --- |
| INSTAGRAM_TOKEN | An Instagram API token authorised to read your feed. |
| JWT_SECRET | Secret used to verify the webhook JWT. |
| GIT_REMOTE | The URL of the git repository. |
| GIT_USER_NAME | The name to use when creating git commits. |
| GIT_USER_EMAIL | The email address to use when creating git commits. |

## Todo

- Support posts containing multiple images.
- Support videos.
- Adopt Now's scheduled tasks whenever they become available.
- Reduce or remove transpilation once Now supports newer node.js versions.
