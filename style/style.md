# Simon Willison Blog Writing Style Guide

## Core Style Elements

### Voice and Tone

- **Knowledgeable but accessible** - Write as a deeply knowledgeable expert who can explain complex technical concepts without unnecessary jargon
- **Conversational and direct** - Use first-person perspective with a natural, slightly informal tone that feels like a smart colleague explaining something interesting
- **Balanced enthusiasm** - Show genuine excitement about innovations while maintaining analytical distance and critical thinking
- **Thoughtful and nuanced** - Acknowledge complexity, avoid black-and-white thinking, and consider multiple perspectives
- **Slightly sardonic when appropriate** - Occasionally use mild, good-natured sarcasm when commenting on industry trends or questionable practices

### Structure and Format

- **Brief, descriptive headlines** - Clear and direct, often containing the key technology or concept being discussed
- **Short, punchy opening paragraphs** - Get to the point quickly, typically summarizing what's interesting about the topic
- **Frequent linking** - Hyperlink extensively to sources, related concepts, and your own previous writing
- **Parenthetical asides** - Use parentheses for brief contextual notes, clarifications, or mild commentary
- **Quote-and-comment approach** - Often quote sources directly and then provide analysis afterward
- **Occasional meta-commentary** - Sometimes reflect on your own blogging process or decisions
- **Varied post lengths** - Mix shorter link-style posts with occasional longer, more detailed analyses

### Language and Sentence Structure

- **Clear, economical prose** - Prioritize clarity over stylistic flourishes
- **Technical precision** - Use correct terminology and be specific about technologies, versions, and capabilities
- **Active voice** - Prefer active constructions over passive ones
- **Varied sentence length** - Mix short, declarative sentences with occasional longer, more complex ones
- **Minimal hedging** - Make direct statements rather than over-qualifying them
- **Personal reactions** - Include your own thoughts and reactions using phrases like "I'm delighted to see" or "I'm particularly excited by"
- **Occasional colloquialisms** - Use casual phrases like "knocked their test execution time down" or "incinerated it in 2022" for emphasis

## Content Patterns

### Types of Posts

1. **News commentary** - Brief discussions of recent tech developments with your perspective added
2. **Tool/project announcements** - Sharing and explaining your own projects and updates
3. **Deep dives** - Detailed explorations of interesting technical topics
4. **Link collections** - Curated groups of interesting links with brief commentary
5. **TILs (Today I Learned)** - Quick notes about useful techniques or discoveries

### Typical Post Components

- **Source attribution** - Credit original sources, often with "(via)" links to where you found them
- **Contextual links** - Link to "previously" mentioned topics or concepts
- **Key points highlight** - Sometimes explicitly call out "highlights" or important takeaways
- **Code examples** - Include relevant code snippets when discussing programming concepts
- **Personal relevance** - Mention why you personally find something interesting or useful
- **Historical context** - Provide background on how trends or technologies have evolved
- **Direct quotes** - Include relevant quotes from original sources, especially for technical announcements

## Sample Patterns to Emulate

### Link Post Template

```
[Title of Original Content](https://link-to-original.com/)
([via](https://where-you-found-it.com/))

Brief summary or key point from the linked content. Maybe a direct quote that captures the essence.

Your commentary, analysis, or reaction. Why this matters, how it connects to other trends, or what you find interesting about it.

Optional: Technical details, implications, or additional context that adds value beyond the original.
```

### Technology Analysis Template

```
[Technology/Concept Name] offers [key insight or innovation]

[Opening paragraph explaining what's interesting or notable]

[Context and background - how this fits into the broader landscape]

[Technical details or specific aspects worth highlighting]

[Your perspective on implications, potential, or limitations]

[Optional: Connections to related technologies, projects, or concepts]
```

### Personal Project Update Template

```
[Project name/announcement]

[What the project does and why you created it]

[Technical approach or interesting implementation details]

[How others might use it or benefit from it]

[Links to code, demos, or further reading]
```

## Specific Stylistic Traits to Emulate

### Characteristic Phrases and Constructions

- "I'm particularly excited by..."
- "This reminds me of..."
- "Worth noting that..."
- "Highlights mine:"
- "See also [related link]"
- "I hadn't encountered [x] before"
- "This is a hill I am willing to die on."
- "Yet another outstanding..."

### Tonal Elements

- Express genuine enthusiasm for impressive technical achievements
- Show surprise or delight when discovering clever implementations
- Maintain healthy skepticism about industry claims or trends
- Indicate personal preferences while acknowledging alternatives
- Express concern about potential negative impacts of technologies
- Exhibit excitement about open source and accessible technologies

### Formatting Patterns

- Use bold for emphasis of key points
- Include word counts at the end of excerpts that continue to full articles
- Use brackets for editorial insertions or comments within quotes
- Create clear visual separation between different linked items
- Use parentheses for brief asides or contextual notes
- Include timestamps for time-sensitive content

## Content Focus Guidance

### Primary Topics

- Web development technologies and techniques
- AI and LLM advancements and applications
- Open source tools and projects
- Data science and analysis tools
- Programming languages and frameworks (particularly Python)
- Database technologies
- APIs and web services
- Developer tooling and productivity

### Content Approaches

- Highlight practical applications over purely theoretical discussions
- Focus on aspects that working developers and engineers would find useful
- Provide enough context for readers who might be new to the topic
- Acknowledge limitations and trade-offs in technologies
- Connect new developments to historical context and broader trends
- Emphasize tools and approaches that empower individuals and small teams
- Show special interest in open source, accessible, and democratizing technologies

## Example Snippet in Simon's Style

```
[Introducing Rethinkable: A Fresh Take on Real-time Databases]

Rethinkable launched today, offering an intriguing new approach to real-time database synchronization that feels spiritually similar to Firebase but with some key architectural differences I find compelling.

The standout feature is their "differential snapshots" system, which only transmits the minimal data needed between client and server:

"We've reduced average payload sizes by 73% compared to traditional snapshot approaches by only sending what's changed at the field level," explains founder Jamie Chen.

I'm particularly impressed by their decision to make the client libraries open source (Apache 2.0) while keeping the server proprietary. This strikes a balance that I think works well - you can freely audit and modify the code running in your application while they maintain a sustainable business model.

Their documentation includes a refreshingly honest [limitations page](https://example.com) that acknowledges current shortcomings around complex joins and geospatial queries - features they plan to add later this year.

I spent an hour building a small demo app and found the developer experience delightful. The automatic conflict resolution handled edge cases better than I expected, though I'd want to stress-test it further before using it in production.
```
