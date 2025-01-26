# Main Navigation Layout Implementation Plan

## Component Architecture Principles
- Build small, focused components that do one thing well
- Create base components that can be extended for specific use cases
- Use composition over inheritance
- Implement prop drilling protection with React Context where needed
- Follow atomic design principles:
  - Atoms: Basic UI elements (buttons, inputs, icons)
  - Molecules: Simple component combinations (search bars, menu items)
  - Organisms: Complex UI sections (navigation bars, sidebars)
  - Templates: Page-level component arrangements
  - Pages: Specific implementations of templates

## 1. Base Components (Atoms)
- [x] Create reusable primitive components
  - [x] `BaseInput` - Form inputs with validation ✅
  - [x] `BaseLink` - Navigation links with routing ✅
  - [x] `BaseText` - Typography system ✅
  - [x] `BaseBadge` - Status indicators ✅
  - [x] `BaseCard` - Container component ✅

## 2. Composite Components (Molecules)
- [x] Create NavItem component ✅
- [x] Create MenuGroup component ✅
- [x] Implement role-based navigation items ✅

## 3. Layout Components (Organisms)
- [x] Create `MainLayout` component ✅
  - [x] Flexible slot system for content ✅
  - [x] Configurable navigation areas ✅
  - [x] Responsive container queries ✅
- [x] Build `TopNav` component ✅
  - [x] Composable sections (left, center, right) ✅
  - [x] Responsive collapse strategies ✅
- [x] Implement `Sidebar` component ✅
  - [x] Configurable width and behavior ✅
  - [x] Collapsible with multiple modes ✅
  - [x] Role-based navigation ✅
  - [x] Grouped navigation sections ✅

## 4. Portal-Specific Components
- [x] Create base portal template ✅
- [x] Implement Volunteer Portal ✅
  - [x] Dashboard view ✅
  - [x] Navigation structure ✅
  - [x] Feature grouping ✅
- [x] Implement Donor Portal ✅
  - [x] Dashboard view ✅
  - [x] Navigation structure ✅
  - [x] Feature grouping ✅
- [ ] Implement Partner Portal
- [ ] Implement Admin Portal

## 5. Shared Features
- [x] Create `PortalSwitcher` using base components ✅
- [x] Build `UserMenu` using menu group components ✅
- [x] Implement `NotificationCenter` using base components ✅

## 6. State Management
- [x] Implement navigation context (using Redux) ✅
- [x] Create portal state management ✅
- [x] Add user preferences system ✅
- [x] Role-based navigation state ✅

## 7. Responsive Implementation
- [x] Create responsive utility components ✅
- [x] Implement mobile-first breakpoint system ✅
- [x] Add touch-friendly interaction patterns ✅

## 8. UI/UX Patterns
- [x] Create consistent loading states ✅
- [x] Implement smooth transitions ✅
- [x] Add hover/focus interactions ✅
- [x] Implement keyboard navigation ✅

## Component Reuse Guidelines
1. **Use Base Components First**
   - Start with base components for all UI elements
   - Compose more complex components from base ones
   - Maintain consistent styling and behavior

2. **Navigation Patterns**
   - Use `BaseLink` for all navigation
   - Wrap in `NavItem` for consistent styling
   - Group related items in sections
   - Use role-based feature filtering

3. **Layout Structure**
   - Use `BaseCard` for content containers
   - Apply consistent padding and spacing
   - Follow responsive design patterns

4. **Typography and Visual Hierarchy**
   - Use `BaseText` for all text content
   - Apply consistent size and weight scales
   - Maintain readable contrast ratios

5. **Status and Feedback**
   - Use `BaseBadge` for status indicators
   - Show loading states consistently
   - Provide clear feedback for actions

## Implementation Order
1. ✅ Base Components
2. ✅ Composite Components
3. ✅ Layout Components
4. ✅ Portal Templates
5. 🟡 Portal-Specific Implementations
   - ✅ Volunteer Portal
   - ✅ Donor Portal
   - ⬜️ Partner Portal
   - ⬜️ Admin Portal
6. ✅ Shared Features
7. ✅ State Management
8. ✅ Responsive Features
9. ✅ Documentation

## Notes
- Using TailwindCSS for styling with consistent design tokens
- Following established component patterns
- Maintaining accessibility standards
- Keeping performance in mind through proper code-splitting
- Using lazy loading for portal-specific components
- Implementing proper prop interfaces for type safety

## Current Implementation Details

### Navigation State Management
```typescript
interface NavigationState {
  currentPortal: 'donor' | 'volunteer' | 'partner' | 'admin' | null;
  isSidebarOpen: boolean;
  currentPath: string;
  breadcrumbs: Array<{ label: string; path: string; }>;
}
```

### Portal Configuration Pattern
```typescript
interface PortalConfig {
  id: string;
  title: string;
  description: string;
}

// Example:
const donorPortalConfig = {
  id: 'donor',
  title: 'Donor Portal',
  description: 'Manage your food donations and track your impact',
};
```

### Layout Component Structure
- `MainLayout`: Root layout component
  - `Sidebar`: Collapsible navigation sidebar
  - `TopNav`: Top navigation bar
    - `PortalSwitcher`: Portal selection dropdown
    - `NotificationCenter`: Notification management
    - `UserMenu`: User profile and settings

### Component Composition Example
```typescript
<MainLayout>
  <PortalLayout config={portalConfig}>
    <PageComponent />
  </PortalLayout>
</MainLayout>
``` 
