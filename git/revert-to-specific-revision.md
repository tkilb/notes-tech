---
id: revert-to-specific-revision
aliases: []
tags: []
---

[Reference](http://serebrov.github.io/html/2014-01-04-git-revert-multiple-recent-comments.html)

# Revert to the specific revision using git reset

The solution comes from the Revert to a commit by a SHA hash in Git? question.

Here we first hard reset the state of the repository to some previous revision and then soft reset back to current state. The soft reset will keep file modifications, so it will bring old state back on top of the current state:

```bash
# Careful, reset --hard will remove non-commited changes
git reset --hard 0682c06  # Use the SHA1 of the revision you want to revert to
# HEAD is now at 0682c06 G3
git reset --soft HEAD@{1}
git commit -m "Reverting to the state of the project at 0682c06"
```
