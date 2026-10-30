# Genesis Buildooooor — submission preparation pack

Status: prepared draft, not submitted. Updated 30 October 2026. No acceptance or badge guarantee. Code baseline: `587e8b5` on `feat/faz4-demo`; this handoff updates documentation only.

## Project details — copy into the actual form as applicable

- **Name:** Squeek Live Companion — Hamster Event Arena
- **Tagline:** An interactive OBS companion that turns Squeekchain events into stream alerts and hamster-game power-ups.
- **Audience:** Squeekchain community streamers and players.
- **Repository:** https://github.com/bugra7bugra-cpu/squeekchain-project
- **Working source:** https://github.com/bugra7bugra-cpu/squeekchain-project/tree/feat/faz4-demo
- **Pull request:** https://github.com/bugra7bugra-cpu/squeekchain-project/pull/1 (open; not merged).
- **Current English Preview URL:** `[PASTE THE EXACT CURRENT PREVIEW URL HERE]`
- **Demo routes:** `/` control panel, `/overlay` stream notifications, `/arena` playable game. Append these paths to the current Preview origin. Use the panel-generated URL for customized overlay settings.
- **Technology:** React, TypeScript, Vite; static frontend. No wallet, blockchain transactions, backend, database, token rewards or paid service required to play.

The current Preview is reported working by the user, but its exact URL was not supplied in the latest handoff. The older URL in README must not be assumed to identify the current English deployment. Replace the placeholder before copying this pack into a submission.

## Short English application text

Squeek Live Companion brings Squeekchain into interactive streams. Creators customize a transparent OBS overlay, while players collect seeds in a 60-second Hamster Event Arena using keyboard or on-screen controls, including OBS Interact. The app is designed to turn settlement and daily-distance events into eight-second double-score and speed boosts that change gameplay. Clearly labeled DEMO controls let reviewers test both effects immediately. The English Preview, OBS overlay transparency, and Arena play inside OBS have been user-tested. A successful live API check has been observed; a newly arriving live event triggering an alert or power-up remains to be verified. No wallet, token rewards, or transactions are required.

## Features and reviewer walkthrough

1. Open the current Preview. Use the control panel to set theme, accent color, notification position, font size, duration and gap; copy the configured overlay URL.
2. Add that URL to OBS Browser Source at 1920×1080. The separate overlay shows queued visual notifications over a transparent scene. DEMO events remain visibly labeled.
3. Open `/arena`, press **Start / resume** and collect seeds with arrow keys/WASD or held direction buttons. Each normal seed scores 10 points; a round lasts 60 seconds. Pause/resume and restart are available.
4. In DEMO mode, press **DEMO: 8s double score** and **DEMO: 8s speed boost** to observe changes to scoring and movement, rather than notifications alone.
5. For OBS play, add `/arena` as a Browser Source (1280×900 recommended), right-click the source and select **Interact**. Enlarge the Interact window or scroll down to reach the bonus buttons. Focus the game area for keyboard input. Losing focus pauses the round.
6. Live mode uses the existing validated event provider for `system.settlement_completed` v2 and `measurement.daily_distance_milestone` v1. Initial history is skipped and duplicate events are suppressed. API failure never silently enables DEMO; the game stays playable without live bonuses.

**Original contribution:** A combined streamer workflow and playable hamster game, rather than a data display: creators configure a usable OBS scene, players control the hamster, and supported event types are wired to scoring/movement effects. This describes the implementation and design intent; it is not an independent originality assessment or proof of Code Lane eligibility. Transport remains a read-only API integration, and that limitation must be disclosed if the rules require onchain actions or a different type of integration.

## Evidence and remaining checks

