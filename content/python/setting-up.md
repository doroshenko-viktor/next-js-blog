---
title: Python - Setting Up For Comfortable Work
date: "2022-03-03"
description: "Setting up Python with version management and all the basic tools"
---

## Pyenv

### Pyenv Installation

```bash
brew install pyenv
```

Then to make it work in zsh, add following code to `~/.zprofile`:

```bash
eval "$(pyenv init --path)"
```

or to `~/.zshrc`:

```bash
eval "$(pyenv init -)"
```

## Managing multiple python versions.

To list all available versions to install:

```bash
pyenv install --list
```

To install selected version:

```bash
pyenv install -v <version>
```

To list all installed python versions:

```bash
pyenv versions
```

To uninstall selected version:

```bash
pyenv uninstall <version>
```

### Switch Between Versions

To set given python version globally:

```bash
pyenv global <version>
```

Locally:

```bash
pyenv local <version>
```

## Reference

- [Intro To Pyenv](https://realpython.com/intro-to-pyenv/#installing-pyenv)
