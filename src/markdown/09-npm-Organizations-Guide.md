# Comprehensive Guide to npm Organizations (Scopes)

## What Are npm Organizations/Scopes?

npm organizations provide a way to group related packages and manage access to them. Each organization is granted a unique namespace called a "scope" that matches the organization name. For example, an organization named "agentience" would have the scope `@agentience`.

### Benefits of npm Organizations:

1. **Namespace Management**: Secure a consistent namespace for all your packages (e.g., `@agentience/ts-pkg-distro`)
2. **Access Control**: Manage who can access, publish, and maintain packages
3. **Team Collaboration**: Create teams with different permission levels
4. **Branding**: Establish a recognizable brand for your packages
5. **Avoid Name Conflicts**: Use scopes to avoid naming conflicts with popular package names
6. **Package Organization**: Easily group and find related packages
7. **Maintain Forks**: Create scoped versions of existing packages (e.g., `@agentience/lodash`)
8. **Private Packages**: Option to publish private packages (with paid plans)

## Creating an npm Organization

### Step-by-Step Instructions:

1. **Ensure you have an npm account**: Create one at [npmjs.com/signup](https://www.npmjs.com/signup) if needed
2. **Sign in to npm**: Go to [npmjs.com/login](https://www.npmjs.com/login)
3. **Create the organization**:
   - Click your profile picture in the upper right corner
   - Select "Add an Organization"
   - Enter a name for your organization (this will also be your scope name, e.g., "agentience")
   - Choose a plan:
     - "Unlimited public packages" (free)
     - "Unlimited private packages" (paid)
   - Click "Create" or "Buy" depending on your plan selection
4. **Invite members** (optional):
   - Enter npm usernames or email addresses
   - Select a team to add them to
   - Click "Invite"
5. **Click "Continue"** to finish the setup

## Organization Roles and Permissions

npm organizations have three distinct roles with different permission levels:

| Role | Permissions |
|------|-------------|
| **Owner** | • Manage organization billing<br>• Add/remove members<br>• Rename/delete the organization<br>• Change member roles<br>• Add org packages to other orgs<br>• Create/delete teams<br>• Manage team membership<br>• Manage package access<br>• Create/publish packages |
| **Admin** | • Create/delete teams<br>• Add/remove members from teams<br>• Manage team package access<br>• Create/publish packages |
| **Member** | • Create and publish packages in the organization scope |

**Note**: You cannot remove the last owner from an organization. To delete an organization, you must contact npm Support.

## Adding Members and Managing Permissions

### Adding Members to Your Organization:

1. Sign in to npm and go to your account settings
2. Click on your organization name in the left sidebar
3. Click the "Members" tab
4. Enter the npm username or email address of the person you want to add
5. Select their role (Owner, Admin, or Member)
6. Click "Add member"

### Changing Member Roles:

1. Sign in to npm and go to your account settings
2. Click on your organization name in the left sidebar
3. Click the "Members" tab
4. Find the member whose role you want to change
5. Click on their current role and select the new role (Member, Admin, or Owner)

### Creating and Managing Teams:

1. Sign in to npm and go to your account settings
2. Click on your organization name in the left sidebar
3. Click the "Teams" tab
4. Click "Create team" and enter a team name
5. Add members to the team
6. Assign package access permissions to the team

## Public vs. Private Packages in Organizations

### Public Packages:

- **Visibility**: Available to everyone, even those not in your organization
- **Cost**: Free to publish and use
- **Publishing Command**: `npm publish --access public`
- **Use Case**: Open-source projects, public libraries, community contributions

### Private Packages:

- **Visibility**: Only available to members of your organization
- **Cost**: Requires a paid plan ($7 per user per month)
- **Publishing Command**: `npm publish` (private by default for scoped packages)
- **Use Case**: Proprietary code, internal libraries, commercial products

**Important**: By default, scoped packages are published with private visibility. To publish a scoped package with public visibility, you must explicitly use the `--access public` flag.

## npm Organization Pricing

npm offers several pricing tiers for organizations:

### Free Plan:
- Unlimited public packages
- Basic support
- No private packages
- No team-based permissions

### Teams Plan ($7 per user per month):
- Unlimited public packages
- Unlimited private packages
- Team-based permissions
- Basic support

## Best Practices for Managing Packages in Organizations

1. **Consistent Naming Conventions**:
   - Use clear, descriptive package names
   - Follow a consistent pattern (e.g., `@agentience/component-button`, `@agentience/component-form`)

2. **Version Management**:
   - Follow semantic versioning (MAJOR.MINOR.PATCH)
   - Use `npm version` commands to update versions consistently

3. **Documentation**:
   - Include comprehensive README files
   - Document the purpose, installation, and usage of each package
   - Add examples and API documentation

4. **Access Control**:
   - Create teams based on project needs or functional areas
   - Assign the minimum necessary permissions
   - Regularly audit team memberships and permissions

5. **CI/CD Integration**:
   - Set up automated publishing through CI/CD pipelines
   - Use GitHub Actions or similar tools for automated testing and publishing
   - Store npm tokens securely as environment secrets

6. **Package Quality**:
   - Include tests for all packages
   - Set up linting and code quality checks
   - Review packages before publishing

7. **Security**:
   - Regularly update dependencies
   - Use npm audit to check for vulnerabilities
   - Remove sensitive information before publishing

8. **Publishing Workflow**:
   - Test packages locally before publishing
   - Use `npm pack` to verify package contents
   - Consider using a staging environment for testing
   - Use the `npm-org` configuration option for consistent package naming

9. **Organization Structure**:
   - Create separate teams for different projects or responsibilities
   - Consider having a dedicated "publishers" team for critical packages
   - Implement a review process for package changes

10. **Configuration Management**:
    - Use the `npm-org` configuration option in `mcp-config.json` to manage organization scopes
    - Store configuration in version control to ensure consistency across environments
    - Document configuration options and their effects in your project README

## Publishing Packages Under Your Organization Scope

### Using the npm-org Configuration Option (Recommended):

The package supports an `npm-org` configuration option that simplifies publishing packages under your organization scope. This is especially useful for CI/CD pipelines and maintaining consistent package naming across environments.

1. Create or update your `mcp-config.json` file to include the `npm-org` option:
   ```json
   {
     "server": {
       "name": "Your-Package-Name",
       "version": "1.0.0"
     },
     "transport": {
       "type": "stdio",
       "options": {}
     },
     "npm-org": "agentience"
   }
   ```

2. The package will automatically:
   - Update the package name in `package.json` to include your organization scope
   - Add the `--access public` flag when publishing

3. Benefits:
   - Consistent package naming across development and CI/CD environments
   - Automatic handling of the `--access public` flag
   - No need to manually modify `package.json` for each publish
   - Simplified configuration management for projects with multiple packages

4. When using with GitHub Actions or other CI/CD systems:
   - The workflow automatically detects the `npm-org` configuration
   - Adjusts the package name and publishing command accordingly
   - Ensures consistent publishing behavior across all environments

### Creating a New Scoped Package (Manual Method):

1. Create a new directory for your package:
   ```bash
   mkdir my-package
   cd my-package
   ```

2. Initialize the package with your organization scope:
   ```bash
   npm init --scope=@agentience
   ```

3. Add your code, documentation, and tests

4. Publish as a public package:
   ```bash
   npm publish --access public
   ```

### Converting an Existing Package to Use Your Organization Scope (Manual Method):

1. Update the `name` field in `package.json` to include your scope:
   ```json
   {
     "name": "@agentience/ts-pkg-distro",
     "version": "1.0.0",
     ...
   }
   ```

2. Update any imports/requires in your code to use the scoped name

3. Publish with the public access flag:
   ```bash
   npm publish --access public
   ```

4. Update documentation to reflect the new scoped name

## Conclusion

npm organizations provide a powerful way to manage and organize your packages, control access, and collaborate with team members. By creating the @agentience organization, you've established a dedicated namespace for your packages and set the foundation for scalable package management.

Whether you're publishing open-source libraries or private internal packages, npm organizations give you the tools to maintain, distribute, and control access to your code effectively.