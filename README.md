# ludum-dare-46

Entry for https://ldjam.com/events/ludum-dare/46

## Getting setup

1. Install [node.js](https://nodejs.org/en/).
2. Run `npm install`.

### Development

Run `npm run dev`, the game will be available at http://localhost:8080.

### Deployment

1. Build the game using `npm run build`.
2. Commit your changes (including the `dist` directory).
3. Push the committed `dist` directory to the `gh-pages` branch using `git subtree push --prefix dist origin gh-pages`.

The game will be available at https://notclive.github.io/ludum-dare-46.

#### Conflict during deployment

You may get the following message if a different branch has been deployed to gh-pages

```
$ git subtree push --prefix dist origin gh-pages
git push using:  origin gh-pages
To https://github.com/notclive/ludum-dare-46.git
 ! [rejected]        5e8628c3702c5d6758e0655a0eb980c61b7a66aa -> gh-pages (non-fast-forward)
error: failed to push some refs to 'https://github.com/notclive/ludum-dare-46.git'
hint: Updates were rejected because a pushed branch tip is behind its remote
hint: counterpart. Check out this branch and integrate the remote changes
hint: (e.g. 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

Resolve this with
`git push origin 5e8628c3702c5d6758e0655a0eb980c61b7a66aa:gh-pages --force`
using the SHA1 from the error message.

## Credits

Sound effects with thanks to:
- Whistle: [Audio Debris Sound Effects](http://bit.ly/2C1ZZmw)
- Water: amanda @ [SoundBible](http://soundbible.com/)
- Heartbeat: Daniel Simions @ [SoundBible](http://soundbible.com/)