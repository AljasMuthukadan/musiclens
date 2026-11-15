# MusicLens

**MusicLens** is a JavaScript-based music genre classification and audio analysis project built with React and machine learning.

The project aims to analyze audio from uploaded music files, microphone input, and browser tabs to identify musical genres and provide useful audio insights.

## Features

### Planned
- Music genre classification using a pretrained audio model and a genre classification layer
- MP3 and WAV file analysis
- Live microphone audio analysis
- Audio waveform and frequency visualization
- Browser extension for analyzing audio from supported browser tabs
- Local audio processing for improved privacy

## Tech Stack

- **Frontend:** React, JavaScript, Vite
- **Audio Processing:** Web Audio API
- **Machine Learning:** TensorFlow.js
- **Browser Extension:** WXT
- **Package Management:** npm Workspaces
- **Version Control:** Git and GitHub

## Project Structure

```text
musiclens/
├── apps/
│   ├── web/          # React website
│   └── extension/    # Browser extension
├── packages/
│   ├── audio-core/   # Audio processing utilities
│   └── ml-engine/    # Music classification engine
├── models/           # Machine learning model assets
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- Git
- A modern web browser

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/musiclens.git
cd musiclens
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Development Roadmap

- [ ] Set up the JavaScript monorepo
- [ ] Build the React web interface
- [ ] Implement audio upload and playback
- [ ] Implement microphone capture
- [ ] Integrate the music classification model
- [ ] Display genre prediction results
- [ ] Add audio visualization
- [ ] Build the browser extension
- [ ] Optimize and deploy

## Project Status

MusicLens is currently in early development.

## License

All rights reserved. No open-source license has been granted.
