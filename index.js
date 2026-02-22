import TelegramBot from 'node-telegram-bot-api';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bot Token
const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(token, { polling: true });

// Excel dosyasının adı
const EXCEL_FILE = 'bulten.xlsx';

// HTTP sunucusu
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Telegram Bülten Botu aktif ve çalışıyor!\n');
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinleniyor.`);
});

// /start komutu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '👋 Merhaba! Mühür analizi botuna hoş geldiniz.\n\nAnaliz için /tara komutunu kullanabilir veya bir maç görseli göndererek (ogc) otomatik analiz yaptırabilirsiniz.');
});

// Resim geldiğinde OCR ile analiz etme (ogc kodu)
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1]; // En yüksek çözünürlüklü resmi al
  
  bot.sendMessage(chatId, '📷 Görsel alınıyor, metinler okunuyor...');

  try {
    const fileLink = await bot.getFileLink(photo.file_id);
    
    // OCR işlemi
    const { data: { text } } = await Tesseract.recognize(fileLink, 'tur+eng');
    console.log('Okunan Metin:', text);

    const filePath = path.join(__dirname, EXCEL_FILE);
    if (!fs.existsSync(filePath)) {
      return bot.sendMessage(chatId, '❌ Excel dosyası bulunamadı.');
    }

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Görseldeki metne göre Excel'de eşleşen takımları bulma
    let foundCount = 0;
    const lowerText = text.toLowerCase();

    data.forEach(row => {
      const home = String(row['Ev Sahibi'] || row['Ev'] || '').toLowerCase();
      const away = String(row['Deplasman'] || row['Dep'] || '').toLowerCase();

      if ((home && lowerText.includes(home)) || (away && lowerText.includes(away))) {
        // Burada mühür algoritmasını da kontrol edebiliriz
        const ms1 = parseFloat(row['MS 1'] || 0);
        const ms2 = parseFloat(row['MS 2'] || 0);
        const iy1 = parseFloat(row['IY 1'] || 0);
        const iy2 = parseFloat(row['IY 2'] || 0);

        if ((ms1 < ms2 && iy1 < iy2) || (ms2 < ms1 && iy2 < iy1)) {
          foundCount++;
        }
      }
    });

    bot.sendMessage(chatId, `✅ Görseldeki takımlardan Excel bülteninizde mühür kriterine uyan *${foundCount}* maç tespit edildi.`, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error('OCR Hatası:', error);
    bot.sendMessage(chatId, '❌ Görsel okunurken bir hata oluştu.');
  }
});

// /tara komutu
bot.onText(/\/tara/, (msg) => {
  const chatId = msg.chat.id;
  const filePath = path.join(__dirname, EXCEL_FILE);

  if (!fs.existsSync(filePath)) {
    return bot.sendMessage(chatId, '❌ Excel dosyası bulunamadı.');
  }

  bot.sendMessage(chatId, '🔍 Analiz ediliyor...');

  try {
    const workbook = xlsx.readFile(filePath);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const matches = [];

    data.forEach((row) => {
      const home = row['Ev Sahibi'] || row['Ev'] || 'Maç';
      const away = row['Deplasman'] || row['Dep'] || '';
      const ms1 = parseFloat(row['MS 1'] || 0);
      const ms2 = parseFloat(row['MS 2'] || 0);
      const iy1 = parseFloat(row['IY 1'] || 0);
      const iy2 = parseFloat(row['IY 2'] || 0);

      if (ms1 > 0 && ms2 > 0) {
        if (ms1 < ms2 && iy1 < iy2) {
          matches.push(`⚽ ${home} - ${away}\n📊 *1/2 Adayı*`);
        } else if (ms2 < ms1 && iy2 < iy1) {
          matches.push(`⚽ ${home} - ${away}\n📊 *2/1 Adayı*`);
        }
      }
    });

    if (matches.length > 0) {
      bot.sendMessage(chatId, `✅ ${matches.length} maç bulundu:\n\n` + matches.slice(0, 15).join('\n\n'), { parse_mode: 'Markdown' });
    } else {
      bot.sendMessage(chatId, 'ℹ️ Uyan maç bulunamadı.');
    }
  } catch (error) {
    bot.sendMessage(chatId, '❌ Hata oluştu.');
  }
});

console.log('Bot aktif...');
