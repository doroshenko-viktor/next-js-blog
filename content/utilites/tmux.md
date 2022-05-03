---
title: Tmux - Terminal Multiplexer Cheatsheet
date: "2022-02-17T22:12:03.284Z"
description: "Introduction to Tmux, it's basic commands and configuration"
---

## Overview

`Tmux` is a program for managing multiple terminal sessions, windows and panes. It allows to resize, move and switch between panes.
There are other programs with similar functionality, e.g. `Iterm2` for `Mac Os` or `Terminator` for various `Linux` distributions. But there is a con - all of them have no standardized way of using. They have different customization mechanisms and different way of control. And they are not cross platform. `Tmux` runs almost everywhere and allows single interface on different platforms. It allows to have same experience event in systems with no graphical UI.

Moreover `Tmux` makes it possible to run terminal sessions in the background and reattach them when needed. So you don't need to keep terminal open for program to run. Which is useful when working on a remote server.

**Terminology:**

To start working with `Tmux` let's define some basic terms:

- `window` - is a `Tmux` screen. Only one `window` may be visible at one period of time;
- `pane` - is a part of `window`. You are able to create many `panes` inside a `window`;

## Basic Usage

To start `Tmux` enter following command in your terminal: `tmux`.

Most of `Tmux` command starts with a special prefix. By default it is `Ctrl+b`. But it can be changed, using customizations, so next it will be specified just simple as `<Prefix>`.

To exit type `exit`.

If there are multiple windows or panes opened and you need to close them all, press `<Prefix>` and type `:kill-session`.

## Managing Sessions

- `tmux new -s <session-name>` - create new session with specified name;
- `<Prefix> d` - detach current session;
- `<Prefix> D` - choose session to detach;
- `tmux ls` - show existing sessions;
- `tmux attach -t <session-index>` - attach to session by index;
- `tmux a -t <session-name>` - attach to session with specified name;
- `tmux kill-session -t <session-name>` - kill session by name;
- `<Prefix> s` - list existing sessions;
- `<Prefix> $` - rename session;

## Managing Windows

- `<Prefix>+c` - creates new window;
- `<Prefix>+n` - switch to the next window;
- `<Prefix>+p` - switch to the previous window;
- `<Prefix>+<number>` - go to window with number;
- `<Prefix>+w` - list existing windows;
- `<Prefix>+,` - rename window;
- `<Prefix>+f` - find window;
- `<Prefix>+&` - kill window;

## Managing Panes

- `<Prefix>+"` - split screen horizontally;
- `<Prefix>+%` - split screen vertically;
- `<Prefix>+<Arrow Key>` - allows to switch panes;
- `<Prefix>` - while holding and using arrow keys allows to resize pane;
- `Ctrl+d` - close pane;
- `<Prefix>+o` - swap panes;
- `<Prefix>+q` - show pane numbers;
- `<Prefix>+x` - kill pane;
- `<Prefix>+<Space>` - toggle between layouts;

## Copy Mode

`Copy mode` makes it possible to navigate pane content with `page up`, `page down` and arrow keys.

To enter the `copy mode` press combination `<Prefix> [`. To exit press `q`.

## Other Commands

- `<Prefix>+t` - clock;
- `<Prefix>+?` - list shortcuts;

## Configuration

`Tmux` is configured by a text file, located in `~/.tmux.conf`. In order for new config to work `Tmux` must be forced to read configuration file:

```bash
tmux source-file ~/.tmux.conf
```

### Some Adjustments

- Set history limit: `set -g history-limit 5000`
- To display correct colors: `set -g default-terminal "screen-256color"`
- To change the default `<Prefix>`:
  
  ```conf
  unbind C-b
  set -g prefix C-a
  ```

- Change pane switching to more vim-like combinations with `<Alt>+<Shift>+<hjkl>`:
  Here `-n` flag defines, that we don't want to use `<Prefix>` in shortcut.

  ```conf
  bind -n M-Left select-pane -L
  bind -n M-Right select-pane -R
  bind -n M-Up select-pane -U
  bind -n M-Down select-pane -D
  ```

- Bindings for resizing panes:
  
  ```conf
  bind -n M-_ resize-pane -Z
  bind -T M-Down resize-pane -D 3
  bind -n M-Up resize-pane -U 3
  bind -n M-Left resize-pane -L 3
  bind -n M-Right resize-pane -R 3
  ```

- Show activity notifications from background windows:

  ```conf
  setw -g monitor-activity on
  set -g visual-activity on
  ```

- It is often helpful to open new pane in current window, when working on some project in the same working directory. But by default `Tmux` opens new windows and panes in user's home directory. To change this use following configuration:
  
  ```conf
  bind c new-window -c "#{pane_current_path}"
  bind '"' split-window -c "#{pane_current_path}"
  bind % split-window -h -c "#{pane_current_path}"
  ```

## References

- [Tmux Github repository](https://github.com/tmux/tmux)
- [tmux Tutorial — Split Terminal Windows Easily](https://lukaszwrobel.pl/blog/tmux-tutorial-split-terminal-windows-easily/)
- [tmux - a very simple beginner's guide](https://www.ocf.berkeley.edu/~ckuehl/tmux/)
- [Writing Your tmux Config: a Detailed Guide](https://thevaluable.dev/tmux-config-mouseless/)
