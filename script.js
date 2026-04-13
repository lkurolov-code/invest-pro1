function hisobla() {
    const summaSelect = document.getElementById('summa');
    const kunSelect = document.getElementById('kun');

    if (!summaSelect || !kunSelect) return;

    const summa = parseFloat(summaSelect.value);
    const options = kunSelect.options;

    // --- TARIF CHEKLOVLARI ---
    if (summa === 200000) {
        options[1].disabled = true;
        options[2].disabled = true;
        kunSelect.value = "60";
    }
    else if (summa === 500000) {
        options[1].disabled = false;
        options[2].disabled = true;
        if (kunSelect.value === "365") kunSelect.value = "150";
    }
    else if (summa === 1000000) {
        options[1].disabled = false;
        options[2].disabled = false;
    }

    // --- HISOB-KITOB (3%) ---
    const kunlar = parseInt(kunSelect.value);
    const kunlikFoiz = 0.03;

    const kunlikFoyda = summa * kunlikFoiz;
    const jamiSofFoyda = kunlikFoyda * kunlar;

    // --- NATIJALARNI CHIQARISH ---
    document.getElementById('kunlikFoyda').innerText = Math.floor(kunlikFoyda).toLocaleString() + " UZS";
    document.getElementById('umumiyFoyda').innerText = Math.floor(jamiSofFoyda).toLocaleString() + " UZS";
    document.getElementById('jamiSumma').innerText = Math.floor(jamiSofFoyda).toLocaleString() + " UZS";
}

// --- TELEGRAMGA YUBORISH FUNKSIYASI ---
function sarmoyaniBoshlash() {
    // 1. Tanlangan ma'lumotlarni yig'ish
    const tarif = document.getElementById('summa').options[document.getElementById('summa').selectedIndex].text;
    const muddat = document.getElementById('kun').options[document.getElementById('kun').selectedIndex].text;
    const kunlik = document.getElementById('kunlikFoyda').innerText;
    const jami = document.getElementById('jamiSumma').innerText;

    // 2. Xabar matnini tayyorlash
    const text = `Yangi sarmoya buyurtmasi:%0A%0A` +
        `📚 Tarif: ${tarif}%0A` +
        `📅 Muddat: ${muddat}%0A` +
        `💸 Kunlik tushum: ${kunlik}%0A` +
        `💰 Jami daromad: ${jami}`;

    // 3. Telegramga yo'naltirish (Username qismini o'zingiznikiga almashtiring)
    const telegramUser = "kitobsavda_admin";
    window.location.href = `https://t.me/kitobsavda?text=${text}`;
}

window.onload = hisobla;
// 1. ASOSIY SAHIFADAGI TUGMA UCHUN
function kitobSotibOlish(nomi, narxi, foiz) {
    const tanlov = {
        nomi: nomi,
        narxi: narxi,
        foiz: foiz,
        sana: new Date().toLocaleString()
    };
    localStorage.setItem('pending_plan', JSON.stringify(tanlov));
    window.location.href = 'active.html';
}

// 2. ISMNI SAQLASH VA PROFILNI OCHISH
// 1. SAHIFA YUKLANGANDA PROFILNI TEKSHIRISH
window.onload = function () {
    const savedData = localStorage.getItem('user_profile');
    if (savedData) {
        renderProfile(JSON.parse(savedData));
    }
};

// 2. ISMNI SAQLASH VA PROFILNI OCHISH
function ishniBoshlash() {
    const input = document.getElementById('user-fullname');
    const ism = input.value.trim();
    const tanlanganTarif = JSON.parse(localStorage.getItem('pending_plan'));

    if (ism.length < 3) {
        alert("Iltimos, ismingizni kiriting!");
        return;
    }

    if (!tanlanganTarif) {
        alert("Avval tarif tanlang!");
        window.location.href = 'index.html';
        return;
    }

    const profilData = {
        user: ism,
        plan: tanlanganTarif.nomi,
        summa: tanlanganTarif.narxi,
        sana: new Date().toLocaleString()
    };

    localStorage.setItem('user_profile', JSON.stringify(profilData));
    renderProfile(profilData);
}

// 3. PROFILNI EKRANGA CHIQARISH
function renderProfile(data) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';

    // 1. Ism va asosiy ma'lumotlar
    document.getElementById('p-name').innerText = data.user;
    document.getElementById('p-price').innerText = data.summa;

    // 2. Raqamni hisoblash uchun tozalash (masalan: "200 000 so'm" -> 200000)
    const investSumma = parseInt(data.summa.replace(/[^0-9]/g, ""));

    // 3. Jami foyda (60 kunda 180% foyda)
    const totalProfit = investSumma * 1.8;
    const returnSum = investSumma + totalProfit;

    document.getElementById('p-total-profit').innerText = totalProfit.toLocaleString() + " UZS";
    document.getElementById('p-return-sum').innerText = returnSum.toLocaleString() + " UZS";

    // 4. Sanalarni hisoblash
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 60); // 60 kunlik muddat

    document.getElementById('p-start-date').innerText = startDate.toLocaleDateString();
    document.getElementById('p-end-date').innerText = endDate.toLocaleDateString();
}


// 4. PROFILNI YOPISH (LOGOUT)
// 1. SAHIFA YUKLANGANDA
window.onload = function () {
    const savedData = localStorage.getItem('user_profile');
    if (savedData) {
        renderProfile(JSON.parse(savedData));
    }
};

