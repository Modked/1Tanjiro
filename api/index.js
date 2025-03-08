const { createCanvas, loadImage, registerFont } = require('@napi-rs/canvas');
const express = require('express');
const app = express();

// تحميل خط عربي مخصص
registerFont('./fonts/Cairo-ExtraLight.ttf', { family: 'Cairo' });

app.get('/api/profile', async (req, res) => {
    const { name = 'User', level = 1, exp = 0, maxExp = 100, bg = '', avatar = '', textColor = '#fff', barColor = '#0f0' } = req.query;
    const width = 800, height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // تحميل الصورة الخلفية
    if (bg) {
        try {
            const bgImage = await loadImage(bg);
            ctx.drawImage(bgImage, 0, 0, width, height);
        } catch (error) {
            console.log('Failed to load background image:', error);
            ctx.fillStyle = '#222';
            ctx.fillRect(0, 0, width, height);
        }
    } else {
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, width, height);
    }

    // تحميل الصورة الرمزية
    if (avatar) {
        try {
            const avatarImg = await loadImage(avatar);
            ctx.beginPath();
            ctx.arc(100, 100, 50, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatarImg, 50, 50, 100, 100);
            ctx.restore();
        } catch (error) {
            console.log('Failed to load avatar:', error);
        }
    }

    // إضافة النصوص
    ctx.fillStyle = textColor;
    ctx.font = 'bold 30px Cairo';
    ctx.fillText(`الاسم: ${name}`, 180, 70);
    ctx.fillText(`المستوى: ${level}`, 180, 120);
    ctx.fillText(`الخبرة: ${exp} / ${maxExp}`, 180, 170);

    // شريط التقدم
    const progressBarWidth = 600;
    const progress = Math.min(exp / maxExp, 1);
    ctx.fillStyle = '#555';
    ctx.fillRect(50, 220, progressBarWidth, 30);
    
    // تأثير التدرج اللوني لشريط التقدم
    const gradient = ctx.createLinearGradient(50, 220, 50 + progressBarWidth, 250);
    gradient.addColorStop(0, barColor);
    gradient.addColorStop(1, '#00ff88');
    ctx.fillStyle = gradient;
    ctx.fillRect(50, 220, progressBarWidth * progress, 30);

    // إخراج الصورة بصيغة مضغوطة
    res.setHeader('Content-Type', 'image/jpeg');
    canvas.createJPEGStream({ quality: 0.8 }).pipe(res);
});

module.exports = app;
