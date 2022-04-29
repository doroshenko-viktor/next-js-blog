---
title: Setting Up ZSH
date: "2022-02-17T22:12:03.284Z"
description: "Basic set up for Z shell"
---

## Plugin Manager

As a plugin manager for `zsh` we will use [ZI](https://z-shell.pages.dev/).

To install it run the following command:

```bash 
sh -c "$(curl -fsSL https://git.io/get-zi)" --
```

After that reload the shell with exec zsh and compile ZI with zi self-update.


`zi load` loads plugin and `zi unload` removes plugin.
