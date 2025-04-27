# Context File Maintenance Guidelines

This document outlines how and when to update the various context files in the IFTI project.

## Context File Ecosystem

The IFTI project uses several context files with different purposes and update frequencies:

| Context File | Primary Purpose | Update Frequency | Update Triggers |
|--------------|-----------------|------------------|-----------------|
| active-context.roo.md | Current project state, focus, and decisions | High (Most dynamic) | Task completion, sprint events, major decisions, timeline changes |
| progress-tracker.roo.md | Detailed progress breakdown and roadmap | High | Task completion, sprint events, timeline changes |
| decision-records.roo.md | Architectural decisions and rationales | Medium | New architectural decisions, alternatives evaluation |
| project-context.roo.md | High-level project overview | Low | Project scope changes, major milestone completion |
| product-context.roo.md | Business purpose and product vision | Low | Product vision changes, new market insights |
| tech-context.roo.md | Technology stack and approach | Medium | Technology stack changes, new technical challenges |
| code-patterns.roo.md | Coding standards and patterns | Medium | New coding patterns, standards evolution |
| system-patterns.roo.md | System architecture patterns | Medium | Architecture evolution, new integration patterns |
| integration-context.roo.md | API contracts and integration points | Medium | New integrations, API changes |
| testing-strategy.roo.md | Testing approaches and validation | Medium | New testing approaches, coverage goals changes |
| knowledge-transfer.roo.md | Documentation and onboarding | Low | New onboarding processes, documentation updates |
| release-engineering.roo.md | Release processes and versioning | Medium | Release process changes, versioning updates |
| jira-management.roo.md | Jira ticket management | Low | Ticket workflow changes, new requirements |

## When to Update Context Files

Context files should be updated in the following situations:

1. **After Task Completion (with Roo Code assistance)**
   - Update implementation progress
   - Move completed items to appropriate sections
   - Adjust next steps based on new priorities

2. **During Sprint Planning/Review**
   - Update roadmap and timelines
   - Refresh progress indicators
   - Update current work focus for the new sprint

3. **After Major Architectural Decisions**
   - Document new decisions and their rationale
   - Update related considerations
   - Create or update ADRs in decision-records.roo.md

4. **When Project Scope or Timeline Changes**
   - Update roadmap and timeline sections
   - Adjust risk assessments
   - Update affected requirements or constraints

## File-Specific Update Guidelines

### active-context.roo.md (Most Dynamic)

- **Current Work Focus**: Update after each task completion and sprint planning
- **Implementation Progress**: Update status indicators (✅, 🔲) as tasks are completed
- **Revised Roadmap**: Update percentages and timelines during sprint events
- **Active Decisions**: Add new decisions immediately when made
- **Risks and Mitigations**: Review and update monthly or when new risks emerge
- **Open Questions**: Add new questions as they arise, remove when answered

### progress-tracker.roo.md

- Update detailed task checklists after each task completion
- Maintain the week-by-week structure as the project progresses
- Move completed items to "Recent Achievements" section
- Keep "Known Issues" current and actionable
- Update progress visualization after significant milestones

### decision-records.roo.md

- Add new ADRs as soon as decisions are made
- Include complete information: context, alternatives, impact
- Update status as decisions move from proposed to approved to implemented
- Link to relevant code or documentation when decisions are implemented

### Other Context Files

- Update when relevant changes occur in their domain
- Maintain consistency with active-context.roo.md
- Schedule quarterly reviews to ensure they remain relevant

## Recommended Update Process

1. **Identify Update Trigger**
   - Task completion, sprint event, major decision, or scope change

2. **Determine Affected Files**
   - Always check active-context.roo.md
   - Identify other files based on the update type

3. **Draft Updates with Roo Code**
   - Use Roo Code to help draft appropriate updates
   - Review and refine the suggested changes

4. **Apply Updates**
   - Update files in order of specificity (most specific first)
   - Ensure consistency across related files

5. **Verify Updates**
   - Check that all relevant sections are updated
   - Confirm accuracy of progress indicators and status

## Maintaining Consistency Between Files

- When updating active-context.roo.md, check if progress-tracker.roo.md needs alignment
- New decisions in active-context.roo.md should be documented in detail in decision-records.roo.md
- Major timeline or scope changes should be reflected in both active-context.roo.md and project-context.roo.md

## AI Assistant Responsibilities

As an AI assistant in Code or Architect mode, you should:

1. **Proactively Suggest Updates**: After completing tasks or making decisions, suggest updates to relevant context files
2. **Follow Update Frequency**: Respect the update frequency of each file
3. **Maintain Consistency**: Ensure updates are consistent across related files
4. **Use Proper Formatting**: Maintain the existing structure and formatting of each file
5. **Provide Rationale**: Explain why updates are needed and what has changed