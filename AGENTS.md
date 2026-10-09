<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public competition data behind one read-only API adapter; preserve upstream positions and scores because the game server owns ranking rules.
- Use leaf route metadata and shareable ranking/club routes; personal results remain unavailable until a safe public endpoint exists.
- Keep the Google Play destination and availability in one browser-safe configuration module so release status can change without redesigning controls.
