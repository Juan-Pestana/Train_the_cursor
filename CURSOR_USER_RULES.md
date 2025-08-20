# Cursor User Rules - General Preferences

## Core Principles

### 1. Simplicity First

- **KISS (Keep It Simple, Stupid)** - Prefer simple, readable solutions over complex ones
- **Avoid over-engineering** - Don't add complexity unless absolutely necessary
- **Clear intent** - Code should be self-documenting and easy to understand
- **Minimal dependencies** - Only add libraries when they solve real problems

### 2. DRY (Don't Repeat Yourself)

- **Extract common patterns** - Create reusable functions and components
- **Single source of truth** - Avoid duplicating data or logic
- **Consistent patterns** - Use the same approach for similar problems
- **Refactor early** - Clean up repetition as you go

### 3. Type Safety

- **TypeScript over JavaScript** - Always prefer TypeScript when possible
- **Strict typing** - Avoid `any` types, use proper interfaces and types
- **Runtime validation** - Use schemas (Zod, Joi, etc.) for data validation
- **Type inference** - Let TypeScript infer types when possible

### 4. Clean Architecture

- **Separation of concerns** - Keep UI, business logic, and data separate
- **Dependency inversion** - Depend on abstractions, not concretions
- **Single responsibility** - Each function/component should do one thing well
- **Testable code** - Write code that's easy to test

## Code Quality Standards

### Readability

- **Descriptive names** - Variables, functions, and components should have clear names
- **Consistent formatting** - Use consistent indentation, spacing, and style
- **Logical structure** - Organize code in a logical flow
- **Comments when needed** - Explain complex logic, not obvious code

### Maintainability

- **Modular design** - Break large components/functions into smaller, focused ones
- **Consistent patterns** - Use the same patterns throughout the codebase
- **Clear interfaces** - Define clear contracts between modules
- **Version control friendly** - Write code that's easy to review and merge

### Performance

- **Efficient algorithms** - Choose appropriate data structures and algorithms
- **Lazy loading** - Load resources only when needed
- **Caching strategies** - Cache expensive operations appropriately
- **Memory management** - Avoid memory leaks and unnecessary allocations

## Development Workflow

### Before Writing Code

- **Understand requirements** - Make sure you understand what needs to be built
- **Plan the approach** - Think about the best way to solve the problem
- **Consider edge cases** - Think about error conditions and edge cases
- **Check existing patterns** - Look for similar patterns in the codebase

### While Writing Code

- **Write tests first** - Use TDD when appropriate
- **Iterate quickly** - Get something working, then improve it
- **Refactor continuously** - Clean up code as you write it
- **Validate assumptions** - Test your assumptions about how things work

### After Writing Code

- **Review your code** - Look for ways to improve it
- **Test thoroughly** - Make sure it works as expected
- **Document changes** - Update documentation if needed
- **Consider impact** - Think about how changes affect other parts of the system

## Technology Preferences

### Frontend

- **React/Next.js** - Prefer React with Next.js for full-stack applications
- **TypeScript** - Always use TypeScript for type safety
- **Component libraries** - Use established UI libraries (shadcn/ui, MUI, etc.)
- **State management** - Choose appropriate tools (Zustand, Redux, Context)
- **Styling** - Prefer utility-first CSS (Tailwind v4+) with `@theme` directive

### Backend

- **Node.js/TypeScript** - Prefer Node.js with TypeScript
- **API design** - RESTful APIs with clear contracts
- **Database** - Use appropriate databases (PostgreSQL, SQLite, etc.)
- **Validation** - Always validate input data
- **Error handling** - Comprehensive error handling and logging

### Tools & Libraries

- **Modern tooling** - Use current versions of tools and libraries
- **Established libraries** - Prefer well-maintained, popular libraries
- **Minimal dependencies** - Only add dependencies when necessary
- **Security first** - Choose secure libraries and practices

## Problem-Solving Approach

### 1. Understand the Problem

- **Ask questions** - Clarify requirements and constraints
- **Break it down** - Decompose complex problems into smaller parts
- **Identify patterns** - Look for similar problems you've solved before
- **Consider trade-offs** - Think about performance, maintainability, etc.

### 2. Choose the Right Solution

- **Simple over complex** - Start with the simplest solution that works
- **Proven patterns** - Use established patterns and best practices
- **Consider future** - Think about how the solution will scale
- **Document decisions** - Explain why you chose a particular approach

### 3. Implement Incrementally

- **Start small** - Get a basic version working first
- **Add features** - Gradually add complexity and features
- **Test continuously** - Test each increment
- **Refactor as needed** - Clean up code as you go

### 4. Validate the Solution

- **Test thoroughly** - Make sure it works in all scenarios
- **Performance check** - Ensure it performs well
- **Security review** - Check for security issues
- **User feedback** - Get feedback from users if possible

## Communication Style

### Code Comments

- **Explain why, not what** - Comment on the reasoning, not the obvious
- **Keep comments current** - Update comments when code changes
- **Use clear language** - Write comments that are easy to understand
- **Document decisions** - Explain important design decisions

### Code Reviews

- **Constructive feedback** - Provide helpful, specific feedback
- **Ask questions** - Clarify unclear code or decisions
- **Suggest improvements** - Offer concrete suggestions for improvement
- **Focus on code** - Keep feedback focused on the code, not the person

### Documentation

- **Keep it simple** - Write documentation that's easy to understand
- **Include examples** - Provide concrete examples
- **Update regularly** - Keep documentation current with code changes
- **Focus on users** - Write for the people who will use the code

## Learning & Growth

### Stay Current

- **Follow trends** - Keep up with new technologies and practices
- **Read code** - Study well-written code from others
- **Practice regularly** - Write code regularly to improve skills
- **Learn from mistakes** - Reflect on and learn from errors

### Share Knowledge

- **Document learnings** - Write about what you've learned
- **Help others** - Share knowledge with teammates
- **Open source** - Contribute to open source projects
- **Teach concepts** - Explain concepts to others to solidify understanding

### Continuous Improvement

- **Seek feedback** - Ask for feedback on your code and approach
- **Reflect regularly** - Think about what you could do better
- **Set goals** - Set specific goals for improvement
- **Measure progress** - Track your improvement over time

## Common Patterns to Follow

### Error Handling

- **Fail fast** - Detect and handle errors early
- **Graceful degradation** - Provide fallbacks when possible
- **User-friendly messages** - Show helpful error messages to users
- **Logging** - Log errors for debugging

### Performance

- **Measure first** - Profile before optimizing
- **Optimize bottlenecks** - Focus on the biggest performance issues
- **Cache appropriately** - Use caching for expensive operations
- **Lazy load** - Load resources only when needed

### Security

- **Validate input** - Always validate and sanitize user input
- **Use HTTPS** - Use secure connections
- **Follow OWASP** - Follow security best practices
- **Keep dependencies updated** - Regularly update dependencies

### Testing

- **Test critical paths** - Focus on testing the most important functionality
- **Use realistic data** - Test with data that resembles real usage
- **Test edge cases** - Test boundary conditions and error cases
- **Automate tests** - Automate repetitive testing tasks
