# Jira Ticket Management

This document outlines the practices and procedures for managing Jira tickets throughout the development lifecycle.  

The Jira Project Key for this project is 'TPDM'. Jira issue numbers are always assigned by Jira once the issue is created.

## Jira Ticket Creation Workflow

- **Create Tickets Before Development**: Always create or ensure a Jira ticket exists BEFORE starting any development work
- **Required Fields by Issue Type**:
  - **Story**: Must include:
    - Acceptance criteria that clearly define when the story is complete
    - Reference to parent Epic (if applicable)
    - User-focused description in the format "As a [user], I want [capability] so that [benefit]"
  - **Bug**: Must include steps to reproduce and expected behavior
  - **Task**: Must include clear definition of done
  - **Epic**: Must include:
    - A clear business objective or goal the epic addresses
    - High-level scope definition with boundaries
    - Success metrics or KPIs to measure completion
    - Dependencies on other epics or systems (if any)
    - Estimated timeline (sprints/iterations)
- **Creating Tickets Programmatically**:
  ```python
  # Example: Create a Story with acceptance criteria
  call_tool("jira-server", "create_issue", {
      "projectKey": "{project-key}",
      "summary": "Implement feature X",
      "issueType": "Story",
      "description": "As a user, I want to...\n\n*Acceptance Criteria:*\n1. Feature works when...\n2. Tests are added for...\n3. Documentation is updated with...",
      "priority": "Medium"
  })
  ```

## Ticket Status Management

- Set ticket to "In Progress" when starting work using `update_issue` tool
- Include ticket ID in branch names and commits
- Reference tickets in PR descriptions
- Run all tests before marking any work as complete
- Update ticket status to "Done" ONLY after all acceptance criteria are met and tests pass
- Use `update_issue` tool to update status throughout the development lifecycle

## Ticket Completion Requirements

Before marking any ticket as "Done":

1. **Verify All Acceptance Criteria**: Each item in the acceptance criteria must be explicitly verified
2. **Run All Tests**: All test suites relevant to the changes must pass:
   ```bash
   # Run relevant test suites
   python -m pytest tests/unit/ tests/integration/
   ```
3. **Update Documentation**: Ensure documentation reflects any changes made
4. **Update Jira Status**: Only after all above requirements are met
   ```python
   # Update ticket status to Done
   call_tool("jira-server", "update_issue", {
       "issueKey": "{project-key}-123",
       "status": "Done"
   })
   ```

## Issue Linking

- Link related issues appropriately
- Use proper link types (e.g., "blocks", "is blocked by")
- Include linked issues in PR descriptions

## Issue Hierarchy and Relationships

- **Epic-Story Relationship**:
  - Stories should be linked to their parent Epic using the "Epic Link" field
  - When creating a Story, always verify if it belongs to an Epic
  - Stories without an Epic should be exceptions, not the norm
  - When describing a Story's context, reference its parent Epic
  - Story acceptance criteria should align with Epic success metrics

- **Creating Child Stories from Epics**:
  ```python
  # Example: Create a Story linked to Epic {project-key}-8
  call_tool("jira-server", "create_issue", {
      "projectKey": "{project-key}",
      "summary": "Implement configuration validation",
      "issueType": "Story",
      "description": "As a developer, I want to validate my configuration file so that I can catch errors before runtime.\n\n*Part of Epic: {project-key}-8 (Configuration System)*\n\n*Acceptance Criteria:*\n1. Validates against JSON schema\n2. Provides clear error messages\n3. Tests cover validation edge cases",
      "priority": "Medium",
      "customFields": {
          "epic-link": "{project-key}-8"  # Link to parent Epic
      }
  })