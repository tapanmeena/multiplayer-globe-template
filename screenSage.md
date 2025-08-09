# ScreenSage for macOS

Private, always-on-top overlay that captures on-screen text and turns it into concise, interview-ready suggestions with AI.

> Tip: Replace placeholders like <your-site> and <you@domain.com> with your info before publishing.

## Why ScreenSage
- Keep helpful notes visible without cluttering your screen or recordings.
- Live OCR + AI: capture visible text and get smart, short suggestions.
- Discreet, borderless UI that stays out of the way and out of shared windows.

## Key Features
- AI suggestions (Markdown rendered) with coding-aware format:
  1) Problem Statement
  2) My thoughts (short bullets)
  3) Pseudocode
  4) Solution (code, every line commented)
  5) Time Complexity
  6) Space Complexity
- Programming Language preference (Auto, Python, JavaScript/TypeScript, Swift, Java, C++, C#, Go, Rust, SQL, …)
- Live OCR using Apple Vision; configurable interval
- Integrated Preferences inside the overlay (no Dock/menu bar)
- Global hotkeys that work even when the app isn’t focused
- Movable overlay
  - Press-and-hold Cmd+Arrows to keep moving
  - Hold Shift for faster movement
- Follow Cursor mode with adjustable X/Y offset
- Save and reuse capture regions

## How It Works (High level)
1) ScreenSage reads visible on-screen text using Apple’s Screen Recording API + Vision OCR.
2) OCR text is sent to your Azure OpenAI deployment to produce short, interview-ready suggestions.
3) The overlay renders AI responses as Markdown (including code blocks) and stays out of shared windows.

## Privacy & Responsible Use
- The overlay window is excluded from typical screen-sharing captures to reduce presenter distraction.
- Use ScreenSage in ways that comply with your local laws, platform rules, company policies, and event/exam terms.
- Do not use ScreenSage to cheat, evade monitoring, or violate any terms of service. You are responsible for how you use this tool.

## Requirements
- macOS 13+
- Azure OpenAI resource (Endpoint, Deployment, API key)

## Installation

Download: <your-site>/download or build from source.

Build from source (Swift Package Manager):

```zsh
swift run
```

Create an app bundle (optional):

```zsh
make clean && make app
open .dist/ScreenSage.app
```

On first run, grant Screen Recording permission: System Settings → Privacy & Security → Screen Recording.

## Quick Start
1) Open Preferences → Connection
   - Endpoint URL: https://<your-resource>.openai.azure.com
   - Deployment Name: e.g., gpt-4o-mini
   - API Key: stored securely in Keychain
2) Choose Programming Language under Capture (or keep Auto)
3) Press Start to begin OCR; AI suggestions will appear as the screen changes

## Global Hotkeys (default)
- Toggle Overlay: Cmd+B
- Toggle Transparency: Cmd+T
- Start/Pause OCR: Shift+Cmd+O
- Open Preferences: Cmd+,
- Move Overlay (press-and-hold):
  - Cmd+Arrows: move 5 px continuously
  - Shift+Cmd+Arrows: move 20 px continuously

Hotkeys are editable in Preferences → Hotkeys.

## Preferences Overview
- Connection: Azure OpenAI (endpoint, deployment, API key)
- Capture: OCR interval, AI response length, programming language
- Appearance: Theme, font size, Follow Cursor toggle and offsets
- Regions: Save and reuse capture areas
- Hotkeys: Customize global shortcuts

## FAQ
**Does it record or send my screen?**
No. OCR runs locally via Apple Vision. Only extracted text is sent to your configured Azure OpenAI endpoint.

**Will the overlay appear in screen shares?**
By design, the overlay window is excluded from typical screen-sharing captures to keep your shared view clean. Still, always verify your setup and comply with meeting/exam policies.

**What models are supported?**
Any Azure OpenAI chat-completions deployment (e.g., GPT-4o family). You control your endpoint, key, and usage.

## Pricing
Add your pricing and licensing terms here, or link to your storefront.

## Support & Contact
- Website: https://<your-site>
- Email: <you@domain.com>
- X/Twitter: https://x.com/<your-handle>
- LinkedIn: https://www.linkedin.com/in/<your-handle>

## Legal
© <year> <your-name-or-company>. All rights reserved.
ScreenSage uses Apple’s Screen Recording API. Ensure your usage complies with applicable laws, platform rules, and organizational policies. Do not use the app to violate test/exam rules, NDAs, or monitoring policies.
