let myChart;

function calculateProfit() {
    // Input elementlarini olish
    const amountInput = document.getElementById('investAmount');
    const select = document.getElementById('planSelect');

    // Qiymatlarni tekshirish va olish
    let amount = parseFloat(amountInput.value) || 0;
    if (amount < 0) amount = 0; // Manfiy son kiritilsa 0 deb hisoblaydi

    const rate = parseFloat(select.value);
    const days = parseInt(select.options[select.selectedIndex].getAttribute('data-days'));

    // Hisob-kitob (Kunlik foyda, Sof foyda va Jami)
    const daily = amount * rate;
    const totalProfit = daily * days;
    const final = amount + totalProfit;

    // Natijalarni formatlab chiqarish (Masalan: 1 200 000 UZS)
    document.getElementById('dailyProfit').innerText = daily.toLocaleString('uz-UZ') + " UZS";
    document.getElementById('totalProfit').innerText = totalProfit.toLocaleString('uz-UZ') + " UZS";
    document.getElementById('finalAmount').innerText = final.toLocaleString('uz-UZ') + " UZS";

    // Grafikni yangilash
    updateChart(amount, daily, days);
}

function updateChart(start, daily, days) {
    const canvas = document.getElementById('profitChart');
    if (!canvas) return; // Canvas topilmasa funksiyani to'xtatadi

    const ctx = canvas.getContext('2d');
    const labels = [];
    const dataPoints = [];
    const step = Math.ceil(days / 6); // Grafikda 7 ta nuqta hosil qilish

    for (let i = 0; i <= days; i += step) {
        labels.push(i + "-kun");
        dataPoints.push(start + (daily * i));
    }

    // Agar oxirgi kun qo'shilmay qolgan bo'lsa, uni qo'shish
    if (labels[labels.length - 1] !== days + "-kun") {
        labels.push(days + "-kun");
        dataPoints.push(start + (daily * days));
    }

    // Eski grafik bo'lsa uni o'chirish (yangi ma'lumotlar bilan chizish uchun)
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sizning balansingiz',
                data: dataPoints,
                borderColor: '#5d5fef',
                backgroundColor: 'rgba(93, 95, 239, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#5d5fef'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.raw.toLocaleString('uz-UZ') + " UZS";
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString('uz-UZ');
                        }
                    }
                }
            }
        }
    });
}

// Sayt to'liq yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', calculateProfit);
