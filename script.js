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
