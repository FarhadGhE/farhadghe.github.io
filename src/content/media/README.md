# Media: where each file comes from

Owned by the Content expert. Every file the site shows, its source and its licence. The build turns the images here
into smaller WebP files; the originals stay as they are.

| File | What it is | Source | Licence and use |
|---|---|---|---|
| `portrait-2026.jpg` | Farhad's portrait, 440 x 440, a square crop (head and shoulders) of a photo on an autumn forest road | Sent by Farhad on 2026-11-22 (FirstVersion round 18), 1125 x 1500, cropped with macOS `sips`; no location or camera data | Farhad's own photo, at Farhad's request; it replaced the 2021 avatar |
| `video-thumbnail.jpg` | The flow video's thumbnail, 1280 x 720, shown small on the flow card | YouTube, `https://i.ytimg.com/vi/Dp8gJbE5XnM/maxresdefault.jpg`, downloaded 2026-11-04 | A frame of Farhad's own video; self-hosted so that nothing loads from YouTube |
| `slicer-poster.jpg` | A still of the Spacetime Slicer demo at 20.0 s, 1280 x 720, shown small on the Spacetime Slicer card | `REPO_SLICER` `demo/spacetime-slicer-demo-small.mp4`, frame made with macOS `avconvert` and `qlmanage` | Farhad's own demo of Farhad's own tool; the forest footage inside it is shown as Farhad's (FirstVersion round 01, summary v1, Q5) |
| `../../public/media/round1/*.svg` | Four of Round1's pictures, shown small on the Round1 card | The game's repo, `art/items/` (private; a read-only source of the manage repo) | AI-made, drawn as SVG code by Claude for the game, no third-party art (`public/media/round1/CREDITS.md`). Used at Farhad's request ("Use … the art and its credits"). They become public when this repo's branch is pushed |

FirstVersion round 02 moved the side projects to a small section at the bottom of the page, so the Spacetime Slicer
clip (`public/media/slicer/spacetime-slicer-tilted.mp4`) and four Round1 pictures (`smg.svg`, `emp.svg`, `thermal.svg`,
`medkit.svg`) left the branch. Git's history keeps them.
