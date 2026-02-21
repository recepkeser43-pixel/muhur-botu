import TelegramBot from 'node-telegram-bot-api';
import xlsx from 'xlsx';
import fs from 'fs';
import http from 'http'; // Render hatasını çözmek için lazım

// --- AYARLAR ---
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const EXCEL_FILE = './bet365-2023-2025-datas.xlsx';
const bot = new TelegramBot(TOKEN, { polling: true });

// --- EXCEL OKUMA ---
let data = [];
if (fs.existsSync(EXCEL_FILE)) {
    try {
        const wb = xlsx.readFile(EXCEL_FILE);
        data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log("Excel hazir.");
    } catch (e) { console.log("Excel okuma hatasi."); }
}

// --- BOT KOMUTLARI ---
bot.onText(/\/start/, (msg) => {
    const durum = data.length > 0 ? ✅ Excel OK! (${data.length} mühür yüklendi) : "❌ Excel okunamadı!";
    bot.sendMessage(msg.chat.id, 🚀 Bot Aktif!\n${durum}\n\n/tara yazarak devam edebilirsin.);
});

// --- RENDER SUSTURUCU (PORT HATASINI ÇÖZER) ---
// Render bu botu web sitesi sandığı için ona bir cevap veriyoruz
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Bot Calisiyor...');
    res.end();
}).listen(process.env.PORT || 8080); 

console.log("🤖 Bot ayağa kalktı...");
