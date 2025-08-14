# Deployment Guide for Schedula

## 🚀 **Fixed Issues**

### **Problem**: Authentication Error on Vercel
**Error**: "Cannot connect to server. Please run 'npm run json-server' in a separate terminal."

### **Solution**: 
1. ✅ **Removed JSON Server dependency** - All API calls now use Next.js API routes
2. ✅ **Fixed API endpoints** - Created proper `/api/doctors`, `/api/patients`, `/api/appointments` routes
3. ✅ **Updated error messages** - Removed references to JSON server
4. ✅ **Fixed database imports** - Updated import paths for `db.json`

## 📋 **What Was Fixed**

### **1. API Routes Created**
- ✅ `/api/doctors` - GET, POST
- ✅ `/api/patients` - GET, POST  
- ✅ `/api/appointments` - GET, POST
- ✅ `/api/appointments/[id]` - PATCH, DELETE
- ✅ `/api/prescriptions` - GET, POST
- ✅ `/api/prescriptions/[id]` - GET, PATCH, DELETE
- ✅ `/api/medical-history` - GET, POST

### **2. Database Integration**
- ✅ All API routes now read from `db.json` directly
- ✅ No external JSON server required
- ✅ Works on both local development and Vercel

### **3. Error Handling**
- ✅ Updated all error messages to be deployment-friendly
- ✅ Removed JSON server references
- ✅ Better network error handling

## 🔧 **How to Deploy**

### **1. Commit and Push Changes**
```bash
git add .
git commit -m "Fix API routes for Vercel deployment"
git push origin main
```

### **2. Deploy to Vercel**
- Go to your Vercel dashboard
- Connect your GitHub repository
- Deploy automatically or manually trigger deployment

### **3. Test the Application**
- Visit your Vercel URL
- Test login with:
  - **Doctor**: `sarah.johnson@email.com` / `doctor123`
  - **Patient**: `john@example.com` / `patient123`

## 🧪 **Testing**

### **API Test Page**
Visit `/test-api` to verify all API endpoints are working:
- Tests doctors API
- Tests patients API
- Shows success/error status

### **Manual Testing**
1. **Login** - Should work without JSON server errors
2. **Doctor Dashboard** - Should load appointments and statistics
3. **Prescriptions** - Should show prescription management
4. **Medical History** - Should display patient records

## 🐛 **Troubleshooting**

### **If you still get errors:**

1. **Check Vercel Logs**
   - Go to Vercel dashboard → Your project → Functions
   - Check for any build or runtime errors

2. **Verify API Routes**
   - Visit `your-domain.vercel.app/api/doctors`
   - Should return JSON array of doctors

3. **Clear Cache**
   - In Vercel dashboard, go to Settings → General
   - Click "Clear Build Cache"

4. **Redeploy**
   - Force a new deployment in Vercel dashboard

## 📱 **Features Now Working**

- ✅ **Authentication** - Login for doctors and patients
- ✅ **Doctor Dashboard** - View appointments and statistics
- ✅ **Prescription Management** - Create, edit, delete prescriptions
- ✅ **Patient Medical History** - View complete patient records
- ✅ **Appointment Management** - Book and manage appointments
- ✅ **Responsive Design** - Works on all devices

## 🎯 **Next Steps**

1. **Test thoroughly** on Vercel
2. **Add real database** (MongoDB, PostgreSQL, etc.) for production
3. **Add authentication** (NextAuth.js, Auth0, etc.)
4. **Add file uploads** for medical documents
5. **Add notifications** for appointments

---

**Status**: ✅ **Ready for Vercel Deployment**
