# A-Thip House @ Pai - Landing Page

โปรเจคเว็บไซต์จองห้องพักสำหรับรีสอร์ทขนาดเล็ก "A-Thip House @ Pai" ใน เมืองปาย จังหวัดแม่ฮ่องสอน

## 🎨 ฟีเจอร์หลัก

- ✨ **Hero Section** - พื้นหลังสวยงาม พร้อม CTA ปุ่มจองห้อง
- 🛏️ **Room Section** - แสดงประเภทห้องพักพร้อมสิ่งอำนวยความสะดวก
- 📸 **Gallery** - แสดงภาพห้องและสัถานที่ พร้อม lightbox
- 🌟 **Reviews** - รีวิวจากผู้เข้าพักจริง
- 📍 **Location** - แผนที่ Google Maps และข้อมูลการเดินทาง
- 💬 **CTA Section** - ปุ่มจองผ่าน LINE, WhatsApp, โทรศัพท์
- 📱 **Sticky Booking Bar** - ปุ่ม sticky บนมือถือ สำหรับการจองด่วน
- 🎯 **SEO Optimized** - Meta tags, structured data พร้อมใช้งาน

## 🛠 Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Responsive Design** - Mobile-first approach

## 🚀 การติดตั้งและรัน

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# Build production
npm run build
npm start
```

เปิด [http://localhost:3000](http://localhost:3000) เพื่อดูผล

## 📁 โครงสร้างโปรเจค

```
app/
├── components/
│   ├── Hero.tsx           # Hero section
│   ├── RoomCard.tsx       # Card สำหรับแสดงห้อง
│   ├── Gallery.tsx        # Gallery section
│   ├── Lightbox.tsx       # Lightbox สำหรับแสดงภาพใหญ่
│   ├── ReviewCard.tsx     # Card สำหรับแสดงรีวิว
│   ├── StickyBookingBar.tsx # Sticky bar บนมือถือ
│   └── Footer.tsx         # Footer
├── globals.css            # Global styles
├── layout.tsx             # Root layout
└── page.tsx              # Main page
```

## 🎨 สีและ Style

- **Primary**: #2D5016 (สีเขียวป่า)
- **Secondary**: #8B7355 (สีน้ำตาล)
- **Accent**: #E8DCC4 (สีเบจ)
- **Light**: #F5F3F0 (สีขาวอ่อน)

## 📞 ข้อมูลติดต่อ

- **โทร**: +66 946765524
- **WhatsApp**: [ลิงก์ WhatsApp](https://wa.me/66946765524)
- **LINE**: ติดต่อผ่านแอปพลิเคชัน

## 🔧 Customization

### เปลี่ยนหมายเลขโทรศัพท์
ค้นหา `+66946765524` ในไฟล์และแทนที่ด้วยหมายเลขของคุณ

### เปลี่ยนราคาห้อง
แก้ไขใน `app/page.tsx` ที่ส่วน RoomCard

### เปลี่ยนรูปภาพ
แทนที่ลิงก์รูปภาพ Unsplash ด้วยรูปภาพของคุณเอง

### เพิ่ม/ลบรีวิว
แก้ไข array `reviews` ใน `app/page.tsx`

## 🚢 Deployment

สามารถ deploy ไป Vercel, Netlify, หรือ platform อื่นๆ ที่รองรับ Next.js

```bash
# Vercel
npm install -g vercel
vercel

# Netlify
npm run build
```

## 📄 License

ใช้ได้ตามต้องการสำหรับ A-Thip House @ Pai

---

สร้างด้วยความห่วงใจ เพื่อผู้ที่ต้องการพักผ่อนอย่างสงบสุข 🌿
