---
title: Git Cheatsheet
date: "2022-03-13"
description: "Basic GIT usage"
---

## Configuration

Configuration file placed in `~/git/config` or `~/.gitconfig`.

Configuration ares:

- `--gloabal` - global configuration, which will take effect on all local repositories
- `--local` - configuration, relevant only to the current GIT repository

**Setting up user:**

```bash
git config --<local|global> user.email <email>
```

**Setting up default editor:**

Setting for default editor, which will be opened for any git text manipulations, e.g. on commit:

```bash
git config --<local|global> core.editor nvim
```

**Configuring remote:**

To configure remote source for GIT repository run:

```bash
git remote add <remote-name> <remote-repo-url>
```

To check what is url set for some remote by it's name:

```bash
git remote show origin
```

Set git repository origin url:

```bash
git remote set-url
```

## Cloning

If you don't want to clone the entire repo it is possible to make a shallow clone.
For example to clone only first level of folders:

```bash
git clone --depth 1
```

If you want to clone a sub-directory, use `git sparse-checkout`:

```bash
git clone --filter=blob:none --sparse <repo-url>
git sparse-checkout add <folder-path>
```

## Committing

### Commit Options

**Verbose mode:**

`git commit -v` allows to see all the changes, made on commit in opened default editor.

_This option is incompatible with `-m` option_

**Commit with specified message:**

`git commit -m "<commit message>"` - create a commit with specified message without opening a default editor

**Commit all:**

`git commit -a` - stage all modified files and commit them.
_This will not stage new files_

**Add new changes to last commit:**

If you have some changes in the repository and want add them to the last commit, use `-a` flag.
`git commit --amend`
_Note, that this command will require commit message change_

To not change last commit's message add `--no-edit` flag

`amend` also allows to change author of commit: `git commit --amend --author="Author Name <email>"`

## Branches

In `git` branch is a pointer to a specific commit.

To list existing local branches: `git branch`. `*` sign shows current branch.
To list all existing locals and remote branches run `git branch -a`.
`git branch -r` displays only remote branches.

**Removing branches:**

To remove **local branch** you need to switch to any other, not removing, branch.
And then run command: `git branch -d <branch-name>` or `git branch --delete <branch-name>`.

_Important to note: to delete branch, it must not contain unmerged changes or unpushed commits._

To force remove of a branch with blocking issues, you can use `--delete --force` flag or similar `-D`.

To remove **remote branch** run: `git push <remote> -d <branch-name>`.

## Checkout

`git checkout` allows to switch between branches, commits or files.

**Switch branches:**

Switch branches: `git checkout <branch-name>` - switch to given branch by it's name.

To create a new branch use `-b` flag: `git checkout -b <new-branch-name>`.

`-f` or `--force` flag allows to change branches if there are conflicting changes exist.

**Checkout on particular commit:**

`git checkout <commit-id>` switches to some commit by it's given commit id.

**Go to previous branch:**

To switch to previously active branch run:

```bash
git checkout -
```

**Resetting changes:**

To reset uncommitted changes you can use: `git checkout -- <file-name>` to reset specific file
and `git checkout .` to reset all uncommitted changes.

## Merge Branches

**Merge with automatic accept of all incoming changes:**

If you need to merge some branch into yours and you know that there will be merge conflicts, but
you want to accept all incoming changes automatically:

```bash
git merge <branch name> --strategy-option <strategy option value>
```

where:

- `branch name` is name of the branch you want to merge into current
- `strategy option value` - `ours` to ovveride all conflicts with values from current branch and
  `theirs` to override all conflicts with values from incoming branch

## Rebase

To rewrite a bunch of commits locally:

```bash
git rebase -i <commit hash> # where the commit hash is the one before all the changes you want to make
```

This will open up an interactive prompt where you can select which commits to keep, squash, or delete.
You can also change commit messages here. This is very useful when cleaning up typo or linting commits, for example.

