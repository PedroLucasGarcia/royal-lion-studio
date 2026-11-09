---
name: Royal Lion Studio
description: Lamego barbershop with a poster hero, then one near-black canvas with precise Inter type, compact controls and a single green booking card.
colors:
  ink: "#111110"
  surface: "#191918"
  bone: "#ECE4D6"
  ash: "#B8B1A5"
  green: "#2F7A4B"
  white: "#FFFFFF"
  line: "rgb(236 228 214 / .1)"
  line-strong: "rgb(236 228 214 / .24)"
  admin-edge: "rgb(17 17 16 / .62)"
  admin-field: "rgb(255 255 255 / .34)"
typography:
  hero-poster:
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: "calc(35 / 16.78 * 1cqw)"
    fontWeight: 400
    lineHeight: 1.14
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.011em"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    letterSpacing: "-0.012em"
  admin-title:
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: "34px"
    fontWeight: 800
    lineHeight: 1
  admin-group:
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: "23px"
    fontWeight: 800
    lineHeight: 1.15
  admin-body:
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  control: "6px"
  card: "8px"
  admin: "0px"
spacing:
  pad: "clamp(1.25rem, 4.3vw, 4.5rem)"
  gutter: "max(var(--pad), calc((100vw - 84rem) / 2))"
  section: "clamp(5rem, 11vw, 10rem)"
  card-gap: "0.5rem"
  admin-gutter: "clamp(1.25rem, 3vw, 3rem)"
components:
  button-primary:
    backgroundColor: "rgb(255 255 255 / .8)"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.white}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.bone}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.5rem"
  button-white:
    backgroundColor: "rgb(255 255 255 / .85)"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.5rem"
  button-white-hover:
    backgroundColor: "{colors.white}"
  admin-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.admin}"
    padding: "0 1rem"
    height: "2.75rem"
  admin-button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.bone}"
    rounded: "{rounded.admin}"
    padding: "0 1rem"
    height: "2.75rem"
  admin-input:
    backgroundColor: "{colors.admin-field}"
    textColor: "{colors.ink}"
    typography: "{typography.admin-body}"
    rounded: "{rounded.admin}"
    padding: ".5rem .7rem"
    height: "2.75rem"
---

# Design System: Royal Lion Studio

## Overview

**Creative North Star: "One Dark Room"**

The whole public site, hero included, sits on one near-black canvas, and nothing changes the wall colour. Hierarchy comes from precise type, hairlines and a few restrained surfaces, in the manner of Linear's design system (the owner's chosen reference, adapted rather than copied). The room has one lit object: the green booking card near the end of the page.

The hero is the exception, and the owner asked to keep it: a poster with its own condensed uppercase type and the portrait standing in front of the word STUDIO, on the same wall as the rest of the page.

The admin panel is not part of this restyle. It keeps its own stylesheet, Roboto Condensed and square controls, because it is a working tool used between clients.

Copy is Portuguese of Portugal and addresses the reader as "tu". "Conheça nossa equipa" and "Conheça um pouco do nosso trabalho." are the owner's wording and stay verbatim, although they use the formal voice.

**Key Characteristics:**
- A poster hero, and a single background colour from the top of the page to the footer.
- Below the hero, Inter throughout, medium weight headings, tight tracking, sentence case.
- Compact controls: 40px high, radius 6px. The fixed bar's booking button is a smaller pill.
- Cards with radius 8px, set 8px apart.
- Below the hero, green only as a large field: the booking card and one services door.

## Colors

The owner's four colours stay, with one raised surface and pure white added.

