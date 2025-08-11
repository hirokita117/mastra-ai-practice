# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preferences

- **User Communication**: すべてのユーザーとのやり取りは日本語で行ってください
- **Internal Thinking**: Keep all internal thinking blocks in English for clarity and consistency

## Common Development Commands

```bash
# Navigate to the application directory
cd my-mastra-app

# Install dependencies
npm install

# Run development server (starts Mastra dev server)
npm run dev

# Build the application
npm run build

# Start production server
npm start

# TypeScript type checking (no built-in command, use tsc directly)
npx tsc --noEmit

# Run a specific workflow
# Use the Mastra dev server UI or API endpoints
```

## Project Architecture

This is a **Mastra AI application** built with TypeScript. Mastra is a framework for building AI-powered applications with agents, workflows, and tools.

### Key Components

**Mastra Instance** (`src/mastra/index.ts`)
- Central configuration hub that registers workflows, agents, storage, and logging
- Uses LibSQL for storage (in-memory by default, can be persisted to file)
- Configured with Pino logger for structured logging

**Workflows** (`src/mastra/workflows/`)
- Composed of sequential steps using `createStep` and `createWorkflow`
- Each step has input/output schemas defined with Zod
- Steps can access the Mastra instance to use agents
- Example: `weather-workflow.ts` fetches weather data and plans activities

**Agents** (`src/mastra/agents/`)
- AI agents powered by LLM models (currently using Google Gemini)
- Have access to tools and memory storage
- Example: `weather-agent.ts` uses Google's Gemini model and can fetch weather data

**Tools** (`src/mastra/tools/`)
- Reusable functions that agents can invoke
- Define input/output schemas with Zod
- Example: `weather-tool.ts` fetches weather from Open-Meteo API

### Development Patterns

1. **Workflow Development**: Create steps with `createStep`, chain them with `.then()`, and commit the workflow
2. **Agent Creation**: Define instructions, model, tools, and optional memory storage
3. **Tool Creation**: Use `createTool` with Zod schemas for type-safe input/output
4. **API Integration**: Weather data comes from Open-Meteo API (no API key required)

### TypeScript Configuration

- Target: ES2022 with ES module output
- Strict mode enabled
- Module resolution: bundler
- No emit (TypeScript used for type checking only)