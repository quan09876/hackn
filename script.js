document.addEventListener('DOMContentLoaded', function() {
    const cookieInput = document.getElementById('cookie-input');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const copyInstructionsBtn = document.getElementById('copy-instructions');
    const ufcOutput = document.getElementById('ufc-output');
    const resultDiv = document.getElementById('result');

    // Sao chép hướng dẫn
    copyInstructionsBtn.addEventListener('click', function() {
        const instructions = `1. Đăng nhập vào Facebook trên trình duyệt
2. Mở DevTools (F12)
3. Vào Application → Cookies → https://www.facebook.com
4. Sao chép toàn bộ cookie dưới dạng JSON`;
        
        navigator.clipboard.writeText(instructions)
            .then(() => {
                alert('Đã sao chép hướng dẫn vào clipboard!');
            })
            .catch(err => {
                console.error('Lỗi khi sao chép: ', err);
            });
    });

    // Tạo UFC file
    generateBtn.addEventListener('click', function() {
        try {
            const cookies = JSON.parse(cookieInput.value);
            
            if (!Array.isArray(cookies)) {
                throw new Error('Dữ liệu cookie phải là mảng JSON');
            }
            
            const formattedCookies = cookies.map(cookie => ({
                key: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                hostOnly: !cookie.hostOnly,
                creation: new Date().toISOString(),
                lastAccessed: new Date().toISOString()
            }));
            
            const ufcData = {
                cookies: formattedCookies,
                metadata: {
                    exportedAt: new Date().toISOString(),
                    platform: "facebook"
                }
            };
            
            const ufcBase64 = btoa(JSON.stringify(ufcData));
            ufcOutput.value = ufcBase64;
            resultDiv.classList.remove('hidden');
            
        } catch (error) {
            alert('Lỗi: ' + error.message);
            console.error(error);
        }
    });

    // Sao chép UFC
    copyBtn.addEventListener('click', function() {
        ufcOutput.select();
        document.execCommand('copy');
        alert('Đã sao chép UFC vào clipboard!');
    });

    // Tải xuống UFC
    downloadBtn.addEventListener('click', function() {
        const blob = new Blob([ufcOutput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facebook_ufc_' + new Date().toISOString().split('T')[0] + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
