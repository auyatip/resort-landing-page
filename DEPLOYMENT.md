# Deployment Guide - A-Thip House @ Pai

## Option 1: Vercel (Recommended - Free & Easy)

Vercel is the creator of Next.js and offers the easiest deployment.

### Steps:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! Your site will be live in seconds.

### Deployment URL Example:
- `https://athip-house.vercel.app`

---

## Option 2: Netlify

### Steps:
1. Build your project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect GitHub and select your repo
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Click "Deploy"

---

## Option 3: Traditional Server (VPS/Hosting)

### Prerequisites:
- Node.js 18+ installed
- npm or yarn

### Steps:
```bash
# 1. Clone/upload your project
cd /your/project/path

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Start the production server
npm start
```

### Using PM2 (Recommended for background running):
```bash
npm install -g pm2
pm2 start "npm start" --name athip-house
pm2 startup
pm2 save
```

---

## Post-Deployment Checklist

- [ ] Update contact phone number (if not already done)
- [ ] Replace LINE ID link with your actual LINE
- [ ] Verify WhatsApp link works
- [ ] Test responsive design on mobile
- [ ] Test all CTA buttons work
- [ ] Check images load properly
- [ ] Verify Google Map displays correctly
- [ ] Test lightbox gallery functionality
- [ ] Check sticky booking bar appears on mobile
- [ ] Verify SEO meta tags in browser inspector

---

## Environment Variables (Optional)

Create a `.env.local` file if you need environment-specific settings:

```
NEXT_PUBLIC_PHONE=+66946765524
NEXT_PUBLIC_WHATSAPP_ID=66946765524
NEXT_PUBLIC_LINE_ID=your_line_id
```

---

## Monitoring & Analytics

### Add Google Analytics:
Edit `app/layout.tsx` and add:

```tsx
<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=GA_ID`} />
<Script strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'GA_ID');`}
</Script>
```

### Add Meta Tags:
All meta tags are already configured in `app/layout.tsx`

---

## Performance Tips

1. **Image Optimization**: 
   - Already optimized via Next.js Image component
   - Using Unsplash for high-quality images

2. **Caching**:
   - Static pages are pre-rendered at build time
   - Vercel automatically handles CDN caching

3. **SEO**:
   - Meta tags ✓
   - Structured data ✓
   - Mobile-friendly ✓
   - Fast load time ✓

---

## Troubleshooting

### Port in use
```bash
lsof -i :3000  # Check what's using port 3000
kill -9 <PID>  # Kill the process
```

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Images not loading
- Check image URLs are accessible
- Verify CORS settings if using external images
- Use Next.js Image component for optimization

---

## Support

For issues or questions:
- 📱 +66 946765524
- 💬 WhatsApp or LINE
- 📧 Email (if available)

---

**Last Updated**: March 2025
