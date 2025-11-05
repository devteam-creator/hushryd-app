# Side Menu Logo Update

## Summary
Updated the user side menu to display the HushRyd logo in the header instead of a car emoji, matching the design requirements.

## Changes Made

### 1. Updated `components/SideMenu.tsx`
- **Added import** for `HushRydLogoImage` component
- **Replaced emoji header** (🚗) with the HushRyd logo image
- **Added logo container** styling for proper centering
- **Kept existing menu structure** with all options:
  - **MAIN**: Dashboard, My Profile, My Bookings, My Complaints
  - **SUPPORT & REWARDS**: Help & Support, Refer & Earn
  - **Settings**: Settings, Logout

### 2. Logo Display
- Logo is shown with white tint on the green gradient background
- Proper sizing for the header area
- Matches the design in the provided screenshot

### 3. Menu Options Preserved
All original menu items remain functional:
- Dashboard
- My Profile
- My Bookings
- My Complaints
- Help & Support
- Refer & Earn
- Settings
- Logout (with confirmation dialog)

## Visual Changes
- ✅ Green gradient header background (#32CD32 to #1E7A1E)
- ✅ HushRyd logo displayed prominently
- ✅ "Navigation Menu" subtitle
- ✅ Close button (✕) in top right corner
- ✅ Version number in footer (HushRyd v1.0.0)

## Technical Details
- Logo component uses `darkBackground={true}` prop for white tint on dark backgrounds
- Logo size is set to "small" for the header
- All existing menu functionality preserved
- Logout still includes backend API call and session cleanup
