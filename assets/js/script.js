// assets/js/script.js

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');

    // Buat area trigger yang lebih besar di bagian atas halaman (misal 100px tinggi)
    // Ini adalah div kosong yang akan kita tempatkan di paling atas body
    const navbarTriggerArea = document.createElement('div');
    navbarTriggerArea.style.position = 'fixed';
    navbarTriggerArea.style.top = '0';
    navbarTriggerArea.style.left = '0';
    navbarTriggerArea.style.width = '100%';
    navbarTriggerArea.style.height = '100px'; // Tinggi area trigger
    navbarTriggerArea.style.zIndex = '1060'; // Lebih tinggi dari navbar agar bisa mendeteksi hover duluan
    // navbarTriggerArea.style.background = 'rgba(255,0,0,0.1)'; // Untuk debugging, bisa dihapus nanti
    document.body.prepend(navbarTriggerArea); // Tempatkan di paling atas body

    let hideTimeout;

    // Fungsi untuk menampilkan navbar
    function showNavbar() {
        clearTimeout(hideTimeout); // Hapus timeout jika ada
        navbar.classList.add('show-navbar');
    }

    // Fungsi untuk menyembunyikan navbar setelah delay
    function hideNavbarWithDelay() {
        // Hanya sembunyikan jika kursor tidak di atas navbar atau area trigger
        // Kita perlu cara untuk memeriksa apakah kursor masih di area navbar/trigger
        // Cara paling sederhana adalah dengan delay dan membiarkan mouseleave trigger
        hideTimeout = setTimeout(() => {
            navbar.classList.remove('show-navbar');
        }, 300); // Sembunyikan setelah 300ms (sesuaikan delaynya)
    }

    // Event listener untuk area trigger
    navbarTriggerArea.addEventListener('mouseenter', showNavbar);
    navbarTriggerArea.addEventListener('mouseleave', hideNavbarWithDelay);

    // Event listener untuk navbar itu sendiri (jika kursor pindah dari trigger ke navbar)
    navbar.addEventListener('mouseenter', showNavbar);
    navbar.addEventListener('mouseleave', hideNavbarWithDelay);

    // Untuk memastikan navbar tersembunyi saat halaman dimuat (jika ada refresh browser)
    // dan tidak ada hover pada awalnya.
    navbar.classList.remove('show-navbar');
});

// Fungsi sidebar toggle (jika ada)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}