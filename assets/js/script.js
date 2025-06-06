// assets/js/script.js

document.addEventListener('DOMContentLoaded', function () {
    /* --- Navbar Functionality (Show/Hide on Scroll/Hover) --- */
    const navbar = document.querySelector('.navbar');
    const navbarTriggerArea = document.createElement('div');
    navbarTriggerArea.style.position = 'fixed';
    navbarTriggerArea.style.top = '0';
    navbarTriggerArea.style.left = '0';
    navbarTriggerArea.style.width = '100%';
    navbarTriggerArea.style.height = '100px'; // Tinggi area trigger
    navbarTriggerArea.style.zIndex = '1060'; // Lebih tinggi dari navbar
    document.body.prepend(navbarTriggerArea);

    let hideTimeout;
    let scrollTimeout; // Untuk menunda sembunyi saat scroll

    function showNavbar() {
        clearTimeout(hideTimeout);
        navbar.classList.add('show-navbar');
    }

    function hideNavbarWithDelay() {
        hideTimeout = setTimeout(() => {
            navbar.classList.remove('show-navbar');
        }, 300);
    }

    // Tampilkan navbar saat mouse masuk area trigger
    navbarTriggerArea.addEventListener('mouseenter', showNavbar);
    navbarTriggerArea.addEventListener('mouseleave', hideNavbarWithDelay);

    // Tampilkan navbar saat mouse masuk navbar itu sendiri
    navbar.addEventListener('mouseenter', showNavbar);
    navbar.addEventListener('mouseleave', hideNavbarWithDelay);

    // Sembunyikan navbar saat halaman dimuat (jika tidak di-hover)
    navbar.classList.remove('show-navbar');

    // Tambahan: Sembunyikan navbar saat scroll ke bawah dan tampilkan saat scroll ke atas
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        // Hapus timeout sebelumnya agar tidak bertabrakan dengan hover
        clearTimeout(hideTimeout);
        clearTimeout(scrollTimeout);

        if (window.scrollY < lastScrollY) {
            // Scrolling up
            showNavbar();
        } else if (window.scrollY > lastScrollY && window.scrollY > 100) {
            // Scrolling down, dan sudah melewati area trigger
            // Tunda penyembunyian, untuk kasus scroll berhenti di tengah
            scrollTimeout = setTimeout(() => {
                navbar.classList.remove('show-navbar');
            }, 300); // Sesuaikan delay jika perlu
        }
        lastScrollY = window.scrollY;
    });

    // Handle initial state on load: if page reloads and scroll is already down
    if (window.scrollY > 100) {
        navbar.classList.remove('show-navbar');
    }

    /* --- Sidebar Functionality (Mobile Responsiveness) --- */
    const sidebar = document.getElementById('mainSidebar'); // Pastikan sidebar punya ID 'mainSidebar'
    const hamburgerIcon = document.querySelector('.hamburger-icon'); // Ambil elemen hamburger icon baru
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.classList.add('sidebar-overlay'); // Tambahkan kelas overlay
    document.body.appendChild(sidebarOverlay); // Masukkan overlay ke body

    // Fungsi untuk membuka/menutup sidebar
    function toggleSidebar() {
        if (sidebar) {
            sidebar.classList.toggle('show');
            // Toggle kelas body.sidebar-open untuk mengunci scroll
            document.body.classList.toggle('sidebar-open', sidebar.classList.contains('show'));
            // Toggle overlay
            sidebarOverlay.classList.toggle('active', sidebar.classList.contains('show'));
            // Tambahkan toggle class 'active' ke hamburger icon untuk animasinya
            if (hamburgerIcon) {
                hamburgerIcon.classList.toggle('active', sidebar.classList.contains('show'));
            }
        }
    }

    // Event listener untuk tombol toggle
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', toggleSidebar);
    }

    // Event listener untuk menutup sidebar saat klik di luar (di overlay atau konten utama)
    // dan saat klik link navigasi di dalam sidebar
    document.addEventListener('click', function (event) {
        const isMobile = window.innerWidth <= 768; // Definisikan isMobile di dalam event listener juga

        if (isMobile && sidebar.classList.contains('show')) {
            // Klik di luar sidebar dan tombol hamburger
            if (!sidebar.contains(event.target) && (!hamburgerIcon || !hamburgerIcon.contains(event.target))) {
                toggleSidebar(); // Tutup sidebar
            }
            // Klik pada link navigasi di dalam sidebar
            if (event.target.closest('.nav-link')) {
                toggleSidebar(); // Tutup sidebar setelah klik link
            }
        }
    });

    // Event listener untuk overlay (klik pada overlay akan menutup sidebar)
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Tutup sidebar saat resize dari mobile ke desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            document.body.classList.remove('sidebar-open');
            sidebarOverlay.classList.remove('active');
            // Pastikan animasi hamburger icon juga direset
            if (hamburgerIcon) {
                hamburgerIcon.classList.remove('active');
            }
        }
        // Atur kembali visibility sidebar untuk desktop jika sebelumnya disembunyikan oleh JS mobile
        if (window.innerWidth > 768 && sidebar) {
            sidebar.style.transform = 'translateX(0)';
        }
    });

    /* --- General UI Functionality --- */

    // Update current date (panggil sekali saja)
    updateCurrentDate(); // Pastikan fungsi ini didefinisikan di tempat lain atau hapus jika tidak ada

    // Handle navigation link active state (panggil sekali saja)
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /* --- Alerts Page Functionality --- */
    const alertsTable = document.getElementById('alertsTable');
    if (alertsTable) {
        // Simulate marking as read
        alertsTable.addEventListener('click', function (event) {
            if (event.target.closest('.btn-info') && event.target.closest('.btn-info').title === 'Tandai Dibaca') {
                const row = event.target.closest('tr');
                if (row) {
                    row.classList.remove('table-warning', 'table-danger', 'table-success', 'table-info');
                    alert('Peringatan ditandai sebagai dibaca!');
                }
            }
        });

        // Simulate "Mark All as Read"
        const markAllBtn = document.querySelector('.btn-outline-danger');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', function () {
                const rows = document.querySelectorAll('#alertsTable tbody tr');
                rows.forEach(row => {
                    row.classList.remove('table-warning', 'table-danger', 'table-success', 'table-info');
                });
                alert('Semua peringatan ditandai sebagai dibaca!');
            });
        }
    }


    /* --- Inventory Page Functionality (Filter & Search) --- */
    const searchInput = document.getElementById('searchInput');
    const kategoriFilter = document.getElementById('kategoriFilter');
    const stokFilter = document.getElementById('stokFilter');
    const barangTable = document.getElementById('barangTable');

    if (searchInput && kategoriFilter && stokFilter && barangTable) {
        searchInput.addEventListener('keyup', filterTable);
        kategoriFilter.addEventListener('change', filterTable);
        stokFilter.addEventListener('change', filterTable);

        // Function definition for filterTable
        function filterTable() {
            const searchVal = searchInput.value.toLowerCase();
            const kategoriVal = kategoriFilter.value;
            const stokVal = stokFilter.value;
            const rows = barangTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const namaBarang = row.cells[1].textContent.toLowerCase();
                const kategori = row.cells[2].textContent;
                const statusStok = row.cells[6].textContent;

                const matchesSearch = namaBarang.includes(searchVal);
                const matchesKategori = (kategoriVal === 'Semua Kategori' || kategori === kategoriVal);
                const matchesStok = (stokVal === 'Semua Stok' || statusStok === stokVal);

                if (matchesSearch && matchesKategori && matchesStok) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }
    }

    const resetFiltersBtn = document.querySelector('.btn-outline-secondary'); // Asumsi ada tombol reset dengan kelas ini
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            if (kategoriFilter) kategoriFilter.value = 'Semua Kategori';
            if (stokFilter) stokFilter.value = 'Semua Stok';
            if (barangTable) filterTable();
        });
    }

    /* --- Barang Keluar Form Functionality --- */
    const formBarangKeluar = document.getElementById('formBarangKeluar');
    const tanggalKeluarInput = document.getElementById('tanggalKeluar');
    const namaBarangKeluarSelect = document.getElementById('namaBarang'); // Asumsi ID sama
    const satuanKeluarInput = document.getElementById('satuanKeluar'); // Asumsi ID sama

    if (formBarangKeluar && tanggalKeluarInput) {
        formBarangKeluar.addEventListener('submit', function (event) {
            event.preventDefault();

            const tanggal = tanggalKeluarInput.value;
            const namaBarang = namaBarangKeluarSelect ? namaBarangKeluarSelect.value : '';
            const jumlah = document.getElementById('jumlahKeluar').value;
            const penerima = document.getElementById('penerima').value;
            const hargaJual = document.getElementById('hargaJual').value;
            const catatan = document.getElementById('catatan').value;

            if (!tanggal || !namaBarang || !jumlah || !penerima) {
                alert('Mohon lengkapi semua data yang wajib diisi!');
                return;
            }

            const tableBody = document.getElementById('riwayatKeluarTable')?.getElementsByTagName('tbody')[0];
            if (tableBody) {
                const newRow = tableBody.insertRow(0); // Add at the top

                const rowCount = tableBody.rows.length;
                newRow.insertCell(0).textContent = rowCount;
                newRow.insertCell(1).textContent = new Date(tanggal).toLocaleDateString('id-ID');
                newRow.insertCell(2).textContent = namaBarang;
                newRow.insertCell(3).textContent = `${jumlah} ${satuanKeluarInput ? satuanKeluarInput.value : 'Unit'}`;
                newRow.insertCell(4).textContent = penerima;
                newRow.insertCell(5).textContent = hargaJual ? `Rp ${(parseInt(jumlah) * parseInt(hargaJual)).toLocaleString('id-ID')}` : 'N/A';

                const actionsCell = newRow.insertCell(6);
                actionsCell.innerHTML = `
                    <button class="btn btn-info btn-sm me-1" title="Detail"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-danger btn-sm" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                `;
            }

            alert(`Barang keluar "${namaBarang}" sejumlah ${jumlah} ke ${penerima} berhasil dicatat!`);
            this.reset();
            tanggalKeluarInput.valueAsDate = new Date();
        });

        // Initialize tanggalKeluar with current date
        tanggalKeluarInput.valueAsDate = new Date();

        // Autocomplete unit for Barang Keluar form
        if (namaBarangKeluarSelect) {
            namaBarangKeluarSelect.addEventListener('change', function () {
                const selectedItem = this.value;
                let satuan = '';
                // Anda akan mengganti ini dengan logika yang mengambil satuan dari database barang
                if (selectedItem.includes('Unit')) {
                    satuan = 'Unit';
                } else if (selectedItem.includes('Botol')) {
                    satuan = 'Botol';
                } else if (selectedItem.includes('Karung')) {
                    satuan = 'Karung';
                } else {
                    satuan = '';
                }
                if (satuanKeluarInput) {
                    satuanKeluarInput.value = satuan;
                }
            });
        }
    }
});