// 2. ISMNI SAQLASH VA ACTIVE SAHIFASINI OCHISH
function ishniBoshlash() {
    const input = document.getElementById('user-fullname');
    const ism = input ? input.value.trim() : "";
    const tanlanganTarif = JSON.parse(localStorage.getItem('pending_plan'));

    if (ism.length < 3) {
        alert("Iltimos, ism va familiyangizni to'liq kiriting!");
        return;
    }

    if (!tanlanganTarif) {
        alert("Avval tarif tanlang!");
        window.location.href = 'index.html';
        return;
    }

    const profilData = {
        user: ism,
        plan: tanlanganTarif.nomi,
        summa: tanlanganTarif.narxi, // Masalan: "200 000"
        sana: new Date().toLocaleString()
    };

    localStorage.setItem('user_profile', JSON.stringify(profilData));
    renderProfile(profilData);
}

// 3. PROFILNI EKRANGA CHIQARISH VA HISOB-KITOB
function renderProfile(data) {
    // Bo'limlarni ko'rsatish/yashirish
    const authSection = document.getElementById('auth-section');
    const profileSection = document.getElementById('profile-section');
    if (authSection) authSection.style.display = 'none';
    if (profileSection) profileSection.style.display = 'block';

    // Matnlarni joylash
    if (document.getElementById('p-name')) document.getElementById('p-name').innerText = data.user;
    if (document.getElementById('p-plan')) document.getElementById('p-plan').innerText = data.plan;
    if (document.getElementById('p-start-date')) document.getElementById('p-start-date').innerText = data.sana;

    // --- Sarmoyani Hisoblash ---
    // Faqat raqamlarni ajratib olish (200 000 -> 200000)
    const cleanSumma = parseInt(data.summa.toString().replace(/\D/g, ""));

    if (!isNaN(cleanSumma)) {
        const kunlikFoiz = 0.03; // 3%
        const muddat = 60; // kun

        const jamiFoyda = cleanSumma * kunlikFoiz * muddat;
        const jamiSumma = cleanSumma + jamiFoyda;

        // Natijalarni ekranga yozish
        if (document.getElementById('p-total-profit'))
            document.getElementById('p-total-profit').innerText = jamiFoyda.toLocaleString() + " UZS";
        if (document.getElementById('p-return-sum'))
            document.getElementById('p-return-sum').innerText = jamiSumma.toLocaleString() + " UZS";

        // Yakunlanish sanasi
        const end = new Date();
        end.setDate(end.getDate() + muddat);
        if (document.getElementById('p-end-date'))
            document.getElementById('p-end-date').innerText = end.toLocaleDateString();

        // Jonli hisoblagichni boshlash
        startProfitCounter(cleanSumma);
    } else {
        console.error("Summani aniqlab bo'lmadi!");
    }
}

// 4. JONLI FOYDA HISOBLAGICH
function startProfitCounter(baseSum) {
    const profitElement = document.getElementById('p-price');
    if (!profitElement) return;

    let current = baseSum;
    setInterval(() => {
        // Har soniyada 3% ning bir qismini qo'shish
        current += (baseSum * 0.03) / 86400;
        profitElement.innerText = Math.floor(current).toLocaleString() + " UZS";
    }, 1000);
}

// 5. TELEGRAMGA YUBORISH
function savdoQilish() {
    // 1. Profil ma'lumotlarini xotiradan olamiz
    const saqlanganData = JSON.parse(localStorage.getItem('user_profile'));

    if (!saqlanganData) {
        alert("Ma'lumotlar topilmadi!");
        return;
    }

    // 2. Ekranda ko'rinib turgan hisoblangan qiymatlarni olamiz
    const jamiFoyda = document.getElementById('p-total-profit').innerText;
    const qaytadiganSumma = document.getElementById('p-return-sum').innerText;
    const boshlanishSana = document.getElementById('p-start-date').innerText;
    const yakunlanishSana = document.getElementById('p-end-date').innerText;

    // 3. Telegram xabar matnini chiroyli formatda tayyorlash
    const text = encodeURIComponent(
        `🚀 *YANGI SARMОYA BUYURTMASI* 🚀\n\n` +
        `👤 *Investor:* ${saqlanganData.user}\n` +
        `📚 *Tanlangan Tarif:* ${saqlanganData.plan}\n` +
        `💰 *Kiritilgan Sarmoya:* ${saqlanganData.summa}\n` +
        `📈 *Kunlik Daromad:* +3%\n` +
        `📅 *Boshlanish:* ${boshlanishSana}\n` +
        `🏁 *Yakunlanish:* ${yakunlanishSana}\n` +
        `🔥 *Jami Foyda (60 kun):* ${jamiFoyda}\n` +
        `💸 *Qaytariladigan Summa:* ${qaytadiganSumma}\n\n` +
        `✅ *Status:* Tasdiqlash kutilmoqda`
    );

    // 4. ADMIN USERNAME - SHU YERGA O'ZINGIZNIKINI YOZING
    const adminUser = "SIZNING_USERNAME"; // @ belgisiz yozing

    // 5. Telegramga yo'naltirish
    const telegramUrl = `https://t.me/kitobsavda?text=${text}`;

    // Yangi oynada ochish va profilni yangilash
    window.open(telegramUrl, '_blank');
}
function logout() {
    if (confirm("Chiqmoqchimisiz?")) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

// 7. ASOSIY SAHIFADAGI TUGMA FUNKSIYASI
function kitobSotibOlish(nomi, narxi, foiz) {
    const tanlov = { nomi, narxi, foiz };
    localStorage.setItem('pending_plan', JSON.stringify(tanlov));
    window.location.href = 'active.html';
}
