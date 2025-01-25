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
Use base components to build navigation elements:
```tsx
// Example NavItem implementation
const NavItem = ({ to, label, icon, badge }) => (
  <BaseLink
    to={to}
    variant="muted"
    className="flex items-center py-2 px-3"
  >
    {icon}
    <BaseText size="sm">{label}</BaseText>
    {badge && (
      <BaseBadge variant="primary" size="sm">
        {badge}
      </BaseBadge>
    )}
  </BaseLink>
);

// Example MenuGroup implementation
const MenuGroup = ({ title, children }) => (
  <BaseCard variant="ghost" padding="sm">
    <BaseText weight="semibold" size="sm" className="mb-2">
      {title}
    </BaseText>
    {children}
  </BaseCard>
);
```

## 3. Layout Components (Organisms)
- [x] Create `MainLayout` component
  - [x] Flexible slot system for content
  - [x] Configurable navigation areas
  - [x] Responsive container queries
- [x] Build `TopNav` component
  - [x] Composable sections (left, center, right)
  - [x] Responsive collapse strategies
- [x] Implement `Sidebar` component
  - [x] Configurable width and behavior
  - [x] Collapsible with multiple modes
  - [x] Nested navigation support

## 4. Portal-Specific Components
- [x] Create base portal template
  - [x] Extensible layout structure
  - [x] Common functionality wrapper
  - [x] Shared state management

### Portal Implementation Pattern
```tsx
const PortalLayout = ({ children }) => (
  <MainLayout
    sidebar={
      <Sidebar>
        <MenuGroup title="Navigation">
          <NavItem
            to="/dashboard"
            label="Dashboard"
            icon={<DashboardIcon />}
          />
          {/* More navigation items */}
        </MenuGroup>
      </Sidebar>
    }
    header={
      <TopNav>
        <PortalSwitcher />
        <SearchBar />
        <UserMenu />
      </TopNav>
    }
  >
    {children}
  </MainLayout>
);
```

## 5. Shared Features
- [x] Create `PortalSwitcher` using base components
- [x] Build `UserMenu` using menu group components
- [x] Implement `NotificationCenter` using base components

## 6. State Management
- [x] Implement navigation context (using Redux)
- [x] Create portal state management
- [x] Add user preferences system

## 7. Responsive Implementation
- [x] Create responsive utility components
- [x] Implement mobile-first breakpoint system
- [x] Add touch-friendly interaction patterns

## 8. UI/UX Patterns
- [x] Create consistent loading states
- [x] Implement smooth transitions
- [x] Add hover/focus interactions
- [x] Implement keyboard navigation

## Component Reuse Guidelines
1. **Use Base Components First**
   - Start with base components for all UI elements
   - Compose more complex components from base ones
   - Maintain consistent styling and behavior

2. **Navigation Patterns**
   - Use `BaseLink` for all navigation
   - Wrap in `NavItem` for consistent styling
   - Group related items in `MenuGroup`

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
5. 🟡 Portal-Specific Implementations (Donor complete, others pending)
6. ✅ Shared Features
7. ✅ State Management
8. ✅ Responsive Features
9. ✅ Documentation

## Component Reuse Guidelines
- Create components at the lowest possible level of abstraction
- Use composition to build more complex components
- Implement proper prop interfaces for maximum flexibility
- Use render props and children for complex compositions
- Create HOCs only when necessary
- Use hooks for shared behavior
- Document all possible use cases and variations

## Notes
- Use TailwindCSS for styling with consistent design tokens
- Follow existing component patterns
- Maintain accessibility standards
- Keep performance in mind through proper code-splitting
- Use lazy loading for portal-specific components
- Implement proper prop interfaces for type safety 

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
