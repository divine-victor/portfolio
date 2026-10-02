# Divine Victor: portfolio

A one-page portfolio with two scroll-driven scenes, one client project and a contact section.

## Files
- `index.html`: the page
- `styles.css`: all styling, including the reduced-motion fallback
- `script.js`: scroll scenes, progress bar and reveals (no libraries)
- `client-project.html`: the full client landing page, shown inside the page frame

## Run locally
Open `index.html` in a browser, or use VS Code's Live Server extension.
Fonts and the two hero videos load from the internet.

## Hero videos (Pexels)
Both videos stream from Pexels, and the footer credits the creators.
- https://www.pexels.com/video/people-busy-at-work-7652720/
- https://www.pexels.com/video/modern-office-space-with-artistic-design-34626856/

## Before publishing
- Confirm the client has agreed to the page being shown publicly.
- Once you have a domain, add to the `<head>` of `index.html`: a canonical link, `og:url`, and an `og:image` pointing at a share image (about 1200x630). A placeholder comment marks the spot.
- Add `<meta name="twitter:image">` too if you want a large card on X.
