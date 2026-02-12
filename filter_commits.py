#!/usr/bin/env python3

import git_filter_repo as fr

def commit_callback(commit, metadata):
    # Skip commits by imran-mind
    if commit.author_email == b'shaikhimran115@gmail.com':
        commit.skip()

args = fr.FilteringOptions.parse_args(['--force'])
fr.RepoFilter(args, commit_callback=commit_callback).run()