// Pastikan fungsi updateCurrentDate() ada di scope global atau dihapus jika tidak digunakan
function updateCurrentDate() {
    // Implementasi fungsi untuk memperbarui tanggal saat ini jika diperlukan
    // Contoh sederhana:
    // const dateElement = document.getElementById('currentDate');
    // if (dateElement) {
    //     dateElement.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    // }
}
// Initialize current date
function updateCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', options);
}

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    sidebar.classList.toggle('show');
}

// Navigation handler
function showPage(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to clicked link
    event.target.classList.add('active');

    // Add page transition animation
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0.7';
    mainContent.style.transform = 'translateY(10px)';

    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';

        // Here you would typically load different page content
        console.log(`Navigating to: ${page}`);

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            document.getElementById('mainSidebar').classList.remove('show');
        }
    }, 150);
}

// Quick action handler
function quickAction(action) {
    const actionMessages = {
        'add-item': 'Membuka form tambah barang baru...',
        'stock-in': 'Membuka form barang masuk...',
        'stock-out': 'Membuka form barang keluar...',
        'generate-report': 'Mempersiapkan laporan...'
    };

    // Add loading effect
    event.currentTarget.classList.add('loading-animation');

    setTimeout(() => {
        event.currentTarget.classList.remove('loading-animation');
        alert(actionMessages[action] || 'Aksi tidak dikenali');
    }, 1000);
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.1)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1 Jan', '8 Jan', '15 Jan', '22 Jan', '29 Jan', '5 Feb'],
            datasets: [{
                label: 'Barang Masuk',
                data: [65, 78, 85, 92, 88, 95],
                borderColor: '#667eea',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Barang Keluar',
                data: [45, 52, 48, 61, 58, 72],
                borderColor: '#f5576c',
                backgroundColor: 'rgba(245, 87, 108, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f5576c',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0',
                        font: {
                            size: 11,
                            family: 'Inter'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0',
                        font: {
                            size: 11,
                            family: 'Inter'
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Animate statistics on scroll
function animateStats() {
    const stats = document.querySelectorAll('.stats-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent.replace(/,/g, ''));
                let currentValue = 0;
                const increment = finalValue / 50;

                const updateValue = () => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue.toLocaleString();
                    } else {
                        target.textContent = Math.floor(currentValue).toLocaleString();
                        requestAnimationFrame(updateValue);
                    }
                };

                updateValue();
                observer.unobserve(target);
            }
        });
    });

    stats.forEach(stat => observer.observe(stat));
}

