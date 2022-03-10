# label-sync-action 🏷

GitHub Action to synchronize and manage your repository's labels 🏷

You can _create_, _update_ and _delete_ labels declaratively by editing the config file and pushing those changes to the **default branch** of your repo. Any edits you make manually using GitHub's UI will also be synced back into this file.

You can share this config with any other repos that employ this action to port labels from one repo to another.

The action will sync repo-labels when you push an edit to the config file (`.github/labels.yaml`) to the default branch or when the `label` webhook event is triggered. You can also activate the action manually (`workflow_dispatch`) from the Actions tab.
If the config file (`.github/labels.yaml`) does not exist when the action executes, it will create the file automatically and fill in the details of the labels used in your repository.

### Workflow setup

Create a workflow file `.github/workflows/label-sync.yaml` and configure the input parameters.

```yaml
# ============================================
#                   LABEL-SYNC
# --------------------------------------------
# GitHub Action to manage labels declaratively
# ============================================

name: label-sync

# Activation Events
# =================

on:
  push:
    paths:
      - .github/labels.yaml # When .github/labels.yaml changes are pushed to the default branch
  label:  # When a label webhook event (create, update, delete) is triggered
  workflow_dispatch:  # When a workflow event is dispatched manually

# Jobs
# ====

jobs:
  label-sync:
    runs-on: ubuntu-latest
    
    name: label-sync
    steps:
    
      # Actions/Checkout
      # ================

      # Required for GITHUB_WORKSPACE
      - name: Checkout
        uses: actions/checkout@v2

      # Execute Label Sync Action
      # =========================

      - name: label-sync
        uses: Shresht7/label-sync-action@main
        id: label-sync

        # Config Parameters
        # -----------------

        with:
          commitmessage: Update labels 🏷 # The commit message when SynLabel updates .github/labels.yaml file in the repo (default: label-sync Update)
          dryrun: true    # Will not make any actual changes if true (default: true)
          create: true    # If true, label-sync has permissions to create labels (default: true)
          update: true    # If true, label-sync has permissions to update labels (default: true)
          delete: false   # If true, label-sync has permissions to delete labels (default: false)

        # Environment Variables
        # ---------------------

        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Needed to make use of the GitHub API to modify labels and update .github/labels.yaml file
```
> NOTE: Potential changes will only be logged if dry run is `true`. For label-sync to actually modify anything you will have to set `dryrun` to `false`.

### Example Config

The config file (`.github/labels.yaml`) will look something like this:

```yaml
- name: bug
  color: '#ee1111'
  description: Something isn't working

- name: documentation
  color: '#0e8a16'
  description: Improvements or additions to the documentation

- name: enhancement
  color: '#a2eeef'
  description: New feature or request

```

> NOTE: Wrap colors with quotation marks (like '#ffffff') or yaml will think anything following the `#` is a comment.

## Permissions

This action needs the `GITHUB_TOKEN` secret to use the GitHub API in order to modify labels.
