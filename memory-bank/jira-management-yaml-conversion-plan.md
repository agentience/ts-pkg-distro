# Plan for Converting Jira Management Markdown to YAML

## Overview

This document outlines the plan for converting the `.roo/rules-architect/jira-management.roo.md` file to a YAML format while preserving all the information and structure.

## Current Limitations

In Architect mode, we can only edit files with the `.md` extension. To create or edit a YAML file, we'll need to switch to Code mode after creating this plan.

## YAML Structure

The YAML file will have the following structure:

```yaml
# Jira Ticket Management Configuration

title: "Jira Ticket Management"
description: "Practices and procedures for managing Jira tickets throughout the development lifecycle"

ticket_creation_workflow:
  principles:
    - name: "Create Tickets Before Development"
      description: "Always create or ensure a Jira ticket exists BEFORE starting any development work"
  
  required_fields:
    story:
      - "Acceptance criteria that clearly define when the story is complete"
      - "Reference to parent Epic (if applicable)"
      - "User-focused description in the format 'As a [user], I want [capability] so that [benefit]'"
    bug:
      - "Steps to reproduce"
      - "Expected behavior"
    task:
      - "Clear definition of done"
    epic:
      - "A clear business objective or goal the epic addresses"
      - "High-level scope definition with boundaries"
      - "Success metrics or KPIs to measure completion"
      - "Dependencies on other epics or systems (if any)"
      - "Estimated timeline (sprints/iterations)"
  
  programmatic_creation:
    example:
      tool: "jira-server"
      action: "create_issue"
      parameters:
        projectKey: "{project-key}"
        summary: "Implement feature X"
        issueType: "Story"
        description: "As a user, I want to...\n\n*Acceptance Criteria:*\n1. Feature works when...\n2. Tests are added for...\n3. Documentation is updated with..."
        priority: "Medium"

ticket_status_management:
  guidelines:
    - "Set ticket to 'In Progress' when starting work using update_issue tool"
    - "Include ticket ID in branch names and commits"
    - "Reference tickets in PR descriptions"
    - "Run all tests before marking any work as complete"
    - "Update ticket status to 'Done' ONLY after all acceptance criteria are met and tests pass"
    - "Use update_issue tool to update status throughout the development lifecycle"

ticket_completion_requirements:
  steps:
    - name: "Verify All Acceptance Criteria"
      description: "Each item in the acceptance criteria must be explicitly verified"
    - name: "Run All Tests"
      description: "All test suites relevant to the changes must pass"
      example: "python -m pytest tests/unit/ tests/integration/"
    - name: "Update Documentation"
      description: "Ensure documentation reflects any changes made"
    - name: "Update Jira Status"
      description: "Only after all above requirements are met"
      example:
        tool: "jira-server"
        action: "update_issue"
        parameters:
          issueKey: "{project-key}-123"
          status: "Done"

issue_linking:
  guidelines:
    - "Link related issues appropriately"
    - "Use proper link types (e.g., 'blocks', 'is blocked by')"
    - "Include linked issues in PR descriptions"

issue_hierarchy:
  epic_story_relationship:
    guidelines:
      - "Stories should be linked to their parent Epic using the 'Epic Link' field"
      - "When creating a Story, always verify if it belongs to an Epic"
      - "Stories without an Epic should be exceptions, not the norm"
      - "When describing a Story's context, reference its parent Epic"
      - "Story acceptance criteria should align with Epic success metrics"
  
  creating_child_stories:
    example:
      tool: "jira-server"
      action: "create_issue"
      parameters:
        projectKey: "{project-key}"
        summary: "Implement configuration validation"
        issueType: "Story"
        description: "As a developer, I want to validate my configuration file so that I can catch errors before runtime.\n\n*Part of Epic: {project-key}-8 (Configuration System)*\n\n*Acceptance Criteria:*\n1. Validates against JSON schema\n2. Provides clear error messages\n3. Tests cover validation edge cases"
        priority: "Medium"
        customFields:
          epic-link: "{project-key}-8"
```

## Implementation Steps

1. Switch to Code mode using the `switch_mode` tool
2. Create the YAML file at `.roo/rules-architect/jira-management.roo.yml` with the structure outlined above
3. Verify that the YAML file contains all the information from the original markdown file
4. Keep the original markdown file for reference

## Benefits of YAML Format

1. **Structured Data**: YAML provides a more structured format for configuration data
2. **Programmatic Access**: Easier to parse and use programmatically
3. **Validation**: Can be validated against a schema
4. **Consistency**: Enforces a consistent structure for the data

## Next Steps

After creating the YAML file, we can update any references to the markdown file to point to the YAML file instead, or maintain both files in parallel depending on the requirements.