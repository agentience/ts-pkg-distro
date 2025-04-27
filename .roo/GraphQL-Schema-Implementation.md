# GraphQL Schema Implementation Guide

This document contains the finalized GraphQL schema for the IFTI project, designed to be implemented with AWS Amplify.

## Schema Definition

Save the following schema to `amplify/backend/api/iftiapi/schema.graphql`:

```graphql
# Schema version and directives
type Schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

# Enum types
enum ClientStatus {
  ACTIVE
  INACTIVE
}

enum ProjectStatus {
  INITIATED
  FIELDWORK
  ANALYSIS
  REPORTING
  COMPLETED
}

enum TestType {
  SOIL
  CONCRETE
  ASPHALT
  STEEL
  OTHER
}

enum TestStatus {
  PENDING
  VERIFIED
  INVALID
}

enum DocumentType {
  REPORT
  IMAGE
  CONTRACT
  OTHER
}

enum UserRole {
  ADMINISTRATOR
  PROJECT_MANAGER
  FIELD_TECHNICIAN
  ANALYST
  CLIENT
  AUDITOR
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

enum OrganizationType {
  COMPANY
  DEPARTMENT
  TEAM
}

# Organization model
type Organization @model
  @auth(rules: [
    { allow: groups, groups: ["Administrators"], operations: [create, read, update, delete] },
    { allow: authenticated, operations: [read] }
  ])
  @key(name: "byParent", fields: ["parentId"], queryField: "organizationsByParent") {
  id: ID!
  name: String!
  type: OrganizationType!
  parentId: ID
  
  # Relationships (virtual fields)
  parent: Organization @connection(fields: ["parentId"])
  children: [Organization] @connection(keyName: "byParent", fields: ["id"])
  
  # Audit fields
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  createdBy: String!
  updatedBy: String!
}

# Client model
type Client @model
  @auth(rules: [
    { allow: owner },
    { allow: groups, groups: ["Administrators"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["ProjectManagers"], operations: [create, read, update] },
    { allow: groups, groups: ["FieldTechnicians", "Analysts"], operations: [read] },
    { allow: groups, groups: ["Clients", "Auditors"], operations: [read] }
  ])
  @key(name: "byOrganization", fields: ["organizationId", "status", "createdAt"], queryField: "clientsByOrganization")
  @key(name: "byName", fields: ["organizationId", "name"], queryField: "clientsByName") {
  id: ID!
  name: String!
  contactName: String
  email: String
  phone: String
  address: String
  city: String
  state: String
  zipCode: String
  country: String
  status: ClientStatus!
  
  # Organization-based data isolation
  organizationId: ID!
  
  # Relationships (virtual fields)
  projects: [Project] @connection(keyName: "byClient", fields: ["id"])
  
  # Audit fields
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  createdBy: String!
  updatedBy: String!
}

# Project model
type Project @model
  @auth(rules: [
    { allow: owner },
    { allow: groups, groups: ["Administrators"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["ProjectManagers"], operations: [create, read, update] },
    { allow: groups, groups: ["FieldTechnicians", "Analysts"], operations: [read, update] },
    { allow: groups, groups: ["Clients", "Auditors"], operations: [read] }
  ])
  @key(name: "byOrganization", fields: ["organizationId", "status", "createdAt"], queryField: "projectsByOrgStatus")
  @key(name: "byClient", fields: ["clientId", "status"], queryField: "projectsByClient")
  @key(name: "byDate", fields: ["organizationId", "startDate"], queryField: "projectsByDate") {
  id: ID!
  projectName: String!
  description: String
  status: ProjectStatus!
  startDate: AWSDateTime
  endDate: AWSDateTime
  location: String
  
  # Organization-based data isolation
  organizationId: ID!
  
  # Relationships
  clientId: ID!
  client: Client @connection(fields: ["clientId"])
  tests: [TestData] @connection(keyName: "byProject", fields: ["id"])
  documents: [Document] @connection(keyName: "byProject", fields: ["id"])
  
  # Many-to-many relationship with User through join table
  assignedUsers: [ProjectUser] @connection(keyName: "byProject", fields: ["id"])
  
  # Audit fields
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  createdBy: String!
  updatedBy: String!
}

# TestData model
type TestData @model
  @auth(rules: [
    { allow: owner },
    { allow: groups, groups: ["Administrators"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["ProjectManagers"], operations: [read, update] },
    { allow: groups, groups: ["FieldTechnicians"], operations: [create, read, update] },
    { allow: groups, groups: ["Analysts"], operations: [read, update] },
    { allow: groups, groups: ["Clients", "Auditors"], operations: [read] }
  ])
  @key(name: "byProject", fields: ["projectId", "testType", "createdAt"], queryField: "testDataByProject")
  @key(name: "byTechnician", fields: ["technicianId", "testDate"], queryField: "testDataByTechnician")
  @key(name: "byOrganization", fields: ["organizationId", "status", "testDate"], queryField: "testDataByOrganization") {
  id: ID!
  testName: String!
  testType: TestType!
  status: TestStatus!
  testDate: AWSDateTime
  results: String
  notes: String
  
  # Organization-based data isolation
  organizationId: ID!
  
  # Relationships
  projectId: ID!
  project: Project @connection(fields: ["projectId"])
  
  # Reference field for technician
  technicianId: ID
  technician: User @connection(fields: ["technicianId"])
  
  # Relationship to Document
  images: [Document] @connection(keyName: "byTestData", fields: ["id"])
  
  # Audit fields
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  createdBy: String!
  updatedBy: String!
}

# Document model
type Document @model
  @auth(rules: [
    { allow: owner },
    { allow: groups, groups: ["Administrators"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["ProjectManagers"], operations: [create, read, update] },
    { allow: groups, groups: ["FieldTechnicians"], operations: [create, read] },
    { allow: groups, groups: ["Analysts", "Clients", "Auditors"], operations: [read] }
  ])
  @key(name: "byProject", fields: ["projectId", "documentType"], queryField: "documentsByProject")
  @key(name: "byTestData", fields: ["testDataId", "documentType"], queryField: "documentsByTestData")
  @key(name: "byOrganization", fields: ["organizationId", "documentType", "uploadedAt"], queryField: "documentsByOrganization") {
  id: ID!
  fileName: String!
  fileType: String!
  fileSize: Int!
  documentType: DocumentType!
  description: String
  s3Key: String!
  
  # Organization-based data isolation
  organizationId: ID!
  
  # Relationships
  projectId: ID
  project: Project @connection(fields: ["projectId"])
  
  # Reference field for TestData
  testDataId: ID
  testData: TestData @connection(fields: ["testDataId"])
  
  # Audit fields
  uploadedBy: String!
  uploadedAt: AWSDateTime!
  updatedAt: AWSDateTime!
  updatedBy: String
}

# User model
type User @model
  @auth(rules: [
    { allow: owner, operations: [read, update] },
    { allow: groups, groups: ["Administrators"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["ProjectManagers"], operations: [read] }
  ])
  @key(name: "byOrganization", fields: ["organizationId", "role"], queryField: "usersByOrganization")
  @key(name: "byEmail", fields: ["email"], queryField: "userByEmail") {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  phone: String
  role: UserRole!
  status: UserStatus!
  
  # Organization-based data isolation
  organizationId: ID!
  
  # Relationships
  assignedProjects: [ProjectUser] @connection(keyName: "byUser", fields: ["id"])
  tests: [TestData] @connection(keyName: "byTechnician", fields: ["id"])
  
  # Audit fields
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  createdBy: String!
  updatedBy: String!
}

# ProjectUser join model (for many-to-many relationship between Project and User)
type ProjectUser @model
  @auth(rules: [
    { allow: owner },
    { allow: groups, groups: ["Administrators"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["ProjectManagers"], operations: [create, read, update] },
    { allow: groups, groups: ["FieldTechnicians", "Analysts", "Clients", "Auditors"], operations: [read] }
  ])
  @key(name: "byProject", fields: ["projectId", "userId"], queryField: "usersByProject")
  @key(name: "byUser", fields: ["userId", "projectId"], queryField: "projectsByUser") {
  id: ID!
  
  # Reference fields
  projectId: ID!
  userId: ID!
  
  # Organization-based data isolation
  organizationId: ID!
  
  # Relationship fields
  project: Project @connection(fields: ["projectId"])
  user: User @connection(fields: ["userId"])
  
  # Additional fields
  role: String!
  
  # Audit fields
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  createdBy: String!
  updatedBy: String!
}

# Keep the Todo model for testing
type Todo @model
  @auth(rules: [
    { allow: owner, operations: [create, read, update, delete] },
    { allow: authenticated, operations: [read] }
  ]) {
  id: ID!
  title: String!
  description: String
  completed: Boolean
  priority: String
  dueDate: AWSDateTime
  
  # Organization-based data isolation
  organizationId: ID
  
  # Audit fields
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  createdBy: String
  updatedBy: String
}
```

