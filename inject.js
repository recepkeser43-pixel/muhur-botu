const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const xlsx = require('xlsx');
const fs = require('fs');

// --- AYARLAR ---
// Senin verdiğin Token'ı buraya sabitledim Recep!
const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg'; 
const bot = new TelegramBot(token, { polling: true });
const excelDosyaAdi = './bet365-2023-2025-datas.xlsx';

let muhurKutuphanesi = [];

// 1. Excel'den Sürpriz Maçları (Sadece 2/1 - 1/2) Hafızaya Alma
function excelAnalizEt() {
    try {
        if (fs.existsSync(excelDosyaAdi)) {
            const workbook = xlsx.readFile(excelDosyaAdi);
            const sheetName = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Zaten sadece sürprizleri ayıklayıp sana verdiğim için hepsini alıyoruz
            muhurKutuphanesi = data;

            console.log(✅ Recep, mühürler yüklendi! Hafızada ${muhurKutuphanesi.length} efsane maç var.);
        } else {
            console.log("❌ Excel dosyası bulunamadı! GitHub'a 'bet365-2023-2025-datas.xlsx' isminde yüklemelisin.");
        }
    } catch (err) {
        console.log("❌ Hata: Excel okunurken bir sıkıntı çıktı.");
    }
}

excelAnalizEt();

// 2. Oran Karşılaştırma Motoru (Açılış ve Kapanış)
function oranlariKiyasla(okunanOranlar) {
    if (okunanOranlar.length < 2) return null;

    // Resimden okunan ilk ve son oranı (MS1 ve MS2) alıyoruz
    const ms1 = okunanOranlar[0];
    const ms2 = okunanOranlar[okunanOranlar.length - 1];

    // Excel'deki Open (Açılış) veya Close (Kapanış) sütunlarıyla tam eşleşme arar
    return muhurKutuphanesi.find(m => 
        (String(m.Open_1) === ms1 && String(m.Open_2) === ms2) || 
        (String(m.Close_1) === ms1 && String(m.Close_2) === ms2)
    );
}

// 3. Resim Geldiğinde Analiz Başlar
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🔍 Mühür radarı çalışıyor, Excel taranıyor...");

    try {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileLink = await bot.getFileLink(fileId);

        const { data: { text } } = await Tesseract.recognize(fileLink, 'eng');
        const bulunanOranlar = text.match(/\d+\.\d{2}/g);

        if (!bulunanOranlar) {
            return bot.sendMessage(chatId, "⚠️ Oranları seçemedim Recep. Daha net bir ekran görüntüsü atar mısın?");
        }

        const eslesme = oranlariKiyasla(bulunanOranlar);

        if (eslesme) {
            let mesaj = 🚨 MÜHÜR YAKALANDI REÇEP! 🚨\n\n;
            mesaj += 📍 Benzer Maç: ${eslesme.Home} - ${eslesme.Away}\n;
            mesaj += 💰 Oranlar: ${bulunanOranlar[0]} - ${bulunanOranlar[bulunanOranlar.length-1]}\n;
            mesaj += 🔥 Sonuç: ${eslesme.Result}\n\n;
            mesaj += 💡 Bu oran dizilimi daha önce 2/1 veya 1/2 bitmiş! Tetikte ol.;
            bot.sendMessage(chatId, mesaj);
        } else {
            bot.sendMessage(chatId, "✅ Bu oranlar tertemiz, geçmişte bir mühürle eşleşmedi.");
        }

    } catch (error) {
        bot.sendMessage(chatId, "❌ Bir hata çıktı: " + error.message);
    }
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "⚽ Mühür Dedektörü Hazır Recep!\n\nBet365 bülten resmini at, hem açılışı hem kapanışı kontrol edeyim.");
});
