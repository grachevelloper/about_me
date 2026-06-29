export function getTimeOfDay(hour: number, name = 'путник'): string {
    if (hour >= 5 && hour < 12) {
        return `Доброе утро, ${name}`;
    } else if (hour >= 12 && hour < 17) {
        return `Добрый день, ${name} `;
    } else if (hour >= 17 && hour < 23) {
        return `Добрый вечер, ${name} `;
    }
    return `Доброй ночи, ${name}`;
}

export const getSticker = (hour: number) => {
    let randomSticker;
    if (hour >= 5 && hour < 12) {
        randomSticker = MORNINGS_STICKERS[0];
    } else if (hour >= 12 && hour < 18) {
        randomSticker = DAYS_STICKERS[0];
    } else if (hour >= 17 && hour <= 23) {
        randomSticker = EVENINGS_STICKERS[0];
    } else {
        randomSticker = NIGHTS_STICKERS[0];
    }
    return `${randomSticker}`;
};
const MORNINGS_STICKERS = ['☀️'];
const DAYS_STICKERS = ['☀️'];
const EVENINGS_STICKERS = ['🌙'];
const NIGHTS_STICKERS = ['🌙'];
