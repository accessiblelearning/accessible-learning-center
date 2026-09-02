# Assignment submission Worker

This Cloudflare Worker receives student assignment files from the Accessible Learning Center website and stores them privately in the `accessible-learning-submissions` R2 bucket.

Deployment is managed automatically through Cloudflare Workers Builds from this directory on the `main` branch.


## Duplicate-safe retries

Current pages send a `submission_token` with each selected file. The token becomes the stable R2 object name for that upload attempt. Repeating an interrupted request with the same token overwrites that same private object instead of creating a second copy. Older cached pages that do not send a token remain supported through a Worker-generated fallback.
