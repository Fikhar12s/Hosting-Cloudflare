# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-07-29

### Added
- Implemented "Smart Stitching" (Penjahitan Cerdas) logic in `buildTailTranscript` to allow AI to jump over irrelevant chats and connect deep historical summaries directly with the newest tail messages, significantly saving OpenAI tokens.
- Added new memory control variables: `MAX_SCAN_MESSAGES` and `INCLUDE_ALL_CHATS_AFTER_SUMMARY`.
- Added `SETUP_GUIDE.md`, a comprehensive step-by-step installation and integration guide written for business owners.

## [1.2.0] - 2026-07-07

### Added
- Integrated a Hybrid Memory System by actively injecting "Rangkuman Percakapan" (Kommo AI Summaries) into the OpenAI prompt tail, ensuring the AI maintains deep historical context without consuming massive tokens.
- Introduced Dynamic Memory Fallback: The system scans backward up to `TAIL_MESSAGES` and intelligently slices the transcript from the moment the last Kommo AI Summary was generated.
- Added `TAIL_MESSAGES` to environment variables (default: 6) to limit the fallback scan horizon and token usage.
- Enabled local Miniflare KV Namespace (`LOCAL_DEV_KV`) in `wrangler.toml` to accurately test conversational memory in `wrangler dev`.

### Fixed
- Fixed a critical memory corruption bug in `normalizeStoredMessage` (`shared/kv_memory.js`) where `kommo_ai` and `system` roles were forcefully converted into `customer`, causing the AI to lose track of summaries and system actions.

## [1.1.1] - 2026-07-07

### Added
- Implemented `TEST_LEAD_ID` lock in `workflow/inbound_workflow.js`. Allows the application to process webhooks only from specifically configured IDs for testing purposes, saving AI API costs. Multiple IDs can be provided comma-separated in the environment variable.

## [1.1.0] - 2026-07-06

### Added
- Created `.gitignore` file to ensure sensitive keys (`.dev.vars`) and unnecessary local artifacts (`node_modules/`, `.wrangler/`, `cloudflared.exe`) are not pushed to the repository.

### Fixed
- Fixed an issue in `kommo/kommo_api.js` where `safeText` was aggressively stripping all newline (`\n`) characters from the Note payload, resulting in a flattened string. Replaced it with a new `safeMultilineText` helper.
- Applied `safeMultilineText` in `output/analysis_dispatcher.js` and `output/suggested_reply_service.js` to prevent double-sanitization before payloads reach the Kommo API layer.

### Changed
- Adjusted the formatting of the `| AI Suggesttion |` box in `formatters/note_formatter.js` to ensure the layout remains readable and perfectly aligned within Kommo's note UI.

## [1.0.0] - Initial Release

### Added
- Initial deployment of the Moemtaz CS AI Agent on Cloudflare Workers.
- Implemented core workflow parsing, analysis dispatchers, and automated Kommo suggested replies.
- Integrated dataset engines (Pipeline Classifier, Prospect Type, Follow-up logic, Lead Scoring, Rules).
- Support for `KOMMO_SUGGEST_REPLY_DEBUG_ENABLED` inside `.dev.vars` to display raw JSON diagnostic objects in Kommo notes.