## Implementation Steps

1. **Create the API if it doesn't exist**:
   ```bash
   amplify add api
   ```
   - Select GraphQL
   - Choose Amazon Cognito User Pool for authorization
   - Select "Single object with fields" as the schema template (we'll replace it)

2. **Replace the schema**:
   - Copy the schema above to `amplify/backend/api/iftiapi/schema.graphql`

3. **Push the changes**:
   ```bash
   amplify push
   ```
   - Confirm the changes when prompted
   - Generate code for the API when prompted

4. **Generate models**:
   ```bash
   amplify codegen models
   ```

5. **Update service layer**:
   - Update the service layer to use the generated models and queries
   - Leverage the queryField names for specific access patterns

## Access Pattern Reference

| Access Pattern | GraphQL Query | Index Used |
|----------------|---------------|------------|
| Get clients by organization | `clientsByOrganization(organizationId: "ORG-123", status: "ACTIVE")` | byOrganization |
| Search clients by name | `clientsByName(organizationId: "ORG-123", name: "Acme")` | byName |
| Get projects by organization and status | `projectsByOrgStatus(organizationId: "ORG-123", status: "INITIATED")` | byOrganization |
| Get projects by client | `projectsByClient(clientId: "CLIENT-123", status: "INITIATED")` | byClient |
| Get projects by date | `projectsByDate(organizationId: "ORG-123", startDate: "2023-01-01")` | byDate |
| Get test data by project | `testDataByProject(projectId: "PRJ-123", testType: "SOIL")` | byProject |
| Get test data by technician | `testDataByTechnician(technicianId: "USER-123")` | byTechnician |
| Get documents by project | `documentsByProject(projectId: "PRJ-123", documentType: "REPORT")` | byProject |
| Get documents by test data | `documentsByTestData(testDataId: "TEST-123")` | byTestData |
| Get users by organization and role | `usersByOrganization(organizationId: "ORG-123", role: "ADMINISTRATOR")` | byOrganization |
| Get user by email | `userByEmail(email: "user@example.com")` | byEmail |
| Get users assigned to a project | `usersByProject(projectId: "PRJ-123")` | byProject |
| Get projects assigned to a user | `projectsByUser(userId: "USER-123")` | byUser |

## Performance Considerations

1. **Pagination**:
   - All list queries support pagination with `limit` and `nextToken` parameters
   - Implement infinite scrolling or "Load More" buttons for large lists

2. **Filtering**:
   - Use the optimized indexes for filtering instead of client-side filtering
   - Composite sort keys enable efficient filtering without table scans

3. **Monitoring**:
   - Set up CloudWatch metrics and alarms for early detection of performance issues
   - Monitor ConsumedReadCapacityUnits, ConsumedWriteCapacityUnits, and ThrottledRequests

4. **Custom Resolvers**:
   - Implement custom resolvers for performance-critical operations
   - Use VTL templates for complex queries that can't be efficiently handled by generated resolvers