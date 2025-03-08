const express = require('express');
const canvas = require('canvas');
const app = express();

app.get('/api/profile', async (req, res) => {
    try {
        console.log("🔄 طلب جديد إلى API");
        console.log("📌 بيانات المستخدم:", req.query);

        const { name = "User", level = 1, exp = 0, maxExp = 100, bg, avatar } = req.query;
        
        // تحميل الصورة الرمزية والخلفية
        const bgImage = await canvas.loadImage(bg || 'https://files.catbox.moe/uh9znr.png/600x300');
        const avatarImage = await canvas.loadImage(avatar || 'https://files.catbox.moe/sfzqit.png/100');

        // إنشاء الصورة
        const width = 600, height = 300;
        const cnv = canvas.createCanvas(width, height);
        const ctx = cnv.getContext('2d');

        // رسم الخلفية
        ctx.drawImage(bgImage, 0, 0, width, height);

        // رسم الصورة الرمزية
        const avatarSize = 100;
        ctx.drawImage(avatarImage, 20, 20, avatarSize, avatarSize);

        // رسم النصوص
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(`الاسم: ${decodeURIComponent(name)}`, 140, 50);
        ctx.fillText(`المستوى: ${level}`, 140, 80);

        // رسم شريط التقدم
        const progressBarWidth = 400;
        const progress = Math.min(exp / maxExp, 1);
        ctx.fillStyle = "#444";
        ctx.fillRect(140, 100, progressBarWidth, 20);
        ctx.fillStyle = "#0f0";
        ctx.fillRect(140, 100, progress * progressBarWidth, 20);

        // إرسال الصورة
        res.setHeader('Content-Type', 'image/png');
        res.send(cnv.toBuffer());

    } catch (error) {
        console.error("❌ خطأ في API:", error);
        res.status(500).send("حدث خطأ في API");
    }
});

module.exports = app;
