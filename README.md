# gitlab stats


1. Generate your personal token: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html

2. Add `.env` file with the following content:

```
GITLAB_API_KEY=[your token]
DELAY=500
```

3. Run `node main` to collect `data.json` (this will take a while)

4. Run `node durations` to see duration stats

