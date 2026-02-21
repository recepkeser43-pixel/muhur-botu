import TelegramBot from 'node-telegram-bot-api';
import xlsx from 'xlsx';
import fs from 'fs';

// Ayarlar
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const EXCEL_FILE = './bet365-2023-2025-datas.xlsx';
const bot = new TelegramBot(TOKEN, { polling: true });

// Excel Okuma Testi
bot.onText(/\/start/, (msg) => {
    let cevap = "✅ ADIM 1 TAMAM: Bot aktif.\n";
    
    if (fs.existsSync(EXCEL_FILE)) {
        try {
            const wb = xlsx.readFile(EXCEL_FILE);
            const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            cevap += 📊 ADIM 2 TAMAM: Excel başarıyla okundu! Toplam ${data.length} mühür yüklendi.;
        } catch (e) {
            cevap += "❌ ADIM 2 HATASI: Excel dosyası var ama okunurken hata verdi.";
        }
    } else {
        cevap += "❌ ADIM 2 HATASI: Excel dosyası GitHub'da bulunamadı! Dosya adını kontrol et.";
    }
    
    bot.sendMessage(msg.chat.id, cevap);
});

console.log("🤖 2. Adım Başlatıldı...");
