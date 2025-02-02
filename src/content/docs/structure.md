---
title: Architecture
description: Overview of our architecture 
date: 2025-02-02
section: Introduction
order: 0
---
ONE is an a framework for building AI Agents with Astro. 

Tech stack is Astro, React, Assistant UI, Vercel AI SDK

We want to build a system where a user can chat with an agent that understands the content on the page. 

Every page will have an AI Agent. 
The settings will be in the yml at the top of the file and the prompt will be the main content 
for example 

"provider": "openai",
    "model": "gpt-4o-mini",
    "apiEndpoint": "https://api.openai.com/v1",
    "runtime": "edge",
    "temperature": 0.7,
    "maxTokens": 2000,
    "systemPrompt": "You are a helpful AI assistant.",
    "userPrompt": "main content of the markdown file below",
    "welcome": {
      "message": "How can I assist you today?",
      "avatar": "/logo.svg",
      "suggestions": [
        {
          "label": "Tell me about ONE",
          "prompt": "What is ONE and how can it help me?"
        },
        {
          "label": "Get Started",
          "prompt": "How do I get started with ONE?"
        }

How do i structure this project. 