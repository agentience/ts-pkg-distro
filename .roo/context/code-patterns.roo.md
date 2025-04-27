# IFTI Code Patterns

This document outlines the coding standards, reusable patterns, implementation examples, and architecture-code links for the IFTI project.

## Coding Standards

This section defines the coding standards and best practices to be followed across the IFTI codebase.

- TypeScript coding standards
- React component structure
- AWS Amplify integration patterns
- Error handling conventions
- Logging standards
- Documentation requirements

## Reusable Patterns

This section documents reusable code patterns that should be leveraged throughout the IFTI application.

- Authentication and authorization patterns
- Data fetching and state management
- Form handling and validation
- Error boundary implementation
- Component composition patterns
- Custom hooks for common functionality

## Implementation Examples

This section provides concrete examples of implementing the defined patterns in the IFTI codebase.

- Authentication flow implementation
- Data model integration with UI components
- File upload and management
- User profile management
- Dashboard data visualization
- Navigation and routing implementation

## Architecture-Code Links

This section maps architectural decisions to specific code implementations, helping developers understand how high-level design translates to code.

- Service layer implementation
- Component hierarchy and organization
- State management approach
- API integration strategy
- Error handling and recovery mechanisms
- Performance optimization techniques

## Post-Merge Practices

This section outlines the required practices to follow after merging branches to maintain code quality and prevent integration issues.

### Workspace Problem Resolution

- **Immediate Resolution Requirement**: All TypeScript errors, ESLint warnings, and other workspace problems must be fixed immediately after merging branches
- **Zero-Tolerance Policy**: The codebase should maintain zero TypeScript errors and ESLint warnings at all times
- **Shared Responsibility**: The developer who performed the merge is responsible for fixing any resulting workspace problems
- **Documentation**: If fixing a complex issue, document the solution using the Tribal Knowledge system

### Post-Merge Testing

- **Test Execution Requirement**: Run all tests after merging branches to ensure no regressions
- **Test Coverage Verification**: Ensure test coverage hasn't decreased after the merge
- **Failed Tests**: Any failed tests must be fixed before continuing with new development work
- **New Tests**: Add tests for any new functionality introduced during the merge

### Common Merge Issue Resolution

- **Conflicting Type Definitions**: Resolve by carefully reviewing both versions and creating a unified type that satisfies all use cases
- **Duplicate Declarations**: Remove duplicates while ensuring all necessary functionality is preserved
- **Import Path Issues**: Update import paths to reflect any file structure changes
- **Dependency Version Conflicts**: Resolve by updating to compatible versions and testing thoroughly
- **Style Rule Violations**: Fix by applying consistent styling according to project standards

### Post-Merge Verification Checklist

- [ ] All TypeScript errors are resolved
- [ ] All ESLint warnings are fixed
- [ ] All tests pass successfully
- [ ] Application builds without errors
- [ ] Application runs locally without issues
- [ ] Any new functionality works as expected
- [ ] Code review comments from the PR have been addressed
- [ ] Documentation has been updated if necessary
- [ ] Complex issue resolutions have been documented in Tribal Knowledge

### Automation Recommendations

- Configure CI/CD pipeline to run type checking and linting on every PR
- Set up pre-commit hooks to prevent committing code with TypeScript errors or ESLint warnings
- Implement automated test runs after merges to detect issues early
- Create custom VS Code workspace settings to highlight TypeScript and ESLint issues prominently

## MCP Server Tools

### Pre-commit and License Tools

The following tools from the practices MCP server should be leveraged for repository setup and license management:

#### 1. Repository Setup Tools

- `check_git_repo_init`: Detects newly initialized repositories
  - Example: `call_tool("practices", "check_git_repo_init", { "repo_path": "." })`
  - Returns whether repository was recently initialized
  - Use this to determine if a repository needs initial setup

#### 2. Pre-commit Hook Management

- `install_pre_commit_hooks`: Sets up pre-commit hooks
  - Example: `call_tool("practices", "install_pre_commit_hooks", { "repo_path": "." })`
  - Installs and configures pre-commit hooks
  - Should be run for all new repositories and when updating hook configurations

#### 3. License Header Management

- `add_license_header`: Adds license headers to individual files
  - Example: `call_tool("practices", "add_license_header", { "filename": "src/file.py", "description": "Brief file description" })`
  - Adds standardized license header to the file
  - Use for new files or when updating existing files without proper headers

- `process_license_headers_batch`: Processes multiple files
  - Example: `call_tool("practices", "process_license_headers_batch", { "directory": "src", "pattern": "*.py", "recursive": true, "check_only": false })`
  - Adds or checks headers for multiple files
  - Use for bulk operations or during repository setup

#### When to Use These Tools

1. **New Repository Setup**:
   - Check if repository is newly initialized with `check_git_repo_init`
   - Install pre-commit hooks with `install_pre_commit_hooks`
   - Add license headers to all files with `process_license_headers_batch`

2. **New File Creation**:
   - Add license header to new file with `add_license_header`

3. **Code Reviews**:
   - Verify license headers with `process_license_headers_batch` using `check_only: true`

4. **Repository Maintenance**:
   - Periodically run `process_license_headers_batch` to ensure all files have proper headers

## Error Management with Tribal Knowledge

### Using the Tribal MCP Server for Error Documentation

Whenever an error occurs and is solved during development, the solution must be documented using the tribal MCP server to build a knowledge base for future reference.

#### 1. Error Documentation Process

When you encounter and solve an error:

1. Document the error details and solution using the `store_knowledge` tool
2. Include relevant context, error messages, and the complete solution
3. Add appropriate tags for easy retrieval

Example:
```python
call_tool("tribal", "store_knowledge", {
    "title": "AWS Amplify Auth Configuration Error",
    "problem": "Error: The 'Auth' category is not properly configured. (Error code: AUTH_CONFIGURATION_ERROR)",
    "solution": "The issue was caused by missing userPoolId in the Amplify configuration. Fixed by adding the correct userPoolId in the auth/resource.ts file.",
    "context": "This occurred during initial setup of the Amplify Auth module.",
    "tags": ["aws", "amplify", "auth", "configuration", "error"]
})
```

#### 2. Error Knowledge Retrieval

When encountering an error, first check if a solution already exists:

```python
call_tool("tribal", "search_knowledge", {
    "query": "AWS Amplify Auth Configuration Error",
    "tags": ["amplify", "auth"]
})
```

#### 3. When to Document Errors

Document errors and solutions in the following situations:

- Non-trivial errors that took significant time to resolve
- Errors with misleading or unclear error messages
- Errors related to configuration or environment setup
- Errors that might be encountered by other team members
- Errors that required workarounds or special handling

#### 4. Required Information

Each error documentation must include:

- **Title**: Clear, searchable title describing the error
- **Problem**: Detailed description of the error, including exact error messages
- **Solution**: Step-by-step resolution that worked
- **Context**: When/where the error occurred, relevant system state
- **Tags**: Relevant keywords for future searching

#### 5. Automatic Error Documentation Triggers

The following situations should automatically trigger error documentation:

- After spending more than 30 minutes debugging an issue
- When resolving an error that was reported in a Jira ticket
- When fixing a bug that was caused by a misunderstanding or unclear documentation
- When discovering a workaround for a third-party library or service limitation

#### 6. Team Knowledge Sharing

- Reference the tribal knowledge base in code reviews when relevant
- Periodically review and update existing error documentation
- Use the knowledge base during onboarding of new team members