# دليل النشر - Frontend

## ✅ إعداد متغيرات البيئة

### 1. إنشاء ملف `.env.local`

في مجلد `frontend/`، أنشئ ملف `.env.local` وأضف:

```env
NEXT_PUBLIC_API_URL=https://flowchat-realtime-chat-application-production.up.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://flowchat-realtime-chat-application-production.up.railway.app
```

### 2. للتطوير المحلي

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📋 ملاحظات مهمة:

1. **NEXT_PUBLIC_API_URL**: يجب أن ينتهي بـ `/api`
2. **NEXT_PUBLIC_SOCKET_URL**: بدون `/api`
3. بعد تعديل `.env.local`، أعد تشغيل `npm run dev`
4. ملف `.env.local` موجود في `.gitignore` ولن يُرفع إلى Git

## 🚀 النشر على Vercel/Netlify:

عند النشر، أضف المتغيرات في لوحة التحكم:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`

## ✅ التحقق:

بعد الإعداد، تحقق من:
- Console في المتصفح - يجب أن ترى اتصال Socket.io
- Network tab - يجب أن تذهب الطلبات إلى Railway URL