Abort rebase until it is not completed:

```bash
git rebase --abort
```

## Stash

`stash` in `git` is a special area, where some uncommitted changes may be temporary stored.
Stashed changes are available to all branches in the repository.

To add current uncommitted changes to stash run: `git stash save "<message>"`

To display available data in stash: `git stash list`.
To check changes inside of a particular stash: `git stash show <stash-name>`.
`-p` flag enables display of diff-like changes.

To apply stash data and also keep this data in stash: `git stash apply <stash-name>`
To apply stash and remove this data from stash: `git stash pop <stash-name>`

To remove stash: `git stash drop <stash-name>` and to clear all stashes `git stash clear`.

Adding the `-u` option (or `--include-untracked`) tells `git stash`to also stash your untracked files.

**Creating new branch from stash:**

```bash
git stash branch <new-branch-name> <stash-name>
```

## Log

To display list of commits there is a `git log` command, which opens view on last commits.
It is possible to use basic Vim commands to navigate this view if you need to see some earlier commits.

**Display specific commit:**

To show information about some particular commit there is a `git log <commit id>` command.
It will display list of commits starting and earlier than specified.

**Simple view:**

By default `log` displays all commit information including `SHA`, author, date and message.
If you don't need all the additional information, displayed by default, you can use `git log --oneline`.
It will display shortened commit id and commit message.

**Commit graph:**

Sometimes it is useful to see which branches became sources for our commit history. To see it use `git log --graph`.

**Commit statistics:**

`git log --stat` will display, which files were modified in the commit, how many lines were modified.

`git log --patch` of equivalent `git log -p` will display changes, that were made in the commits.

**Get history of specific fragment:**

To display history of some fragment of particular file:

```bash
git log -L<start>,<end>:<file>
```

where `<start>` is a line number to begin inspect and `<end>` is a line number to finish inspect.

`<end>` - may be also an offset in form of `+<number>`, e.g:

```bash
git log -L355:+10,~/repo/file
```

## Removing Changes Or Reverting

To uncommit and un-stage changes but leave these files in the working directory:

```bash
git reset <commit-sha>
```

This will reset your local directory to match the latest commit and discard un-staged changes:

```bash
git reset --hard HEAD
```

Reset particular file:

```bash
git checkout -- <filename>
```

Undo last commit and rewrite history:

```bash
git reset --hard HEAD~1
```

Reset last several commits:

```bash
git reset --hard HEAD~n        # n is the last n commits
git reset --hard <commit-sha>  # or to a specific commit
```

There is an important distinction between `soft`, `mixed`, and `hard` resets. Basically:

- `--soft`: Uncommit changes but leave those changes staged

- `--mixed` (the default): Uncommit and un-stage changes, but changes are left in the working directory

- `--hard`: Uncommit, un-stage, and delete changes

### Clean

`git clean` command designed to find and remove all not committed and not staged changes.

**Attributes:**

- `-d` - specifies to remove untracked directories;
- `-n` / `--dry-run` - `clean` will only list files it is going to delete but not really remove them;
- `-f` / `--force` - specifies that untracked files will be removed(with no way to restore);

**Examples:**

To list files which will be deleted:

```bash
git clean -n -d
```

To actually remove these files:

```bash
git clean -f -d
```

## Showing Difference

Show difference:

```bash
git diff --staged # for staged changes
git diff # for un-staged changes
git diff branch1..branch2 # difference between two branches
```

## References

- [Git log command](https://www.freecodecamp.org/news/git-log-command/)
- [Git Commit Command Explained](https://www.freecodecamp.org/news/git-commit-command-explained/)
- [Git Stash Explained: How to Temporarily Store Local Changes in Git](https://www.freecodecamp.org/news/git-stash-explained/)
- [Git Delete Branch – How to Remove a Local or Remote Branch](https://www.freecodecamp.org/news/git-delete-branch-how-to-remove-a-local-or-remote-branch/)
