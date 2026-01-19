const http = require('http');
const { URLSearchParams } = require('url');

let liveMatches = []; 
const ADMIN_USER = "four Ali"; 
const ADMIN_PASSWORD = "20062006for"; 

const server = http.createServer((req, res) => {
    // 1. نقطة الوصول للتطبيق (API)
    if (req.url === '/api/channels' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end(JSON.stringify(liveMatches));
    }

    // 2. صفحة تسجيل الدخول والتحكم
    if (req.url === '/admin' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`
            <body style="font-family:sans-serif; text-align:center; direction:rtl; background:#f0f2f5; padding-top:50px;">
                <div style="background:white; display:inline-block; padding:30px; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.2); width:350px;">
                    <h2 style="color:#1a73e8;">تسجيل دخول المالك 🔐</h2>
                    <form method="POST" action="/verify">
                        <input name="user" placeholder="اسم المستخدم" required style="display:block; width:90%; margin:10px auto; padding:12px; border:1px solid #ddd; border-radius:8px;">
                        <input name="pass" type="password" placeholder="كلمة السر" required style="display:block; width:90%; margin:10px auto; padding:12px; border:1px solid #ddd; border-radius:8px;">
                        <hr style="margin:20px 0; border:0; border-top:1px solid #eee;">
                        
                        <h3 style="font-size:16px; color:#555;">إعدادات البث</h3>
                        <input name="name" placeholder="اسم المباراة (مثلاً: برشلونة)" style="display:block; width:90%; margin:10px auto; padding:10px; border:1px solid #ddd; border-radius:8px;">
                        <input name="url" placeholder="رابط البث المباشر" style="display:block; width:90%; margin:10px auto; padding:10px; border:1px solid #ddd; border-radius:8px;">
                        
                        <button type="submit" name="action" value="add" style="background:#28a745; color:white; padding:12px; border:none; cursor:pointer; width:95%; border-radius:8px; font-weight:bold; margin-bottom:10px;">حفظ وتحديث البث ✅</button>
                        <button type="submit" name="action" value="delete" style="background:#dc3545; color:white; padding:12px; border:none; cursor:pointer; width:95%; border-radius:8px; font-weight:bold;">حذف البث الحالي 🗑️</button>
                    </form>
                    <div style="margin-top:20px; padding:10px; background:#fff3cd; border-radius:8px; color:#856404; font-size:13px;">
                        الحالة الآن: <b>${liveMatches.length > 0 ? liveMatches[0].name : 'لا يوجد بث'}</b>
                    </div>
                </div>
            </body>
        `);
    }

    // 3. التحقق من البيانات ومعالجة الطلبات
    if (req.url === '/verify' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const u = params.get('user');
            const p = params.get('pass');
            const action = params.get('action');

            if (u === ADMIN_USER && p === ADMIN_PASSWORD) {
                if (action === 'add' && params.get('name')) {
                    liveMatches = [{ id: Date.now().toString(), name: params.get('name'), url: params.get('url') }];
                } else if (action === 'delete') {
                    liveMatches = [];
                }
                res.writeHead(302, { 'Location': '/admin' }); // إعادة توجيه للوحة التحكم
                res.end();
            } else {
                res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end("<h1 style='text-align:center; color:red;'>اسم المستخدم أو كلمة السر خطأ! ❌</h1><center><a href='/admin'>ارجع وحاول مرة ثانية</a></center>");
            }
        });
    }
});

server.listen(3000);
