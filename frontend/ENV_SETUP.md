# إعداد متغيرات البيئة (Environment Variables) - Frontend

## خطوات الإعداد

### 1. إنشاء ملف `.env.local`

قم بإنشاء ملف `.env.local` في مجلد `frontend/` وأضف المحتوى التالي:

```env
# Backend API URL (with /api)
NEXT_PUBLIC_API_URL=https://flowchat-realtime-chat-application-production.up.railway.app/api

# Socket.io URL (without /api)
NEXT_PUBLIC_SOCKET_URL=https://flowchat-realtime-chat-application-production.up.railway.app
```

### 2. للتطوير المحلي

إذا كنت تريد التطوير محلياً، استخدم:

```env
# Backend API URL (with /api)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Socket.io URL (without /api)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## ملاحظات مهمة:

1. **NEXT_PUBLIC_API_URL**: يجب أن ينتهي بـ `/api` لأن جميع API endpoints تبدأ بـ `/api`
2. **NEXT_PUBLIC_SOCKET_URL**: يجب أن يكون بدون `/api` لأن Socket.io يعمل على نفس الـ server
3. **NEXT_PUBLIC_**: البادئة `NEXT_PUBLIC_` ضرورية في Next.js لجعل المتغيرات متاحة في المتصفح
4. بعد إضافة/تعديل ملف `.env.local`، يجب إعادة تشغيل خادم التطوير (`npm run dev`)

## التحقق من الإعدادات:

بعد إعداد المتغيرات، تأكد من:
- إعادة تشغيل خادم التطوير
- فتح Developer Tools في المتصفح والتحقق من أن الطلبات تذهب إلى الرابط الصحيح
- التحقق من اتصال Socket.io في Console

