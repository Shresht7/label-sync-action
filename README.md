# SynLabels

[![SynLabels](https://github.com/Shresht7/SynLabels/actions/workflows/SynLabels.yaml/badge.svg)](https://github.com/Shresht7/SynLabels/actions/workflows/SynLabels.yaml)

**SynLabels** syncs your repository's labels in the `.github/labels.yaml` config file.

You can _create_, _update_ and _delete_ labels declaratively by editing this file and pushing those changes to the **default branch** of your repo. Any edits you make manually using GitHub's UI will also be synced back into this file.

You can share this file with any other repo's that employ this action to port labels from one repo to another.

## Permissions

This actions needs the `GITHUB_TOKEN` secret to use the GitHub API in order to modify labels.