### Primary
- **Royal Green** (#2F7A4B): the booking card, one of the two service doors, text selection. In the hero: the "Royal Lion" brush in the image, the scribbles around the model (one beside the left shoulder, one hugging the wrist and watch), and the services and hours titles. In the admin: the primary button and focus outline.

### Neutral
- **Canvas Ink** (#111110): the only page background, hero included.
- **Surface** (#191918): ghost buttons and quiet raised areas. The location card runs a 135deg gradient from #20201e to #141413, its only departure from flat fills.
- **Bone** (#ECE4D6): surfaces and details only; it no longer carries text.
- **Ash** (#B8B1A5): hairlines and quiet details only; secondary text is white too, and hierarchy comes from size and weight.
- **White** (#FFFFFF): every title, logo and letter on the site except the hero's two green titles, and every booking button: translucent at rest, opaque on hover.
- **Line** (rgb(236 228 214 / .1)) and **Line Strong** (rgb(236 228 214 / .24)): hairlines and control borders.
- **Admin Edge** and **Admin Field**: admin control borders and input fill only.

### Named Rules
**The One Wall Rule.** The page background is always Canvas Ink, in the hero too, with no grain. Sections are never separated by changing the background; use space, a hairline or a card.

**The Measured Green Rule.** Green measures 3.6:1 on ink, so it never carries small text on the canvas. The hero's green titles are the one use as text, bold and never under 19px. White on green measures 5.2:1, which makes white the text colour on green fields.

## Typography

**Font:** Inter (with system-ui, sans-serif), self-hosted variable, weights 100-900. The hero and the admin use Roboto Condensed, and the liquid word STUDIO is drawn with Roboto 900; those font files must stay.

**Character:** Plain, exact and quiet. Size and tracking carry the hierarchy, not capitals or heavy weights.

### Hierarchy
- **Hero Poster** (Roboto Condensed, uppercase, 400 and 700, sized in cqw from the 1678-unit poster): corners, tagline, services, CTA and hours. The word STUDIO is image and WebGL, not text; the h1 is for screen readers only.
- **Display** (500, clamp(2.25rem, 4.6vw, 4rem), line-height 1.05, -0.035em, balanced wrap): section headings.
- **Body** (400, 1rem, line-height 1.5, -0.011em): default text, white, with supporting sentences set smaller rather than dimmer. Weight 300 separates content from its label: FAQ answers (also smaller, at 0.875rem), door service lists, and the location details (address, hours, reach).
- **Button and Nav** (500, 0.9375rem, -0.012em): actions and navigation links.
- **Admin** (root 17px; title 800 at 34px, group title 800 at 23px; body 400, line-height 1.45).

### Named Rules
**The Sentence Case Rule.** Below the hero, public headings, buttons and labels are in sentence case. There are no uppercase labels, kickers or section numbers. The hero poster is uppercase, and so is the title of the three steps on the booking card.

## Layout

Content sits between one gutter, max(var(--pad), (100vw - 84rem) / 2), so it is capped at 84rem on wide screens. Section rhythm comes from clamp(5rem, 11vw, 10rem). Every image the site serves, heroes included, lives in `public/img/`.

Page order: hero, services, works, team, testimonials (only with content), location and booking cards, questions, footer.

- **Hero:** a poster laid out in 1678 x 937 units inside `.stage` (aspect 3356 / 1874), with all sizes relative to the container: corner texts, plate with word and portrait, tagline, crest, services, stars, CTA and hours. It has no navigation of its own: the fixed bar sits above it from the top of the page, and a 3.5rem top padding keeps the top labels below the bar. Five drawn tools (comb, scissors, clipper, dryer, flat iron) sit behind the letters and the portrait, dim and decorative. From 1000px on screens at least 3:2 wide, the hero is at least 100svh and the poster sits at its bottom; elsewhere its height follows the poster. From 700px to 1099px it keeps the same structure without the services, so the rest stays legible: the stars sit on the top corners of the CTA as on desktop, and the right column ends where the portrait begins, so its text wraps instead of crossing the photo. At every size the base of the photo fades into the page, so the hero never ends in a cut, and the scribbles sit around the model. At 699px and below it becomes a vertical poster: corners and crest, the word STUDIO on top, the portrait with Royal and Lion at the sides of the head, then tagline, services, CTA and hours in a centred column. Entrance and liquid word are the same at every size. With reduced motion or no WebGL, the phone keeps the lockup baked into the hero image instead of the loose pieces.- **Services:** a centred title in the same style as Trabalhos and Equipa, then two doors in a grid, 8px gap. Each door lists two services per row, both columns aligned to the left.
- **Works:** a sticky stage where scattered cards form a ring around the title and open into an arc. It never captures the wheel. Reduced motion or a mount failure drops to the title and a grid.
- **Team:** three columns, one below 640px, with 4 / 5 photos.
- **Cards:** two equal columns from 1000px, one column below. Up to 1399px the location card moves its contact details under the address and hours.

The admin is a 15rem sticky ink sidebar and a bone workspace capped at 62rem. At 860px the sidebar becomes a top band.

## Elevation & Depth

Flat. Depth comes from hairlines and from the surface tone of cards. The one literal layering is the hero: the portrait stands in front of the word STUDIO, with the "Royal Lion" brush over the letters. There are no cast shadows and no glass, except for the blur behind the translucent mobile dock.

## Shapes

Controls have radius 6px and cards radius 8px. The fixed bar's booking button is a pill. The hero CTA and admin controls stay square.

## Components

### Buttons
- **Shape:** 2.5rem high, radius 6px, 1rem horizontal padding. On coarse pointers the minimum height is 2.75rem.
- **Primary:** white at 80% opacity with ink text, opaque on hover.
- **Ghost:** surface fill with a Line Strong border.
- **White:** on the booking card, white at 85% opacity, opaque on hover.
- **Hover / Focus:** colour over 0.2s, arrow moves 2px over 0.3s with the exponential ease. Focus is a 2px white outline, offset 3px.
- **Admin:** 2.75rem, 1px edge, weight 600; primary is green.

### Location card
Title, map card, three columns of facts (address, hours, contact), then the crest and an "Abrir no Google Maps" link. The email must stay on one line, so the contact column takes its content width and the other two share the rest.

The map card (`.locmap`) starts collapsed as a drawn street grid with a pin, the address (`contact.mapTitle`), the town in a pill (`contact.mapPlace`) and a hint (`contact.mapHint`). Pressing it expands the card and only then loads the real Google map, so no request goes to Google before that; the close button or Esc collapses it and returns focus. It carries only true facts: no "Live" badge, and no coordinates until exact ones are confirmed. The map is embedded by search (`contact.mapEmbed`), since a regular Google link cannot be embedded; the place link (`contact.mapsUrl`) only opens Google Maps.

### Booking card
Green field with white text: title, one sentence, the three steps with the icon tile beside the text, a white button (full width at 720px and below), then the crest and the footer line. From 560px to 999px, where the cards stack, the steps sit in three columns with the icon above the text, matching the location details and keeping the card short. From 1000px, where the cards sit side by side, the first two steps share a row whenever each column has at least 15rem and the third takes the row below, 2rem under them (twice the usual gap); narrower cards keep one step per row. Centred on portrait phones, as is the location card. Every `[data-book]` link on the page goes to `booking.pageUrl`, or to `#agendar` while it is empty.

### Booking page
At `/marcacao`: the same fixed bar as the home page, with its booking pill pointing to the agenda (`#agenda`), then the header, the two cards and the footer. The header is centred like the team head: a display title and one sentence, with no label. The agenda is the page's focus: from 1000px it takes all the width the help card leaves, and the help card holds a `clamp(22rem, 28vw, 26rem)` column; both cards share one height, and the agenda grows if help is ever taller; below 1000px they stack with the agenda first. The gap is 0.5rem. The Noona agenda sits in an iframe `min(82vh, 50rem)` tall (never below 32rem), capped at 47rem and centred inside a `#181313` card with rounded corners and the same 1px `--line` border as the home `.door` cards (without their hover, since this card isn't a link), the same colour as the background of Noona's dark theme (`theme=dark` in the iframe address) so no seam shows; nothing is added inside the agenda. The cap exists because from 768px wide Noona pushes its calendar to the left, and below that it fills the width, so the calendar reads as centred. The cost is that Noona's first-step header (title, cancel button, language) only sits on one line from about 768px, so under the cap it stacks. Help is the green panel: a smaller title; the subtitle "Confere o passo a passo." and the three steps between the same 1px lines as the home panel (`.steps`), one step per row side by side, two per row with the third below when the cards stack, and the whole block removed on smartphones (up to 699px, and landscape phones up to 999px wide and 500px tall); then the sentence about doubts and the white phone and email buttons; and at the bottom the home panel's foot (`.panel-foot`), with the crest, a divider and "Royal Lion Studio, Lamego". The text, layout and colours inside the iframe are Noona's and can't be changed from the site, beyond choosing its dark theme; its blue accent stays. Every block rises into view with `.rv` through `marcacao.js`; only the script hides them, so without it or under reduced motion everything stays visible. The edge glow from the home page also runs here, through the shared `edge-glow.js`; an iframe keeps the pointer from the page, so the glow stops following over the agenda, and `edge-glow.js` turns it off if the browser reports the pointer entering the iframe. Copy and iframe address live in `marcacao.html`, not in the panel.

### Team
Photo, name and role, in three equal columns. A slot with no photo keeps its frame empty, and placeholder names never reach the page.

### Navigation
- **Fixed bar:** 3.5rem ink band with a hairline, shared by the home and booking pages. Logo on the left; on the right the links (Início, editable as `nav.home`, then the sections), a thin vertical divider (`.bar-sep`, Bone at 40%) and a small translucent white pill for booking. It is always visible on both pages, from the top of the page.
- **Hamburger menu:** at 720px and below, the links and divider give way to two lines that turn into an X. They open a full-height ink panel below the bar, which stays visible, with large left-aligned links. While it is open the rest of the page is inert and does not scroll; Esc closes it and returns focus to the button, and following a link closes it (`nav-menu.js`).
- **Mobile dock:** translucent white with a blur behind it, opaque on hover, at 999px and below, past the hero and hidden while the booking cards are on screen. From 721px to 999px it appears alongside the full bar.

### Footer
The crest, the footer line, and a Livro de Reclamações link with its arrow. Centred on portrait phones.

### Inputs / Fields
The public site has no fields. In the admin: 2.75rem, 1px edge, translucent white fill.

## Motion

Exponential ease-out only: `--out` cubic-bezier(.16, 1, .3, 1), `--pop` cubic-bezier(.22, 1, .36, 1), `--rise` cubic-bezier(.21, .47, .32, .98). The hero enters once, element by element, from 0.1s to 1.2s over 0.8s each: plate, portrait, corners, tagline, crest, services, stars, CTA, hours, with the brushes wiping in. The word STUDIO responds to the pointer with the liquid effect, which needs the original image. Every section below the hero, on the home page and at `/marcacao`, and the footer enter on scroll the same way as the team: the heading comes down, the items rise one after another with a 0.1s stagger (`.rv`, `.rv-down`). The one exception is the animated works stage, which follows the scroll with its own entrance; its static fallback uses the shared one. A thin glow along the edge of the viewport follows the pointer, on pointer devices only and off under reduced motion. Reduced motion removes all of it and everything stays visible.

## Do's and Don'ts

### Do:
- **Do** keep one background colour on the whole public page.
- **Do** give men and women equal size and treatment wherever both appear.
- **Do** keep the owner's crest, portrait and photos as they are.
- **Do** keep interactive targets at 2.75rem or taller on touch screens.
- **Do** write in pt-PT with "tu", apart from the owner's verbatim lines.

### Don't:
- **Don't** use green for small text on the canvas; it measures 3.6:1.
- **Don't** alternate section backgrounds.
- **Don't** use uppercase labels, kickers or section numbers outside the hero poster, or gradient text, glass or shadows, apart from the mobile dock's blur.
- **Don't** use Roboto Condensed on the public site outside the hero, or Inter in the admin.
- **Don't** make Noona the destination of the booking buttons; they go to the booking page, which embeds it.
- **Don't** set Ash text on bone or green.
- **Don't** colour titles, text or logos anything but white; only the painted art and the hero's services and hours titles stay green.
