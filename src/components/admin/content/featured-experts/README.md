# Featured Experts Management

This module provides comprehensive management for featured experts in the admin dashboard.

## Features

### 🌟 Main Features

- **View Featured Experts**: Display all experts in the system with their featured status
- **Toggle Featured Status**: Easily feature or unfeature experts with a single click
- **Expert Information**: Complete profile information including:
  - Profile image and basic details
  - Contact information (email, phone)
  - Expertise areas and advisory topics
  - Social links (LinkedIn, website)
  - Approval and verification status
- **Remove Experts**: Remove experts from the system with confirmation
- **Real-time Updates**: Instant UI updates after status changes

### 📊 Dashboard Stats

- Total featured experts count
- Total experts in system
- Active (approved) experts count

### 🎨 UI Components

- **Expert Cards**: Rich, informative cards showing complete expert information
- **Status Badges**: Visual indicators for featured, approved, and verified status
- **Action Buttons**: Intuitive controls for featuring/unfeaturing and removing experts
- **Confirmation Modals**: Safe deletion with detailed confirmation dialogs

## API Integration

### Endpoints Used

- `GET /experts/featured` - Fetch all featured experts
- `PUT /experts/featured/{id}` - Update featured status
- `DELETE /experts/featured/{id}` - Remove expert

### Data Structure

The component works with `FeaturedExpert` interface that includes:

```typescript
interface FeaturedExpert {
  _id: string;
  username: string;
  email: string;
  expertiseAreas: Array<{
    category: string;
    categoryName: string;
    subCategory: string;
    subCategoryName: string;
    _id: string;
  }>;
  advisoryTopics: string[];
  rate: string;
  image: string;
  bio: string;
  phone: string;
  linkedinUrl: string;
  websiteUrl: string;
  isFeatured: boolean;
  isApproved: boolean;
  emailVerified: boolean;
  // ... other fields
}
```

## File Structure

```
src/components/admin/content/
├── TabFeaturedExperts.tsx          # Main component
├── featured-experts/
│   └── index.ts                    # Export file
└── utils/
    ├── expertUtils.ts              # Utility functions
    └── index.ts                    # Utils export file
```

## Usage

The Featured Experts tab is integrated into the main Content Management interface:

1. Navigate to Admin Dashboard
2. Go to Content Management section
3. Click on "Featured Experts" tab
4. View and manage featured experts

## Key Functions

### Toggle Featured Status

```typescript
const handleToggleFeatured = async (
  expertId: string,
  currentStatus: boolean,
) => {
  await adminService.updateFeaturedExpertStatus(expertId, !currentStatus);
  // Update local state
};
```

### Remove Expert

```typescript
const handleRemoveExpert = async (expertId: string) => {
  await adminService.removeFeaturedExpert(expertId);
  // Remove from local state
};
```

## Styling

The component uses:

- **Tailwind CSS** for styling
- **Responsive design** with grid layouts
- **Status-based color coding**:
  - Yellow for featured status
  - Green for approved status
  - Blue for verified status
- **Hover effects** and transitions
- **Loading states** for better UX

## Error Handling

- Comprehensive error catching with user-friendly messages
- Toast notifications for success/error feedback
- Loading states during API operations
- Confirmation dialogs for destructive actions

## Future Enhancements

Potential improvements could include:

- Bulk operations (feature/unfeature multiple experts)
- Expert search and filtering
- Detailed expert profile view/edit
- Expert performance analytics
- Featured experts ordering/priority
