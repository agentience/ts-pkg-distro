# Workflow Orchestration

This document outlines patterns and practices for orchestrating workflows across different modes in the IFTI project.

## Task Breakdown Patterns

### Feature Implementation Workflow

1. **Architect Mode**: Design the feature architecture and make key technical decisions
2. **Code Mode**: Implement the core functionality
3. **Debug Mode**: Test and troubleshoot any issues
4. **Code Mode**: Refine implementation based on testing
5. **Release Engineer Mode**: Prepare for release and deployment

### Bug Resolution Workflow

1. **Debug Mode**: Diagnose the issue and identify root cause
2. **Code Mode**: Implement the fix
3. **Debug Mode**: Verify the fix resolves the issue
4. **Release Engineer Mode**: Prepare for release and deployment

### Research and Decision Workflow

1. **Ask Mode**: Research options and gather information
2. **Architect Mode**: Evaluate alternatives and make decisions
3. **Code Mode**: Implement proof of concept if needed
4. **Architect Mode**: Finalize decision based on POC results

## Mode Transition Patterns

### When to Transition

- **Completion-Based**: Transition when a discrete task is completed
- **Expertise-Based**: Transition when specialized knowledge is required
- **Blocker-Based**: Transition when progress is blocked by a different concern
- **Iterative**: Transition back and forth between modes during iterative development

### How to Transition

1. **Clear Handoff**: Provide complete context and specific instructions
2. **Defined Scope**: Clearly define the scope of work for the target mode
3. **Success Criteria**: Specify what successful completion looks like
4. **Return Instructions**: Indicate what should happen after the delegated task

## Complex Task Orchestration

### Multi-Phase Project Pattern

1. **Planning Phase**:
   - Architect Mode: Define architecture and technical approach
   - Ask Mode: Research technologies and approaches
   - Architect Mode: Make key technical decisions

2. **Implementation Phase**:
   - Code Mode: Set up project structure
   - Code Mode: Implement core functionality
   - Debug Mode: Address issues as they arise

3. **Refinement Phase**:
   - Debug Mode: Comprehensive testing
   - Code Mode: Refinements and optimizations
   - Architect Mode: Architecture review

4. **Release Phase**:
   - Release Engineer Mode: Prepare for deployment
   - Debug Mode: Final validation
   - Release Engineer Mode: Execute release

### Parallel Workstreams Pattern

1. **Stream Coordination**:
   - Boomerang Mode: Coordinate overall progress
   - Architect Mode: Ensure architectural consistency

2. **Stream A: Frontend**:
   - Code Mode: Implement UI components
   - Debug Mode: Test UI functionality

3. **Stream B: Backend**:
   - Code Mode: Implement API endpoints
   - Debug Mode: Test API functionality

4. **Stream C: Infrastructure**:
   - Release Engineer Mode: Set up deployment pipeline
   - Code Mode: Implement infrastructure as code

5. **Integration**:
   - Debug Mode: Integration testing
   - Code Mode: Address integration issues

## Progress Tracking and Reporting

### Milestone Tracking

- Define clear milestones for complex workflows
- Track progress against milestones
- Report status at milestone boundaries

### Blockers and Dependencies

- Identify dependencies between tasks
- Track blockers that prevent progress
- Coordinate resolution of blockers

### Status Reporting

- Maintain current status in active-context.roo.md
- Update progress-tracker.roo.md after significant progress
- Communicate status across mode transitions