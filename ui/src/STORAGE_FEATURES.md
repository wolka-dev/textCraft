# Browser Storage Features

## 🎯 Overview

The Phrasing Craft application now automatically saves your preferences in the browser's localStorage, so your settings persist across sessions.

## 💾 What Gets Saved

The following user preferences are automatically saved:

1. **Writing Style** - Your selected style (Formal, Friendly, Casual, etc.)
2. **Platform** - Your target platform (Email, Slack, Document, Social Media)
3. **Output Language** - Your preferred language (English, Spanish, French, etc.)
4. **Custom Language** - Any custom language you specify
5. **Extra Instructions** - Your additional prompts and instructions

## 🔄 How It Works

### Automatic Saving

- Preferences are saved **immediately** when you change them
- No need to click "Save" - it happens automatically
- Works across browser tabs and sessions

### Visual Indicators

- ✅ **Green checkmark** shows "Preferences are automatically saved"
- **Reset Preferences** button to clear all saved settings
- **Clear** button resets both text and preferences

## 🧪 Testing the Feature

### Test 1: Basic Persistence

1. Open http://localhost:3000
2. Change the writing style to "Formal"
3. Set platform to "Slack"
4. Add some extra instructions
5. Refresh the page
6. ✅ Your settings should be restored

### Test 2: Cross-Session Persistence

1. Set your preferences
2. Close the browser completely
3. Reopen the browser and go to the app
4. ✅ Your preferences should still be there

### Test 3: Reset Functionality

1. Set some preferences
2. Click "Reset Preferences" button
3. ✅ All settings should return to defaults

## 🛠️ Technical Details

### Storage Keys

- `phrasing-craft-style` - Writing style selection
- `phrasing-craft-platform` - Platform selection
- `phrasing-craft-language` - Language selection
- `phrasing-craft-custom-language` - Custom language input
- `phrasing-craft-extra-prompt` - Extra instructions

### Browser Compatibility

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile browsers
- ✅ Private/Incognito mode (limited to session)

### Data Format

All preferences are stored as JSON strings in localStorage.

## 🔧 Customization

### Adding New Preferences

To add new persistent preferences:

1. Add to the `useUserPreferences` hook in `use-local-storage.ts`
2. Update the component to use the new preference
3. Add to the `clearPreferences` function

### Example:

```typescript
const [newPreference, setNewPreference] = useLocalStorage(
  "phrasing-craft-new-pref",
  "default"
);
```

## 🚨 Important Notes

- **Privacy**: Data is stored locally in your browser only
- **Storage Limit**: localStorage has ~5-10MB limit (plenty for preferences)
- **Clearing**: Use "Reset Preferences" or clear browser data to remove
- **Backup**: Preferences are not synced across devices

## 🎉 Benefits

1. **Convenience**: No need to reconfigure settings every time
2. **Efficiency**: Faster workflow with saved preferences
3. **Consistency**: Same settings across sessions
4. **User Experience**: Seamless, automatic saving

---

**Ready to test?** Open http://localhost:3000 and start customizing your preferences!
