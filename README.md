# Fabric.js Performance Comparison

A demo project for comparing Canvas rendering performance. This project was developed using [Cursor IDE](https://cursor.sh/).

## Project Overview

This project compares the rendering performance between grouped and ungrouped objects using Fabric.js. It measures and visualizes canvas manipulation performance across various scenarios.

## Key Features

- **Full Movement Test**: Measures performance of moving all objects
- **Full Zoom Test**: Measures performance of scaling all objects
- **Partial Movement Test**: Measures performance of moving selected objects
- **Partial Zoom Test**: Measures performance of scaling selected objects

## Tech Stack

- React
- TypeScript
- Fabric.js
- Next.js
- Tailwind CSS

## Installation

```bash
# Clone repository
git clone https://github.com/luuvish/fabricjs-group-test.git

# Install dependencies
npm install

# Run development server
npm run dev
```

## Usage

1. When you run the project, two canvases will be displayed:
   - Left: Ungrouped implementation
   - Right: Grouped implementation

2. You can compare performance using four test buttons:
   - Movement Test: Moving all objects
   - Zoom Test: Scaling all objects
   - Partial Movement Test: Moving selected objects
   - Partial Zoom Test: Scaling selected objects

3. Execution time for each test is displayed in milliseconds (ms).

## Performance Metrics

- Full movement time
- Full zoom time
- Partial movement time
- Partial zoom time

## Development Environment

This project was developed using [Cursor IDE](https://cursor.sh/). Cursor is a modern IDE that provides AI-powered code completion and refactoring capabilities.

## License

MIT License

## How to Contribute

1. Fork this repository
2. Create a new branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Questions

If you have any questions, please create an issue.
