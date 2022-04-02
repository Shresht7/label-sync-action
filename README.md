<!-- ========== -->
<!-- LABEL SYNC -->
<!-- ========== -->

<h1 align='center'>Label Sync</h1>

<!-- REPOSITORY BADGES -->
<!-- ================= -->

<div align='center'>

[![Release](https://img.shields.io/github/v/release/Shresht7/label-sync-action?style=for-the-badge)](https://github.com/Shresht7/label-sync-action/releases)
[![License](https://img.shields.io/github/license/Shresht7/label-sync-action?style=for-the-badge)](./LICENSE)

</div>

<!-- DESCRIPTION -->
<!-- =========== -->

<p align='center'>
<!-- slot: description -->
A GitHub Action to dynamically place content in markdown slots
<!-- /slot -->
</p>

<!-- WORKFLOW BADGES -->
<!-- =============== -->

<div align='center'>

[![Test](https://github.com/Shresht7/label-sync-action/actions/workflows/test.yml/badge.svg)](https://github.com/Shresht7/label-sync-action/actions/workflows/test.yml)
[![Validate](https://github.com/Shresht7/label-sync-action/actions/workflows/validate.yml/badge.svg)](https://github.com/Shresht7/label-sync-action/actions/workflows/validate.yml)
[![Action Readme](https://github.com/Shresht7/label-sync-action/actions/workflows/action-readme.yml/badge.svg)](https://github.com/Shresht7/label-sync-action/actions/workflows/action-readme.yml)

</div>

<!-- TABLE OF CONTENTS -->
<!-- ================= -->

<details>

<summary align='center'>Table of Contents</summary>

- [📑 Permissions](#-permissions)
- [📖 Usage](#-usage)
  - [Example Config](#example-config)
- [� Inputs](#-inputs)
- [📋 Outputs](#-outputs)
- [📑 License](#-license)

</details>

---

You can _create_, _update_ and _delete_ labels declaratively by editing a config-file and pushing those changes to the **default branch** of your repo.

The action will sync repo-labels when you push an edit to the config file (default: `.github/labels.yaml`) to the main branch or when the `label` webhook event is triggered. You can also activate the action manually (`workflow_dispatch`) from the Actions tab.
If the config file (`.github/labels.yaml`) does not exist when the action executes, it will create the file automatically and fill in the details of the labels used in your repository.

## 📑 Permissions

This action needs the `GITHUB_TOKEN` secret to use the GitHub API in order to modify labels.

## 📖 Usage

Create a workflow file (e.g. `.github/workflows/label-sync.yaml`) and configure the input parameters.

<!-- slot: example, prepend: ```yaml, append: ``` -->
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
  # When .github/labels.yaml changes are pushed to the default branch
  push:
    paths:
      - .github/labels.yaml
  
  # When a label webhook event (create, update, delete) is triggered
  label:

  # When a workflow event is dispatched manually
  workflow_dispatch:

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
        uses: actions/checkout@v3

      # Execute label-sync Action
      # ========================

      - name: label-sync
        uses: Shresht7/label-sync-action@main
        id: label-sync

        # Config Parameters
        # -----------------

        with:
          dryrun: false   # Will not make any actual changes if true (default: true)
          create: true    # If true, label-sync has permissions to create labels (default: true)
          update: true    # If true, label-sync has permissions to update labels (default: true)
          delete: false   # If true, label-sync has permissions to delete labels (default: false)

        # Environment Variables
        # ---------------------

        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Needed to make use of the GitHub API to modify labels and update .github/labels.yaml file

      # Create pull-request with updated label config

      - name: update-labels-config
        id: update-labels-config
        uses: peter-evans/create-pull-request@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          branch: 'label-sync'
          commit-message: 'Update labels 🏷'
          title: 'Update labels 🏷'
```
<!-- /slot -->

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

> NOTE: If you're prefixing colors with a `#` then wrap them with quotation marks (like '#ffffff') or yaml will think anything following the `#` is a comment.

## 📋 Inputs

<!-- slot: inputs -->
<!-- /slot -->

## 📋 Outputs

<!-- slot: outputs -->
<!-- /slot -->

---

## 📑 License

> [MIT License](./LICENSE)