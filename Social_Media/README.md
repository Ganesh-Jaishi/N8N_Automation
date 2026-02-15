# Omni-Channel Content Syndicator (Discord → LinkedIn & Instagram)

An event-driven, AI-powered automation built with **n8n** that allows creators to
**write once** and automatically publish **platform-optimized posts** to LinkedIn
and Instagram after approval in Discord.

---

## 1. What this project does (in one line)

Upload a post + image in Discord → approve with ✅ → AI rewrites content → image is processed → posts go live on LinkedIn & Instagram automatically.

---

## 2. Tech Stack

- **Automation**: n8n
- **Trigger**: Discord Webhook
- **AI**: OpenAI GPT-4 (Structured Output)
- **Image Handling**: n8n Binary + Resize node
- **APIs**:
  - LinkedIn API (OAuth2)
  - Facebook Graph API (Instagram Business)

---

## 3. Prerequisites

Before running this project, ensure you have the following:

1. **n8n**: Installed locally or hosted on a server.
2. **Docker**: For running n8n locally.
3. **API Keys**:
   - OpenAI API Key
   - Discord Webhook URL
   - LinkedIn API credentials (Client ID, Client Secret)
   - Facebook Graph API credentials (Access Token, Page ID, Instagram Business ID)
4. **Image Resizing Requirements**:
   - Ensure the n8n instance has access to the internet for downloading and resizing images.

---

## 4. Repository Structure

```
Omni_Channel/
│
├── src/
│   └── index.js
├── workflow/
│   └── workflow.json
├── .env.example
└── README.md
```

---

## 5. Workflow Logic (Actual Implementation)

### Trigger
Discord webhook receives:
- Text
- Image URL
- Approval emoji (✅)

Webhook output example:
```json
{
  "content": "I got rugged 💀",
  "imageUrl": "https://cdn.discordapp.com/attachments/..."
}
```

---

### Workflow Configuration (n8n Expression)

- **hasImage**: `{{ !!$json.imageUrl }}`
- **imageUrl**: `{{ $json.imageUrl }}`
- **text**: `{{ $json.content }}`

---

### AI Transformation (GPT-4)

**Prompt Used (Transformation Agent):**

You are a content transformation agent.

**Input text:**
```
{{$json.text}}
```

**Output STRICT JSON:**
```json
{
  "linkedin_post": "Professional, satirical corporate-style post with hashtags",
  "instagram_caption": "Casual caption",
  "instagram_hashtags": ["#hashtag1", "#hashtag2", "..."]
}
```

**Parsed Output Example:**
```json
{
  "linkedin_post": "3 lessons on risk management I learned today as a founder. #Leadership #Startups",
  "instagram_caption": "Crypto lessons hit different 💀",
  "instagram_hashtags": [
    "#crypto",
    "#web3",
    "#startup",
    "#founderlife"
  ]
}
```

---

### Image Download (Binary Handling)

**HTTP Request Node (LinkedIn & Instagram – separate paths):**
- **Method**: GET
- **URL**: `{{ $json.imageUrl }}`
- **Response Format**: File
- **Binary Property Name**: `data`

Binary is now available as:
```javascript
$binary.data
```

---

### Instagram Image Resize (4:5)

- **Width**: 1080
- **Height**: 1350
- **Fit**: contain
- **Background Color**: `#000000`
- **Binary Property**: `data`

---

### Posting to LinkedIn

- **Uses binary image**
- **Uses AI-generated linkedin_post**

**Text**: `{{ $json.linkedin_post }}`

**Image**: `{{ $binary.data }}`

**Visibility**: PUBLIC

---

### Posting to Instagram (Facebook Graph API)

**Create Media Container**

`POST https://graph.facebook.com/v18.0/{{INSTAGRAM_BUSINESS_ID}}/media`

**Body:**
```json
{
  "image_url": "{{image_url}}",
  "caption": "{{caption}} {{hashtags}}",
  "access_token": "{{FB_ACCESS_TOKEN}}"
}
```

**Publish Container**

`POST https://graph.facebook.com/v18.0/{{INSTAGRAM_BUSINESS_ID}}/media_publish`

---

### Discord Response Node

```javascript
JSON.stringify({
  success: true,
  message: "Posted successfully to LinkedIn and Instagram 🚀"
})
```

---

## 6. Environment Variables

`.env.example`
```
OPENAI_API_KEY=
DISCORD_WEBHOOK_URL=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

FACEBOOK_ACCESS_TOKEN=
FACEBOOK_PAGE_ID=
INSTAGRAM_BUSINESS_ID=
```

---

## 7. Running Locally (Self-hosted n8n)

```bash
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Import workflow:**

`n8n UI → Import → omni-channel-syndicator.json`

---

## 8. Cost Estimate

- **GPT-4**:
  - ~1 execution ≈ $0.01–0.03
  - 100 executions ≈ $1–3

- **n8n**:
  - Depends on cloud/self-hosted plan

---

## 9. Common Issues & Fixes

### LinkedIn Forbidden Error
- **Cause**: Missing `w_member_social` scope
- **Fix**: Reconnect OAuth & ensure posting permissions

### Image Not Found Error
- **Cause**: Binary not passed
- **Fix**: Ensure HTTP Request → Binary property = `data`

---

## 10. Future Enhancements

- Add Twitter/X pipeline
- Store approved posts in a database for analytics
- Implement retry and failure handling for robust error management
- Add analytics and engagement tracking for posts
- Support for additional platforms (e.g., TikTok, Pinterest)

---

## 11. Credits

- **n8n**: For the automation platform
- **OpenAI GPT-4**: For AI-powered content transformation
- **LinkedIn API**: For professional networking posts
- **Facebook Graph API**: For Instagram Business integration

---

## 12. Why this matters

This project demonstrates:

- Real-world API integration
- AI prompt engineering
- Binary image handling
- Parallel automation pipelines
- Production debugging experience

---

### 🔥 This README is **interview-grade**

If they open this, they’ll instantly know:
> “Okay, this person actually built it.”

If you want next:
- ✅ `.env.example` cleaned
- 🔍 JSON security scrub
- 🎤 30-min meeting **exact answers**
- 🧪 “If interviewer breaks it live” recovery script

