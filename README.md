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
GitHub Action to create, update, and delete labels from your repository declaratively
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
- [📋 Inputs](#-inputs)
- [� License](#-license)

</details>

---

You can _create_, _update_ and _delete_ labels declaratively by editing a config-file.

## 📑 Permissions

This action needs the `GITHUB_TOKEN` secret to use the GitHub API in order to modify labels.

## 📖 Usage

Create a workflow file (e.g. `.github/workflows/label-sync.yaml`) and configure the input parameters.

<!-- slot: example,  prepend: ```yaml, append: ``` -->
```yaml
# ============================================
#                   LABEL-SYNC
# --------------------------------------------
# GitHub Action to manage labels declaratively
# ============================================

name: Label Sync

# Activation Events
# =================

on:
  # When .github/labels.yml changes are pushed to the default branch
  push:
    branches:
      - main
    paths:
      - .github/labels.yml

  # When a workflow event is dispatched manually
  workflow_dispatch:

# Jobs
# ====

jobs:
  label-sync:
    runs-on: ubuntu-latest
    name: Label Sync
    steps:
      # Actions/Checkout
      # ================

      - name: Checkout
        uses: actions/checkout@v3

      # Execute label-sync action
      # =========================

      - name: label-sync
        uses: Shresht7/label-sync-action@main
        id: label-sync
        with:
          dryrun: false # Will not make any actual changes if true (default: true)
          create: true # If true, label-sync has permissions to create labels (default: true)
          update: true # If true, label-sync has permissions to update labels (default: true)
          delete: false # If true, label-sync has permissions to delete labels (default: false)
        env:
          # Needed to make use of the GitHub API to modify labels and update .github/labels.yml file
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```
<!-- /slot -->

> NOTE: Potential changes will only be logged if dry run is `true`. For label-sync to actually modify anything you will have to set `dryrun` to `false`.

### Example Config

The config file (`.github/labels.yaml`) will look something like this:

```yaml
- name: bug
  color: ee1111
  description: Something isn't working

- name: documentation
  color: 0e8a16
  description: Improvements or additions to the documentation

- name: enhancement
  color: a2eeef
  description: New feature or request

```

> NOTE: If you're prefixing colors with a `#` then wrap them with quotation marks (like '#ffffff') or yaml will think anything following the `#` is a comment.

## 📋 Inputs

<!-- slot: inputs -->
| Input    | Description                                                          |              Default | Required |
| :------- | :------------------------------------------------------------------- | -------------------: | :------: |
| `config` | Path to the files containing the label configurations. (Can be URLs) | `.github/labels.yml` |          |
| `create` | If true, label-sync has permission to create labels                  |               `true` |          |
| `update` | If true, label-sync has permission to update labels                  |               `true` |          |
| `delete` | If true, label-sync has permission to delete labels                  |              `false` |          |
| `dryrun` | Dry-run toggle. label-sync will not make any actual changes if true  |               `true` |          |
<!-- /slot -->

---

## 📑 License

> [MIT License](./LICENSE)