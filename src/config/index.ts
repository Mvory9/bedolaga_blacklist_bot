import "dotenv/config";

const Config = {
    TELEGRAM_BOT_TOKEN: getRequiredEnv<string>('TELEGRAM_BOT_TOKEN'),
} as const;

function getRequiredEnv<T>(envKey: string): T {
    const value = process.env[envKey];

    if (value === undefined || value === null) {
        console.error(`❌ Ошибка: Отсутствует обязательная переменная окружения: ${envKey}`);
        console.error(`Пожалуйста, добавьте ${envKey} в файл .env`);
        process.exit(1);
    }

    switch (typeof (null as any as T)) {
        case 'number':
            return Number(value) as T;
        case 'boolean':
            return (value.toLowerCase() === 'true' || value === '1') as T;
        case 'string':
        default:
            return value as T;
    }
}

function getOptionalEnv<T>(envKey: string, defaultValue: string): T {
    const value = process.env[envKey] || defaultValue;

    // Пытаемся определить тип по значению по умолчанию
    // Если defaultValue - число, то и возвращаем число
    const defaultNum = Number(defaultValue);
    if (!isNaN(defaultNum) && defaultValue.trim() !== '' && !isNaN(Number(value))) {
        return Number(value) as T;
    }
    
    // Если defaultValue - булево значение
    const lowerDefault = defaultValue.toLowerCase();
    const lowerValue = value.toLowerCase();
    if (lowerDefault === 'true' || lowerDefault === 'false' || lowerDefault === '1' || lowerDefault === '0') {
        return (lowerValue === 'true' || lowerValue === '1') as T;
    }
    
    // По умолчанию возвращаем строку
    return value as T;
}

export default Config;