| Check | Evidence and limit |
|---|---|
| Current English Preview, panel, Arena | User reports successful access; exact current URL still to be inserted. No new deployment in this task. |
| Arena play and score | User verified in a normal browser and real OBS Interact. |
| DEMO double score and speed | User verified in a normal browser. OBS Interact bonus buttons were below the small window; bonuses were not separately verified inside OBS. |
| OBS overlay notifications and transparency | User verified real Browser Source notifications and transparency over a blue background. This does not establish that the notification came from a new live API event. |
| Live API check | User observed “Last API check successful”. This supports a successful check at that time, not continuous service or a newly arriving event. |
| New live event → notification / power-up | Pending. Observe an actual supported new event after the initial baseline, record time/type and one alert or gameplay effect. Never use DEMO as live evidence. |
| Earlier HTTP 400 / invalid_query | Historical reported failure. Later successful check does not establish root cause or permanent resolution. Local fetch receiver correction was separately tested; no causal link to server-side 400 is proven. Cloud proxy 403 is separate. See API_INVALID_QUERY_RAPORU.md. |
| Local automated checks | Previous code delivery: 35 unit tests, TypeScript, ESLint, build, Arena/overlay Chromium passed; production dependency audit reported 0 vulnerabilities. Not rerun for this documentation-only task. |

## Official requirements research — 30 October 2026

- [Genesis Code Lane](https://squeekchain.com/genesis/code): direct retrieval and trailing-slash variant failed in this research environment. The current **How Building Works**, FAQ and authenticated **Submit Project** form were not inspected. Do not treat this pack as a verified form schema.
- [Official Genesis Aura page](https://squeekchain.com/genesis/aura): a search-indexed official excerpt describes Buildooooor as submitting a project with verified attribution. Direct page retrieval returned no readable text. This is indexed evidence only; current award availability, counts and the verification mechanism were not live-verified.
- [Official documentation home](https://docs.squeekchain.com/): indexed official text welcomes builders including games. This is general ecosystem guidance, not Code Lane acceptance criteria.
- [Official developer guide](https://docs.squeekchain.com/developers/): accessible; documents developer integration. It does not establish Genesis eligibility, domain requirements or submission fields.
- The earlier message that dashboards/mostly read-only apps are excluded came from the user’s report of a developer-team statement. It was not independently matched to a currently accessible official Code Lane policy. Arena adds real interaction, but that does not guarantee acceptance of its read-only event transport.

| Requirement to inspect in the actual Code Lane page/form | Current conclusion |
|---|---|
| Originality and exclusion of dashboards/read-only apps | User-relayed policy; exact current threshold and whether this Arena qualifies remain unverified. |
| Public live demo; Preview URLs allowed? | Treat a working, reviewer-accessible demo as preparation. Exact hosting, Preview and permanence requirements unverified. |
| GitHub/source required; branch, visibility, license | Repo and branch provided. Mandatory source/license terms unverified; no license selected on the user's behalf. |
| Custom domain versus Vercel subdomain | Unverified. Do not purchase a domain or claim one is mandatory. |
| Attribution/ownership verification | Indexed badge description mentions verified attribution; DNS TXT, HTML/file token, GitHub or other exact method unverified. Do not invent a token or change DNS. |
| Swarm Review, review time, badge availability, Early Buildooooor | Unverified; no quota, deadline, award or timing promise. |

## Minimum manual steps before submitting

1. Paste the exact current English Preview URL above. Check panel, Arena and configured overlay access in an independent/logged-out browser so a reviewer can open them. Do not change account protection blindly.
2. Open the official Code Lane page in your own authenticated account. Read the current rules and expand the FAQ; inspect Submit Project without sending it. Confirm whether this read-only-event/interactive-game implementation qualifies, whether Preview hosting is accepted, and the exact GitHub/domain/ownership requirements. Stop if conditions differ from this pack; no domain, wallet or DNS action is authorized here.
3. Enlarge/scroll OBS Interact and try the two labeled DEMO effects if you want complete OBS bonus evidence. Keep screenshots or a short recording clearly marked DEMO.
4. Observe one supported **new live event** after the initial baseline and record its alert or gameplay effect. Until then retain the disclosure in the application text; if live-event proof is required, wait before submitting. If errors recur, share sanitized timestamps/request details with the Squeekchain team using the existing API report.
5. Copy the prepared description, feature list, source branch and actual demo URL into the real form. Complete only the ownership method officially requested, manually and with separate authorization if it involves DNS or a wallet. Review the final form and submit it yourself only when ready. No submission, merge, ownership action or deployment was performed by this task.