// Real-time clock update
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const clockElement = document.getElementById('liveClock');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// Add live clock to navbar
function addLiveClock() {
    const navbarText = document.querySelector('.navbar-text');
    if (navbarText) {
        navbarText.innerHTML += ' | <span id="liveClock"></span>';
        setInterval(updateClock, 1000);
        updateClock();
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.5s ease;
        `;

    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Auto-refresh data simulation
function simulateDataRefresh() {
    setInterval(() => {
        // Update random statistics
        const statsNumbers = document.querySelectorAll('.stats-number');
        statsNumbers.forEach((stat, index) => {
            const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and +2
            const newValue = Math.max(0, currentValue + change);
            stat.textContent = newValue.toLocaleString();
        });

        // Add new activity
        addNewActivity();
    }, 30000); // Every 30 seconds
}

// Add new activity to recent activities
function addNewActivity() {
    const activities = [
        { type: 'Barang Masuk', desc: 'Printer Canon - 3 unit', time: 'Baru saja' },
        { type: 'Barang Keluar', desc: 'Headset Gaming - 1 unit', time: 'Baru saja' },
        { type: 'Update Stok', desc: 'Scanner HP - 8 unit', time: 'Baru saja' },
        { type: 'Peringatan', desc: 'Tinta Printer - Stok rendah', time: 'Baru saja' }
    ];

    const recentActivity = document.querySelector('.recent-activity');
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

    const newActivityItem = document.createElement('div');
    newActivityItem.className = 'activity-item';
    newActivityItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <strong>${randomActivity.type}</strong>
                <small class="text-muted">${randomActivity.time}</small>
            </div>
            <p class="mb-0 text-muted">${randomActivity.desc}</p>
        `;

    recentActivity.insertBefore(newActivityItem, recentActivity.firstChild);

    // Remove oldest activity if more than 5
    const activityItems = recentActivity.querySelectorAll('.activity-item');
    if (activityItems.length > 5) {
        activityItems[activityItems.length - 1].remove();
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function () {
    updateCurrentDate();
    addLiveClock();
    initializeChart();
    animateStats();
    simulateDataRefresh();

    // Show welcome notification
    setTimeout(() => {
        showNotification('Selamat datang di Dashboard Gudang! Semua sistem berjalan normal.', 'info');
    }, 1000);
});

// Handle window resize
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        document.getElementById('mainSidebar').classList.remove('show');
    }
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('mainSidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');

    if (window.innerWidth <= 768 &&
        !sidebar.contains(event.target) &&
        !sidebarToggle.contains(event.target) &&
        sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
    }
});

// Add smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});