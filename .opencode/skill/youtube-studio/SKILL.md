# YouTube Studio Skill

Manage YouTube channels and upload videos via Chrome MCP automation.

## Prerequisites

- Chrome MCP connected and working
- Logged into YouTube/Google account in Chrome
- If Chrome MCP has lock issues: `rm -rf ~/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock`

## 0 Finance YouTube Channel

- **Channel Name:** 0 Finance
- **Handle:** @0financeapp
- **Channel URL:** https://www.youtube.com/@0financeapp
- **Channel ID:** UCT-2eZ-cc7gkUU4bmFPcwFA
- **YouTube Studio:** https://studio.youtube.com/channel/UCT-2eZ-cc7gkUU4bmFPcwFA
- **Account:** ben@0.finance

## Key URLs

| Purpose                  | URL                                                              |
| ------------------------ | ---------------------------------------------------------------- |
| YouTube Studio Dashboard | `https://studio.youtube.com/channel/{CHANNEL_ID}`                |
| Content/Videos List      | `https://studio.youtube.com/channel/{CHANNEL_ID}/videos`         |
| Upload Video             | `https://studio.youtube.com/channel/{CHANNEL_ID}/videos/upload`  |
| Edit Video               | `https://studio.youtube.com/video/{VIDEO_ID}/edit`               |
| Channel Customization    | `https://studio.youtube.com/channel/{CHANNEL_ID}/editing/images` |
| Channel Switcher         | `https://www.youtube.com/channel_switcher`                       |

## Uploading Videos

### Step 1: Navigate to Upload

```
Navigate to: https://studio.youtube.com/channel/{CHANNEL_ID}/videos/upload
Click "Create" button or "Upload videos" button
```

### Step 2: Upload Video File

- Use `chrome_upload_file` on the file input/drop zone
- Wait for upload to complete (check for progress indicators)

### Step 3: Fill Video Details

1. **Title** - Use the title textbox (required)
2. **Description** - Add description with hashtags at the end
3. **Thumbnail** - See thumbnail section below
4. **Audience** - Select "No, it's not made for kids" radio button
5. **Visibility** - Set to Public/Unlisted/Private

### Step 4: Save

- **IMPORTANT:** Click "Save" or "Publish" button immediately after making changes
- Don't navigate away or click other options - just Save!

## Thumbnail Requirements & Upload

### Requirements

- **Max file size:** 2MB (CRITICAL - will reject larger files)
- **Recommended dimensions:** 1280 x 720 pixels (16:9 ratio)
- **Formats:** JPG, PNG, or GIF

### Compressing Thumbnails

If thumbnail is over 2MB, compress it:

```bash
# Check file size
ls -lh /path/to/Thumbnail.png

# Compress to JPEG (try 100% quality first, then lower if needed)
sips -s format jpeg -s formatOptions 100 "/path/to/Thumbnail.png" --out "/path/to/Thumbnail-max.jpg"

# Check new size - must be under 2MB
ls -lh /path/to/Thumbnail-max.jpg

# If still over 2MB, try 95% quality
sips -s format jpeg -s formatOptions 95 "/path/to/Thumbnail.png" --out "/path/to/Thumbnail-hq.jpg"
```

**Quality guidelines:**

- 100% quality: ~1.6MB for typical 1280x720 image (best quality, use this)
- 95% quality: ~550KB (good quality)
- 85% quality: ~470KB (noticeable quality loss - avoid)

### Uploading Thumbnail

1. Find "Upload file" button in Thumbnail section
2. Use `chrome_upload_file` with the button's uid
3. If error "File is bigger than 2MB" - compress and retry
4. **Click Save immediately after upload succeeds**

### Changing Existing Thumbnail

1. Click the current thumbnail button (shows filename like "Thumbnail-compressed.jpg")
2. Click "Options" button next to it
3. Select "Change" from the menu
4. Upload new file
5. **Click Save immediately**

## Common Patterns

### Taking Snapshots

Always use `chrome_take_snapshot` to see current page state before interacting.

### File Upload Pattern

```
1. chrome_take_snapshot - find the upload button uid
2. chrome_upload_file with uid and filePath
3. chrome_take_snapshot - verify upload succeeded
4. Find and click Save button immediately
```

### After Any Change

**ALWAYS click Save immediately.** Don't explore other options or menus.

## Anti-Patterns (Don't Do These)

1. **Don't compress thumbnails too aggressively** - 85% JPEG quality looks bad
2. **Don't click around after uploading** - Just click Save
3. **Don't try to upload files over 2MB** - Compress first
4. **Don't navigate away before saving** - Changes will be lost
5. **Don't click Options menu unless changing something** - It's confusing

## Video Description Template

```
[One-line hook about the video]

0 Finance is a bank account that automates your finances:
- Get paid easily with personal IBANs
- Spend anywhere with 0% conversion fees
- AI automatically optimizes your yield

Learn more at https://0.finance

#AI #Finance #Claude #Automation #Banking #Fintech
```

## Troubleshooting

### Chrome MCP Lock Error

```bash
rm -rf ~/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock
```

### Upload Button Not Working

- Try clicking the button first, then use `chrome_upload_file`
- Some buttons need to be "activated" before file upload works

### Thumbnail Upload Fails

1. Check file size: `ls -lh /path/to/file`
2. If over 2MB, compress with sips
3. Try clicking the upload area first, then upload

### Changes Not Saving

- Look for enabled "Save" button (not disabled/grayed out)
- Make sure you're clicking the right Save button (there may be multiple)
