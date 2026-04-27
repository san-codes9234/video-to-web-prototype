🎥 Video to Web Prototype ➡️ 🌐

An experimental web application that transforms a video into an interactive, scroll-controlled storytelling experience.

👨‍💻 Author
Sankalp Kumar

📖 Overview

This project explores how to bridge the gap between passive video consumption and interactive web design.

Instead of playing a video traditionally, the application converts it into sequential image frames rendered on a canvas. The user’s scroll position controls the playback, creating a smooth, immersive narrative experience.

✨ Key Features
Scroll-Controlled Playback
The video progresses based on user scrolling instead of time-based playback.
Frame-by-Frame Rendering
Video is decomposed into image frames and rendered dynamically on a canvas.
Interactive Storytelling
Users actively control the pace of the story.
AI-Generated Content
Core visual content is created using generative AI tools.
🛠️ Tech Stack
Frontend: React.js
Rendering: HTML5 Canvas
Animation Logic: Scroll event handling
Content Creation: AI-generated video tools
⚙️ How It Works
Convert a video into a sequence of image frames
Load frames into the application
Track user scroll position
Map scroll progress → frame index
Render frames on a canvas accordingly

This creates a scroll-driven animation pipeline, similar to modern storytelling websites.

🚀 Getting Started

Clone and run locally:

git clone https://github.com/san-codes9234/video-to-web-prototype.git
cd video-to-web-prototype
npm install
npm start
🎯 Purpose

This prototype demonstrates:

How video can be reimagined as an interactive medium
How scrolling can act as a timeline controller
A foundation for modern web storytelling experiences
🔮 Future Improvements
Add smooth interpolation between frames
Optimize performance with lazy loading
Introduce audio synchronization
Enhance mobile responsiveness
