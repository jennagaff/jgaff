# LinkedIn Signal Sync — Runbook

Weekly pipeline that updates the **Mission C lagging signals** on the Redpen Labs CRM
dashboard (https://rpl-crm.vercel.app) from Jenna's two manual LinkedIn extractions.
This file is the source of truth for the Saturday scheduled job.

## Cadence

| When (UK time) | What | How |
|---|---|---|
| Friday 15:00 | Reminder email to Jenna to do the two LinkedIn extractions | Routine `LinkedIn extraction reminder (Fri 3pm UK)` — cron `0 14 * * 5` UTC |
| Friday–Saturday | Jenna drops the export files into Google Drive → **LinkedIn Performance** | Manual |
| Saturday 19:00 | Sync job parses the files and writes metrics to the production CRM | Routine `LinkedIn signal sync → CRM (Sat 7pm UK)` — cron `0 18 * * 6` UTC |

Note: cron runs in UTC. `14:00`/`18:00` UTC equals 3pm/7pm UK during BST (summer).
When the clocks change in late October, shift both crons +1 hour (`0 15 * * 5` and
`0 19 * * 6`) to stay at 3pm/7pm local, or accept the 1-hour drift.

## The drop folder (Google Drive)

- **LinkedIn Performance** — folder id `1ClqWPPnpWBmdL-BLLq06A6aox1zVSva6`
  https://drive.google.com/drive/folders/1ClqWPPnpWBmdL-BLLq06A6aox1zVSva6
- **LinkedIn Performance/Processed** — folder id `12tx7NA21lyC1YNJlfR7RodpphHudgErx`
  (archive; the job copies files here after a successful run and never re-processes them)

The two expected extractions (LinkedIn → Analytics, "Export" button, `.xlsx`):
1. **Content / post analytics** — last 7 days: daily impressions, engagements
   (reactions + comments + reposts), and per-post data incl. saves where available.
2. **Followers / audience** — total followers and daily new followers
   (profile views too if the export or a manual note includes them).

Any extra file (e.g. a plain-text note with `Inbound DMs: 3`) is parsed on a
best-effort basis; unknown files are skipped and reported, never guessed at.

## Where the data goes

The CRM's signal tiles read the Supabase `metrics` table live — **writing a metric
updates production immediately; no code deploy is involved.** Writes go through the
CRM's own agent API:

```
POST https://rpl-crm.vercel.app/api/agent
Content-Type: application/json

{"action":"upsert_metric","payload":{
  "outcomeTag":"C",
  "label":"<exact label — see table>",
  "value":"<formatted value>",
  "recordedAt":"YYYY-MM-DD"   // the sync date
}}
```

- **Omit `payload.id`** — each run creates a new dated row, preserving weekly history.
  The dashboard (`SignalsCard.tsx` → `latestMetric`) shows the newest row per
  `outcome_tag` + `label`, ordered by `recorded_at`.
- If Vercel has `AGENT_SECRET` set, requests need the `x-agent-secret` header.
  The secret must then be provided as an environment variable in this Claude
  environment (never committed to the repo).
- Expect `{"ok":true,...}` per call; treat anything else as a failure to report.

## Label mapping (must match character-for-character)

| Dashboard label | Source | Computation | Value format |
|---|---|---|---|
| `LinkedIn followers` | Followers export | Latest total followers | plain integer, e.g. `735` |
| `Weekly impressions` | Content export | Sum of daily impressions, last 7 days | thousands-comma, e.g. `3,057` |
| `Net new followers (wk)` | Followers export | Sum of daily new followers, last 7 days | plain integer, e.g. `9` |
| `Profile views / wk` | Followers/visitors export or manual note | Weekly total if present, else skip | plain integer |
| `Engagement rate` | Content export | (weekly engagements ÷ weekly impressions) × 100, 1 dp | e.g. `4.8%` |
| `Post saves` | Content export (per-post saves) | Sum over last 7 days if present, else skip | plain integer |

Not covered by this job (stay manual): `Substack subscribers`, `Inbound DMs`
(unless a note file provides DMs, per above).

## Job procedure (Saturday routine)

1. `git pull` this branch; read `linkedin-signal-sync/state.json` (`lastRunAt`,
   `processedFileIds`).
2. List files in the drop folder (Drive MCP tools), excluding the `Processed`
   subfolder and any id already in `processedFileIds`. Only files created after
   `lastRunAt` count as new.
3. **No new files** → push notification: "no extractions found — did the Friday
   drop happen?" Write nothing. Stop.
4. Download each file (`download_file_content`), parse, compute the signals above.
5. POST one `upsert_metric` per signal; check `ok:true` on each.
6. Copy processed files into `Processed` (Drive `copy_file`); Jenna can delete the
   originals whenever — dedupe relies on `state.json`, not the folder being empty.
7. Update `state.json` (new `lastRunAt` ISO timestamp, append file ids, record the
   values written), commit and push to `claude/linkedin-signal-sync-saxwot`.
8. Push notification summarising: signals written (label → value), files processed,
   anything skipped and why.

## Failure modes

- **Proxy CONNECT 403 to rpl-crm.vercel.app**: this environment's network policy
  doesn't allow the domain yet. Do not work around it. Notify Jenna to add
  `rpl-crm.vercel.app` to the environment's allowed domains (Claude Code web →
  environment settings → network policy).
- **401 from the API**: `AGENT_SECRET` is set on Vercel; the job needs it as an
  env var in this environment.
- **Ambiguous parse**: write only confident signals; list skipped ones in the
  notification. Never write a guessed number to the dashboard.
