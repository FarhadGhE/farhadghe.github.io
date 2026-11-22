---
order: 2
anchor: btw
kicker: 02 · btw
title: Things I made in my spare time
items:
  - title: Round1
    state: In development
    text: "A world where it exists even when nobody's there. Extraction shooter stealth in the browser, with missions, upgrades, guards, and player-grade smart commandos hunting rich players."
    links:
      - label: Play it
        href: https://round1.fargh.com/
    art:
      - /media/round1/crossbow.svg
      - /media/round1/diamond.svg
      - /media/round1/keycard.svg
      - /media/round1/citadel.svg
  - title: Spacetime Slicer
    state: Live
    text: "Imagine frames of a video are put after each other. What you get is a cube where if you walk in non-standard directions, you'll see views where each part of the scene is from different points of time. Your walking frame can have a curve too.\nUpload a short clip and see for yourself. It's a local browser app and your video is not sent anywhere."
    links:
      - label: Try it
        href: https://fargh.com/spacetime-slicer/
      - label: Code on GitHub
        href: https://github.com/FarhadGhE/spacetime-slicer
    still:
      src: ../media/slicer-poster.jpg
      focus: 74% 50%
  - title: flow
    state: A video, 26 Oct 2026
    text: "How I work with AI agents to keep them consistent, and extract their domain knowledge while they work on things. It has made my AI experience much more optimal and joyful. I've made a video about it. But you'd be fine if you just ask your agent to explain it to you and see if you'd benefit from it too."
    links:
      - label: Watch the video
        href: https://www.youtube.com/watch?v=Dp8gJbE5XnM
      - label: flow on GitHub
        href: https://github.com/FarhadGhE/flow
      - label: My channel
        href: https://www.youtube.com/@farhadge
    still:
      src: ../media/video-thumbnail.jpg
      video: true
  - title: The Ecosystem
    state: In development
    text: "I'm really counting the seconds to put it here once it's ready, it's a full ecosystem in 2D on a small planet, with four countries, +12000 NPC citizens working and choosing their career path to maintain the ecosystem organically. They become miners, traders, employees of banks, government, they make decisions. Prices of everything depend on supply and demand, and players can play in any role. A criminal? A trader? A family owned business? All possible. The ecosystem right now is being actively developed and tuned to maintain its organic balance. A human is born, lives ~7 days, and the game continues by reproducing. And yeah, you pay taxes there too, according to your country's laws of the time."
draft: false
sources:
  - "The place and the size of this section: the user's request of 2026-11-06 (FirstVersion round 02): \"in the very bottom mention btw I have created these things on my spare time (or similar). they are very tiny compared to what I'm doing and have done.\" Summary v1 of that round, approved at 21:24: three small cards, the video as a link. Since 2026-11-21 23:57 there are four, and each card's text is Farhad's own, sent that day (\"replace text under their boxes down there with\"; verbatim in the manage repo's coordination FirstVersion, feedbacks.md), with grammar and spelling fixes only, listed in that coordination's round13/summary-v1.md. Don't polish them."
  - "Round1. The name and the address are Farhad's decision of 2026-11-21: the game is Round1, at round1.fargh.com, and its earlier codename appears nowhere on the site or in this repo. The game's repo, README.md: \"The public server is `https://round1.fargh.com/`\"; that address answered 200 on 2026-11-21, and the live page's title is still \"NIGHTJAR — Stealth Ops\". The game's manage repo, AGENTS.md, The project: a 2D extraction shooter; \"converts NIGHTJAR, the user's top-down stealth game, into a server-authoritative game with a Go server\"; project rule of 2026-10-31: \"one world only, for everyone, capped at 200 players\" (the game's repo, docs/adr/0003-always-on-world.md). The card's text is Farhad's own of 2026-11-21 23:57, with three fixes: a capital at the start of each of its two sentences, and \"no body's\" written \"nobody's\". It no longer mentions NIGHTJAR, the name the draft's sentences carried since FirstVersion round 02. Both repos are read-only sources of the manage repo and private, so the site links the game, not the code (the user's request)."
  - "Round1's pictures: the game's repo, art/ and art/CREDITS.md (every picture AI-made, drawn as SVG code by Claude; no third-party art). Credit: public/media/round1/CREDITS.md."
  - "Spacetime Slicer. REPO_SLICER README.md: \"Turn a video (up to 60 s) into a cube of points, with x = column, y = row and z = time\"; WebGL2. REPO_SLICER app.js and index.html make no fetch, XHR, WebSocket or form upload (checked 2026-11-04), so the video stays in the browser. Live at https://fargh.com/spacetime-slicer/ (its repo's own Pages site); code public at https://github.com/FarhadGhE/spacetime-slicer (no LICENSE file, so \"code on GitHub\", not \"open source\"). The card's text is Farhad's own of 2026-11-21 23:57, in two paragraphs as typed, with fixes: a capital at the start of three sentences, and \"a\" before \"curve\". Farhad typed \"upload a short clip and see yourself\"; it is \"see for yourself\" by Farhad's yes of 2026-11-22 to that question. Nothing is sent anywhere, as the next sentence says."
  - "The Slicer still: REPO_SLICER demo/spacetime-slicer-demo-small.mp4 at 20.0 s (src/content/media/README.md); the forest footage inside it is shown on FirstVersion round 01's summary v1, Q5."
  - "flow. The video: https://www.youtube.com/watch?v=Dp8gJbE5XnM, \"I stopped re-explaining my projects to AI agents. Here’s the workflow I built\", published 2026-10-26 on https://www.youtube.com/@farhadge. The script (DIR_VIDEOPREP speechflow/v3/speech-flow.html): \"flow is a markdown repo next to your code\". flow is CC0 1.0: https://github.com/FarhadGhE/flow (LICENSE). This site is built with flow: the manage repo's coordination FirstVersion. The card's text is Farhad's own of 2026-11-21 23:57, as typed."
  - "The Ecosystem. The title and the text are Farhad's own of 2026-11-21 23:57 (\"call it The Ecosystem. then start like this\"), with fixes: \"ecoystem\" spelled \"ecosystem\", and a capital at the start of four sentences (\"A trader?\", \"A family owned business?\", \"All possible.\", \"And yeah\"). It took the place of the two paragraphs about the game that 01-me.md had until then. The figures (four countries, +12000 NPC citizens, ~7 days) are Farhad's own and may change. It is Farhad's private project, in development: no link and no picture, by Farhad's earlier word that it has no name or link on the site; \"The Ecosystem\" is the name Farhad gave this card. The label \"In development\" is the draft's, from \"being actively developed\"."
  - "The video's thumbnail: YouTube's maxresdefault.jpg for the video, self-hosted, so nothing loads from YouTube."
---

Small things I build for fun.
