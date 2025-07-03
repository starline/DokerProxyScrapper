function parseIAAItoColumns(url) {
    const api_url = "http://195.189.226.180:3000/render?url=" + encodeURIComponent(url);
    const token = "qwerty321654nk32yfydsl1df"; // 🔐 твой токен

    const options = {
        method: "get",
        headers: {
            "Authorization": "Bearer " + token
        },
        muteHttpExceptions: true
    };

    try {
        const response = UrlFetchApp.fetch(api_url, options);
        const html = response.getContentText();

        Logger.log("=== HTML START ===");
        Logger.log(html);
        Logger.log("=== HTML END ===");

        // ✅ Название авто
        const vehicle_match = html.match(/<h1[^>]*class="[^"]*heading-2[^"]*"[^>]*>(.*?)<\/h1>/i);
        const vehicle = vehicle_match?.[1]?.trim() || "Не найдено";

        // ✅ Пробег — только цифры, без mi/Actual
        const odo_match = html.match(/Odometer:<\/span>\s*<span[^>]*>([\d,]+)/i);
        const odometer = odo_match?.[1]?.replace(/,/g, '') || "Не найдено";

        // ✅ Штат из "Selling Branch" — код в скобках
        const location_match = html.match(/Selling Branch:<\/span>\s*<span[^>]*>[^<]*\((\w{2})\)/i);
        const location = location_match?.[1] || "Не найдено";

        // Возвращаем объект с полями, чтобы использовать в onEdit
        return {
            vehicle,
            odometer,
            location
        };

    } catch (e) {
        return {
            vehicle: "Ошибка",
            odometer: "",
            location: e.message
        };
    }
}

function myOnEdit(e) {
    const sheet = e.source.getActiveSheet();
    const cell = e.range;

    if (cell.getColumn() === 27) {
        const url = cell.getValue();
        if (!url || typeof url !== 'string' || !url.includes('iaai.com')) return;

        const row = cell.getRow();
        const result = parseIAAItoColumns(url);

        sheet.getRange(row, 1).setValue(result.vehicle);    // A
        sheet.getRange(row, 3).setValue(result.odometer);   // C
        sheet.getRange(row, 10).setValue(result.location);  // J
    }
}