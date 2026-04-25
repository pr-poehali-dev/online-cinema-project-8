import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import Icon from "@/components/ui/icon";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Episode = {
  num: number;
  title: string;
  url: string;
};

type Series = {
  id: string;
  title: string;
  age: string;
  seasons: number;
  episodes: number;
  years: string;
  desc: string;
  cover: string;
  color: string;
  gradient: string;
  episodeList: Episode[][];
};

type Channel = {
  id: string;
  name: string;
  short: string;
  color: string;
  emoji: string;
  desc: string;
  liveUrl?: string;
};

type ScheduleItem = {
  time: string;
  title: string;
  age?: string;
  desc?: string;
  current?: boolean;
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const GEROYCHIKI_S1: Episode[] = [
  { num: 1, title: "Новые герои", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239052?from=video&linked=1&t=4s" },
  { num: 2, title: "Плохая примета", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239053?from=video&linked=1" },
  { num: 3, title: "Лунная гонка", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239054?from=video&linked=1" },
  { num: 4, title: "Идеальный друг", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239055?from=video&linked=1&t=5s" },
  { num: 5, title: "Флаг для Генерала", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239056?from=video&linked=1&t=26s" },
  { num: 6, title: "Таинственная коробка", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239057?from=video&linked=1&t=15s" },
  { num: 7, title: "Сладкая миссия", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239058?from=video&linked=1&t=1m43s" },
  { num: 8, title: "Супергерой", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239059?from=video&linked=1" },
  { num: 9, title: "Метод Флая", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239060?from=video&linked=1" },
  { num: 10, title: "За фантазию", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239063?from=video&linked=1" },
  { num: 11, title: "Любимая игрушка", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239065?from=video&linked=1" },
  { num: 12, title: "Эмблема команды", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239070?from=video&linked=1" },
  { num: 13, title: "Премия Пинки", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239068?from=video&linked=1" },
  { num: 14, title: "Секрет Де-Кроля", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239071?from=video&linked=1" },
  { num: 15, title: "Одиссея Бублика", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239072?from=video&linked=1" },
  { num: 16, title: "Возвращение Пинки", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239073?from=video&linked=1" },
  { num: 17, title: "Одиночество Бублика", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239074?from=video&linked=1&t=2m21s" },
  { num: 18, title: "Страшный праздник", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239080?from=video&linked=1" },
  { num: 19, title: "Хвост О-Раша", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239075?from=video&linked=1" },
  { num: 20, title: "История Ко-Ко", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239076?from=video&linked=1&t=32s" },
  { num: 21, title: "Конкурс точилок", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239077?from=video&linked=1" },
  { num: 22, title: "Другая Глория", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239079?from=video&linked=1" },
  { num: 23, title: "Мелкотрон Крузо", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239082?from=video&linked=1" },
  { num: 24, title: "История Бублика", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239083?from=video&linked=1&t=3m10s" },
  { num: 25, title: "Жаркий четверг", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239085?from=video&linked=1" },
  { num: 26, title: "Блогер", url: "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239087?from=video&linked=1" },
];

const ALL_SERIES: Series[] = [
  {
    id: "geroychiki",
    title: "Геройчики",
    age: "0+",
    seasons: 2,
    episodes: 26,
    years: "2022–2023",
    desc: "Мальчик Рома очень любит играть, поэтому в его комнате полным-полно разных игрушек. Кого здесь только нет: и загадочный пушистый инопланетянин Бублик, и отважный петух-тянучка Ко-Ко, и благородная ящерица-самурай О-Раш, и милая куколка Пинки, и воинственный плюшевый заяц Генерал Де-Кроль со своими роботами, и, конечно, отважные супергерои Флай и Глория. Все эти игрушки обожают игры, веселье, соревнования, приключения и вечеринки. Когда Ромы нет в комнате, они живут собственной увлекательной игрушечной жизнью.",
    cover: "https://cdn.poehali.dev/projects/910fe3ca-ad3d-465b-9bdc-241cb78b681d/bucket/d6c30dec-8d8f-464a-83e0-b57ec2d580b0.jpeg",
    color: "#FF6B35",
    gradient: "from-[#FF6B35] to-[#e84393]",
    episodeList: [GEROYCHIKI_S1, []],
  },
  {
    id: "um-i-hrum",
    title: "Ум и Хрум",
    age: "0+",
    seasons: 1,
    episodes: 0,
    years: "2022–н.в.",
    desc: "Описание будет добавлено позже.",
    cover: "https://cdn.poehali.dev/projects/910fe3ca-ad3d-465b-9bdc-241cb78b681d/files/094001e8-0660-4b2b-b686-bd7a55ab2b58.jpg",
    color: "#9B59B6",
    gradient: "from-[#9B59B6] to-[#3498DB]",
    episodeList: [[]],
  },
];

const SCHEDULE_DATA: Record<string, ScheduleItem[]> = {
  "Карусель": [
    { time: "05:00", title: "Лунтик", age: "0+", desc: "Проверка — Шапка-невидимка — Сон — Гимн — Роль — Полёты — Назначение — Обмен — Это моё! — Пузырьки — Корзинка — Счастья — Подарок — Одуванчик" },
    { time: "07:00", title: "С добрым утром, малыши!", age: "0+", desc: "Герои легендарной программы «Спокойной ночи, малыши!» теперь не только укладывают детей спать. Они с лёгкостью разбудят каждого ребёнка в детский сад" },
    { time: "07:30", title: "Погода", age: "0+", desc: "Актуальный прогноз погоды от ведущих программы «Спокойной ночи, малыши!»" },
    { time: "07:35", title: "Беби Борн", age: "0+", desc: "Ночная сказка принцессы. Часть 1" },
    { time: "07:40", title: "Простоквашино", age: "0+", desc: "Возвращение в Простоквашино. Часть 1 — Возвращение в Простоквашино. Часть 2 — Сезон дождей — Диета Матроскина — Шарик хочет телефон — Чудовище из" },
    { time: "08:40", title: "Бумажки", age: "0+", desc: "Лютики-цветочки (колокольни) — Няньки (бумажный телевизор) — Бумажная приманка (кормушка) — Робот (точка для цветов)" },
    { time: "09:10", title: "Простоквашино", age: "0+", desc: "Мама и Тима — Вишнёвая феерия — Неудобные соседи — Магазин на лежание — Доброе молоко — Гипноз — Мамонт из Простоквашино" },
    { time: "10:00", title: "Съедобное или несъедобное", age: "0+", desc: "Маша Уланова и печенье" },
    { time: "10:20", title: "Мастер Витя и Мотор", age: "0+", desc: "Супер-магнит — Звезда на высоте — Сбежавшая ракета — Метеоритный дождь — Гонка в Ваугаде — Кухонный переполох — Музыкотик" },
    { time: "12:00", title: "Парк Турум-Бурум", age: "0+", desc: "«Парк Турум-Бурум» — это развлекательное шоу, наполненное песнями, танцами, невероятными изобретениями и, конечно же, дружбой!" },
    { time: "12:15", title: "Барбоскины", age: "0+", desc: "Важное событие — Нобелевская премия — Резонанс — Игровая приставка — Улыбка фортуны — Через тернии к звёздам — Фамильная ценность — Пульт" },
    { time: "14:00", title: "Зоомания", age: "6+", desc: "Кошачьи" },
    { time: "14:20", title: "Чик-Чирикино", age: "0+", desc: "Аквапарк — Игра в гагару — Кладоискатели — Первая работа — Годовщина — Космос — Клюв и магия" },
    { time: "16:00", title: "Большое Шоу", age: "6+", desc: "Познавательная игра специально к юбилею любимого телеканала «Карусель»" },
    { time: "16:30", title: "Сказочный патруль. Дорога домой", age: "0+", desc: "Принц Зарт — Неуловимый Хват — Баллада о Пастилине — Кафе «Баранка» — Сила красоты — Таинственный рыцарь — Волшебные помощники — Сад Дубомира" },
    { time: "19:30", title: "Фиксики. Большой секрет", age: "6+", desc: "Героям нужно объединиться, чтобы спасти свой самый большой секрет!" },
    { time: "20:40", title: "Фиксипелки", age: "0+", desc: "Шоколадка — Зонтик — Ниточка — Холодильник — Колесо — Пупс — Батарейки — Компьютер — Рюкзак — Бом-тили-бом" },
    { time: "21:00", title: "Спокойной ночи, малыши!", age: "0+", desc: "Передача «Спокойной ночи, малыши!» — уникальное явление на телевидении. Программа существует с сентября 1964 года. Она никогда не переставала выходить" },
    { time: "21:15", title: "Ум и Хрум", age: "0+", desc: "Запекантус — Тревожные сырки — Молекулярная кухня — Мини-Хрум — Мятная реакция — Блинотавр — Секретный агент — Опасная вкусняшка — Третий глаз" },
    { time: "23:00", title: "Дикие Скричеры!", age: "6+", desc: "Фальшивый Ксандер" },
    { time: "23:15", title: "Приключения Пети и Волка", age: "12+", desc: "Дело Книги счастья — Дело о Мастерах блефа — Дело о Ктулху — Дело о Диванизме и антимебелизме — Дело о Мухе в янтаре — Дело о Последней стреле Амура" },
    { time: "02:00", title: "Маша и Медведь", age: "0+", desc: "Затерянный мир — Зуб даю! — Умный в гору не пойдёт — Машина машина — Баоцзы и Красная шапочка — Мохнатые качели — Топ-топ модель — Грязное дело — Байки" },
    { time: "04:05", title: "Маша и Медведь. Песенки для малышей", age: "0+", desc: "Шалун-Балун" },
    { time: "04:10", title: "Маша и Медведь", age: "0+", desc: "Репетиция оркестра — Усатый-полосатый — Порядочек — Дышите! Не дышите! — Подкидыш — Модный заплыв — Приятного аппетита — Фокус-покус" },
  ],
  "Россия 1": [
    { time: "06:00", title: "Утро России" },
    { time: "09:00", title: "О самом главном" },
    { time: "10:00", title: "Вести в 10:00" },
    { time: "12:00", title: "Судьба человека" },
    { time: "14:00", title: "Вести в 14:00" },
    { time: "15:00", title: "60 минут" },
    { time: "18:00", title: "Вести в 18:00" },
    { time: "20:00", title: "Вести недели" },
    { time: "22:00", title: "Воскресный вечер" },
  ],
  "НТВ": [
    { time: "06:00", title: "НТВ утром" },
    { time: "08:00", title: "Утро. Самое лучшее" },
    { time: "10:00", title: "Смотр" },
    { time: "11:00", title: "Следствие вели..." },
    { time: "13:00", title: "Центральное телевидение" },
    { time: "15:00", title: "Ты не поверишь!" },
    { time: "17:00", title: "ЧП. Расследование" },
    { time: "19:00", title: "Место встречи" },
    { time: "21:00", title: "Сегодня вечером" },
  ],
  "СТС": [
    { time: "06:00", title: "Том и Джерри" },
    { time: "07:30", title: "Три кота" },
    { time: "09:00", title: "СТС Kids" },
    { time: "11:00", title: "Барбоскины" },
    { time: "12:30", title: "Кино на СТС" },
    { time: "15:00", title: "Семейный просмотр" },
    { time: "18:00", title: "Воронины" },
    { time: "20:00", title: "СТС вечером" },
    { time: "22:00", title: "Кино для взрослых" },
  ],
  "ТНТ": [
    { time: "07:00", title: "Мультфильмы" },
    { time: "09:00", title: "Однажды в России" },
    { time: "11:00", title: "Интерны" },
    { time: "13:00", title: "Студия Союз" },
    { time: "15:00", title: "Comedy Club" },
    { time: "18:00", title: "Физрук" },
    { time: "20:00", title: "ТНТ. Best" },
    { time: "22:00", title: "Импровизация" },
  ],
  "Матч ТВ": [
    { time: "07:00", title: "Все на Матч!" },
    { time: "09:00", title: "Студия Матч" },
    { time: "11:00", title: "Футбол. Обзор туров" },
    { time: "13:00", title: "Хоккей. КХЛ" },
    { time: "16:00", title: "Футбол. РФПЛ" },
    { time: "19:00", title: "Вечер на Матч" },
    { time: "21:00", title: "Ночь на Матч" },
  ],
  "Культура": [
    { time: "07:00", title: "Утро на Культуре" },
    { time: "09:00", title: "Новости культуры" },
    { time: "10:00", title: "Наблюдатель" },
    { time: "12:00", title: "Власть факта" },
    { time: "14:00", title: "Кинопоэзия" },
    { time: "16:00", title: "Документальный фильм" },
    { time: "18:00", title: "Новости культуры" },
    { time: "20:00", title: "Линия жизни" },
    { time: "22:00", title: "Худсовет" },
  ],
  "Россия 24": [
    { time: "00:00", title: "Новости 24/7" },
    { time: "09:00", title: "Утренние новости" },
    { time: "12:00", title: "Дневные новости" },
    { time: "18:00", title: "Вечерние новости" },
    { time: "21:00", title: "Итоги дня" },
  ],
  "Пятый канал": [
    { time: "06:00", title: "Утро на пятом" },
    { time: "09:00", title: "Место происшествия" },
    { time: "11:00", title: "Сейчас" },
    { time: "12:00", title: "Детективы" },
    { time: "16:00", title: "Следователи" },
    { time: "20:00", title: "Сейчас вечером" },
    { time: "22:00", title: "Ночной эфир" },
  ],
  "РЕН ТВ": [
    { time: "07:00", title: "Добров в эфире" },
    { time: "09:00", title: "Территория заблуждений" },
    { time: "12:00", title: "Засекреченные списки" },
    { time: "15:00", title: "Военная тайна" },
    { time: "18:00", title: "Информационная программа" },
    { time: "20:00", title: "Документальный фильм" },
    { time: "22:00", title: "Ночной РЕН ТВ" },
  ],
  "ОТР": [
    { time: "07:00", title: "ОТРажение" },
    { time: "09:00", title: "Большая страна" },
    { time: "12:00", title: "ОТРажение (дневное)" },
    { time: "15:00", title: "Документальный цикл" },
    { time: "18:00", title: "ОТРажение" },
    { time: "21:00", title: "Вечернее ОТРажение" },
  ],
  "ТВК": [
    { time: "07:00", title: "Новости ТВК" },
    { time: "09:00", title: "Утро с ТВК" },
    { time: "12:00", title: "Новости ТВК" },
    { time: "15:00", title: "Местный прогноз" },
    { time: "18:00", title: "Новости ТВК вечер" },
    { time: "21:00", title: "Итоги дня ТВК" },
  ],
};

const CHANNELS: Channel[] = [
  { id: "karusel", name: "Карусель", short: "🎠", color: "#E91E8C", emoji: "🎠", desc: "Главный детский телеканал России", liveUrl: "https://zabava-htlive.cdn.ngenix.net/hls/CH_KARUSEL/variant.m3u8" },
  { id: "russia1", name: "Россия 1", short: "Р1", color: "#E53935", emoji: "📺", desc: "Главный государственный телеканал страны", liveUrl: "https://vgtrkregion-reg.cdnvideo.ru/vgtrk/0/russia1-hd/index.m3u8" },
  { id: "ntv", name: "НТВ", short: "НТВ", color: "#1565C0", emoji: "📰", desc: "Новости, кино и расследования", liveUrl: "https://zabava-htlive.cdn.ngenix.net/hls/CH_NTV/variant.m3u8" },
  { id: "russia24", name: "Россия 24", short: "Р24", color: "#00838F", emoji: "🌐", desc: "Круглосуточный новостной канал", liveUrl: "https://vgtrkregion-reg.cdnvideo.ru/vgtrk/abakan/russia24-sd/index.m3u8" },
  { id: "5tv", name: "Пятый канал", short: "5", color: "#2E7D32", emoji: "5️⃣", desc: "Новости, детективы, сериалы", liveUrl: "https://zabava-htlive.cdn.ngenix.net/hls/CH_5TV/variant.m3u8" },
  { id: "rentv", name: "РЕН ТВ", short: "РЕН", color: "#F57F17", emoji: "🔍", desc: "Документальные расследования", liveUrl: "https://zabava-htlive.cdn.ngenix.net/hls/CH_RENTV/variant.m3u8" },
  { id: "sts", name: "СТС", short: "СТС", color: "#c0136e", emoji: "🎭", desc: "Семейное развлекательное ТВ", liveUrl: "https://zabava-htlive.cdn.ngenix.net/hls/CH_STS/variant.m3u8" },
  { id: "tnt", name: "ТНТ", short: "ТНТ", color: "#FF6B35", emoji: "😄", desc: "Юмор и реалити-шоу", liveUrl: "https://streaming.televizor-24-tochka.ru/live/38.m3u8" },
  { id: "match", name: "Матч ТВ", short: "⚽", color: "#43A047", emoji: "⚽", desc: "Спортивные трансляции 24/7" },
  { id: "kultura", name: "Культура", short: "К", color: "#6A1B9A", emoji: "🎭", desc: "Классика, документальное кино, искусство", liveUrl: "https://vgtrkregion-reg.cdnvideo.ru/vgtrk/0/kultura-hd/index.m3u8" },
  { id: "otr", name: "ОТР", short: "ОТР", color: "#00796B", emoji: "🗣️", desc: "Общественное телевидение России" },
  { id: "tvk", name: "ТВК", short: "ТВК", color: "#37474F", emoji: "📡", desc: "Региональное телевидение Красноярска" },
];

// ─── NAV ─────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "series", label: "Мультсериалы", icon: "PlayCircle" },
  { id: "channels", label: "ТВ-каналы", icon: "Tv" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function extractVkId(url: string): string | null {
  const m = url.match(/video(-?\d+_\d+)/);
  return m ? m[1] : null;
}

// Преобразует "HH:MM" в минуты от начала суток
function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Определяет индекс текущей передачи по реальному времени
function getCurrentIndex(items: ScheduleItem[]): number {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let cur = -1;
  for (let i = 0; i < items.length; i++) {
    const start = timeToMinutes(items[i].time);
    // учитываем переход через полночь: передачи после 00:00 считаем как >24h
    const adjustedStart = start < 300 ? start + 1440 : start;
    const adjustedNow = nowMin < 300 ? nowMin + 1440 : nowMin;
    if (adjustedNow >= adjustedStart) cur = i;
  }
  return cur;
}

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function LiveClock() {
  const t = useClock();
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  const ss = String(t.getSeconds()).padStart(2, "0");
  return (
    <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 ml-auto">
      <Icon name="Clock" size={13} />
      <span className="text-white/70 text-sm font-mono font-bold tracking-widest">
        {hh}<span className="text-white/30 animate-pulse">:</span>{mm}<span className="text-white/30 animate-pulse">:</span>{ss}
      </span>
    </div>
  );
}

// ─── HLS PLAYER ──────────────────────────────────────────────────────────────

function HlsPlayer({ url, channelName, onClose }: { url: string; channelName: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setError(false);
    setLoading(true);

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setError(true);
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch(() => {});
      });
    } else {
      setError(true);
    }
  }, [url]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0">
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-bold" style={{ fontFamily: "Golos Text" }}>{channelName}</span>
          <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2 py-0.5 rounded-full">ПРЯМОЙ ЭФИР</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-black">
        {error ? (
          <div className="text-center text-white/40">
            <Icon name="WifiOff" size={48} />
            <div className="mt-3 font-semibold">Трансляция недоступна</div>
            <div className="text-sm mt-1 text-white/30">Возможно, канал временно не работает</div>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-sm text-white hover:bg-white/20 transition-colors">
              Закрыть
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-5xl aspect-video">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                <div className="text-white/50 text-sm flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Загрузка эфира...
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              className="w-full h-full rounded-2xl bg-black"
              controls
              playsInline
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 group">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E91E8C] to-[#FF6B35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
        <span className="text-lg">🚀</span>
      </div>
      <div className="text-left">
        <div className="font-black text-white text-lg leading-none" style={{ fontFamily: "Nunito" }}>
          Поехали
        </div>
        <div className="text-[10px] text-white/40 leading-none mt-0.5">онлайн-кинотеатр</div>
      </div>
    </button>
  );
}

function Navbar({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <nav className="sticky top-0 z-50 bg-[#0d0f1a]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-16">
        <Logo onClick={() => setActive("home")} />
        <div className="flex items-center gap-1 ml-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                active === item.id
                  ? "bg-[#E91E8C] text-white shadow-lg shadow-pink-900/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontFamily: "Golos Text" }}
            >
              <Icon name={item.icon} size={15} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
        <LiveClock />
      </div>
    </nav>
  );
}

// ─── PLAYER MODAL ────────────────────────────────────────────────────────────

function PlayerModal({
  episode,
  series,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  episode: Episode;
  series: Series;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const vkId = extractVkId(episode.url);
  const embedUrl = vkId
    ? `https://vkvideo.ru/video_ext.php?oid=${vkId.split("_")[0]}&id=${vkId.split("_")[1]}&hd=2&autoplay=1`
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10 flex-shrink-0">
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold truncate" style={{ fontFamily: "Golos Text" }}>
            {series.title} · Серия {episode.num}
          </div>
          <div className="text-white/40 text-sm truncate">{episode.title}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium disabled:opacity-30 hover:bg-white/20 transition-colors flex items-center gap-1"
          >
            <Icon name="ChevronLeft" size={16} />
            Пред.
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="px-3 py-1.5 rounded-lg bg-[#E91E8C] text-white text-sm font-medium disabled:opacity-30 hover:bg-[#d01578] transition-colors flex items-center gap-1"
          >
            След.
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>

      {/* Player */}
      <div className="flex-1 flex items-center justify-center p-4">
        {embedUrl ? (
          <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        ) : (
          <div className="text-white/40 text-center">
            <Icon name="VideoOff" size={48} />
            <div className="mt-3">Плеер недоступен</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SERIES DETAIL ───────────────────────────────────────────────────────────

function SeriesDetail({ series, onBack }: { series: Series; onBack: () => void }) {
  const [activeSeason, setActiveSeason] = useState(0);
  const [playingEp, setPlayingEp] = useState<Episode | null>(null);
  const episodes = series.episodeList[activeSeason] ?? [];
  const currentIdx = playingEp ? episodes.findIndex((e) => e.num === playingEp.num) : -1;

  return (
    <div className="min-h-screen bg-[#0d0f1a]">
      {/* Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={series.cover} alt={series.title} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1a] via-[#0d0f1a]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-4 transition-colors"
          >
            <Icon name="ChevronLeft" size={16} />
            Назад
          </button>
          <div className="flex items-end gap-4">
            <img src={series.cover} alt={series.title} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover shadow-2xl border-2 border-white/10 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">{series.age}</span>
                <span className="text-xs text-white/50">{series.years}</span>
                <span className="text-xs text-white/50">· {series.seasons} сезона</span>
                <span className="text-xs text-white/50">· {series.episodes} серий</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "Nunito" }}>
                {series.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Description */}
        <p className="text-white/60 leading-relaxed mb-8 text-sm md:text-base">{series.desc}</p>

        {/* Season tabs */}
        <div className="flex gap-2 mb-6">
          {series.episodeList.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSeason(i)}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeSeason === i
                  ? "bg-[#E91E8C] text-white shadow-lg shadow-pink-900/30"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
              style={{ fontFamily: "Golos Text" }}
            >
              Сезон {i + 1}
            </button>
          ))}
        </div>

        {/* Episodes */}
        {episodes.length === 0 ? (
          <div className="text-center py-16 text-white/20">
            <div className="text-4xl mb-3">🎬</div>
            <div className="font-semibold">Серии будут добавлены позже</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {episodes.map((ep) => (
              <button
                key={ep.num}
                onClick={() => setPlayingEp(ep)}
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-2xl px-5 py-4 text-left transition-all group border border-white/0 hover:border-white/10"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/40 font-black text-sm group-hover:bg-[#E91E8C] group-hover:text-white transition-all flex-shrink-0">
                  {ep.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate" style={{ fontFamily: "Golos Text" }}>
                    {ep.title}
                  </div>
                  <div className="text-white/30 text-xs mt-0.5">Серия {ep.num}</div>
                </div>
                <div className="text-white/20 group-hover:text-[#E91E8C] transition-colors flex-shrink-0">
                  <Icon name="Play" size={18} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Player */}
      {playingEp && (
        <PlayerModal
          episode={playingEp}
          series={series}
          onClose={() => setPlayingEp(null)}
          onPrev={() => currentIdx > 0 && setPlayingEp(episodes[currentIdx - 1])}
          onNext={() => currentIdx < episodes.length - 1 && setPlayingEp(episodes[currentIdx + 1])}
          hasPrev={currentIdx > 0}
          hasNext={currentIdx < episodes.length - 1}
        />
      )}
    </div>
  );
}

// ─── SERIES PAGE ─────────────────────────────────────────────────────────────

function SeriesPage() {
  const [selected, setSelected] = useState<Series | null>(null);
  if (selected) return <SeriesDetail series={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="min-h-screen bg-[#0d0f1a]">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "Nunito" }}>🎬 Мультсериалы</h1>
        <p className="text-white/40 mb-8">Смотри любимые мультики онлайн</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ALL_SERIES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="group text-left rounded-2xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={s.cover}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2 flex gap-1.5">
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
                    {s.age}
                  </span>
                  <span className="text-xs bg-[#E91E8C]/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
                    {s.seasons} сезона
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-[#E91E8C] flex items-center justify-center shadow-xl">
                    <Icon name="Play" size={24} />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "Golos Text" }}>
                  {s.title}
                </div>
                <div className="text-white/30 text-xs mt-1">{s.years} · {s.episodes} серий</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CHANNELS PAGE ───────────────────────────────────────────────────────────

function ChannelsPage() {
  const [selectedCh, setSelectedCh] = useState<Channel | null>(null);
  const [liveChannel, setLiveChannel] = useState<Channel | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0f1a]">
      {liveChannel && liveChannel.liveUrl && (
        <HlsPlayer
          url={liveChannel.liveUrl}
          channelName={liveChannel.name}
          onClose={() => setLiveChannel(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "Nunito" }}>📡 ТВ-каналы</h1>
        <p className="text-white/40 mb-8">Прямой эфир и программа передач</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {CHANNELS.map((ch) => (
            <div
              key={ch.id}
              className={`rounded-2xl p-4 transition-all border ${
                selectedCh?.id === ch.id
                  ? "border-[#E91E8C] bg-[#E91E8C]/10 shadow-lg shadow-pink-900/20"
                  : "border-white/5 bg-white/5"
              }`}
            >
              <button
                onClick={() => setSelectedCh(selectedCh?.id === ch.id ? null : ch)}
                className="w-full text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 font-black"
                  style={{ background: ch.color + "25" }}
                >
                  {ch.emoji}
                </div>
                <div className="font-bold text-white text-sm" style={{ fontFamily: "Golos Text" }}>{ch.name}</div>
                <div className="text-white/30 text-xs mt-0.5 leading-tight">{ch.desc}</div>
              </button>
              {ch.liveUrl && (
                <button
                  onClick={() => setLiveChannel(ch)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all text-white"
                  style={{ background: ch.color }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Прямой эфир
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Schedule panel */}
        {selectedCh && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black"
                  style={{ background: selectedCh.color + "30" }}
                >
                  {selectedCh.emoji}
                </div>
                <div>
                  <h2 className="text-white font-black text-lg" style={{ fontFamily: "Nunito" }}>{selectedCh.name}</h2>
                  <div className="text-white/30 text-xs">Программа передач · 25 апреля</div>
                </div>
              </div>
              {selectedCh.liveUrl && (
                <button
                  onClick={() => setLiveChannel(selectedCh)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: selectedCh.color }}
                >
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Смотреть в эфире
                </button>
              )}
            </div>

            {(SCHEDULE_DATA[selectedCh.name] || []).length === 0 ? (
              <div className="text-center py-12 text-white/20">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-sm">Программа передач будет добавлена позже</div>
              </div>
            ) : (() => {
              const items = SCHEDULE_DATA[selectedCh.name] || [];
              const curIdx = getCurrentIndex(items);
              return (
                <div className="grid gap-2">
                  {items.map((item, i) => {
                    const isCurrent = i === curIdx;
                    const isPast = i < curIdx;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-4 rounded-2xl px-5 py-3 transition-all ${
                          isCurrent
                            ? "bg-gradient-to-r from-[#E91E8C]/20 to-[#FF6B35]/10 border border-[#E91E8C]/30"
                            : isPast
                            ? "bg-white/3 border border-white/0 opacity-40"
                            : "bg-white/5 border border-white/0"
                        }`}
                      >
                        <div
                          className={`font-black text-sm w-12 flex-shrink-0 ${isCurrent ? "text-[#E91E8C]" : isPast ? "text-white/25" : "text-white/40"}`}
                          style={{ fontFamily: "Nunito" }}
                        >
                          {item.time}
                        </div>
                        {isCurrent && (
                          <div className="w-2 h-2 rounded-full bg-[#E91E8C] flex-shrink-0 animate-pulse" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm flex items-center gap-2 flex-wrap ${isCurrent ? "text-white" : isPast ? "text-white/40" : "text-white/80"}`}
                            style={{ fontFamily: "Golos Text" }}>
                            {item.title}
                            {item.age && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${isCurrent ? "bg-white/20 text-white" : "bg-white/10 text-white/30"}`}>
                                {item.age}
                              </span>
                            )}
                          </div>
                          {item.desc && (
                            <div className={`text-xs mt-0.5 line-clamp-1 ${isCurrent ? "text-pink-200/60" : "text-white/25"}`}>
                              {item.desc}
                            </div>
                          )}
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#E91E8C] bg-[#E91E8C]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                            В ЭФИРЕ
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {!selectedCh && (
          <div className="text-center py-16 text-white/20">
            <div className="text-4xl mb-3">📺</div>
            <div className="font-semibold">Выберите канал, чтобы увидеть программу и прямой эфир</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomePage({ setActive }: { setActive: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-[#0d0f1a]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://cdn.poehali.dev/projects/910fe3ca-ad3d-465b-9bdc-241cb78b681d/files/ae4507f5-141c-4a52-98ff-aca943d4e5c7.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0f1a]/60 via-transparent to-[#0d0f1a]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E91E8C]/20 border border-[#E91E8C]/30 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#E91E8C] animate-pulse" />
            <span className="text-[#E91E8C] text-xs font-bold tracking-wide">СМОТРЕТЬ ОНЛАЙН БЕСПЛАТНО</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "Nunito" }}>
            Детское кино<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E91E8C] to-[#FF6B35]">без рекламы</span>
          </h1>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            Мультсериалы, программа передач и прямой эфир в одном месте
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setActive("series")}
              className="bg-gradient-to-r from-[#E91E8C] to-[#FF6B35] text-white font-bold px-8 py-3.5 rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-pink-900/30 flex items-center gap-2"
              style={{ fontFamily: "Golos Text" }}
            >
              <Icon name="Play" size={18} />
              Смотреть мультики
            </button>
            <button
              onClick={() => setActive("channels")}
              className="bg-white/10 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-2"
              style={{ fontFamily: "Golos Text" }}
            >
              <Icon name="Tv" size={18} />
              ТВ-каналы
            </button>
          </div>
        </div>
      </div>

      {/* Now on air */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-white font-bold" style={{ fontFamily: "Golos Text" }}>Сейчас в эфире</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {CHANNELS.slice(0, 6).map((ch) => {
            const current = SCHEDULE_DATA[ch.name]?.find((s) => s.current);
            return (
              <button
                key={ch.id}
                onClick={() => setActive("channels")}
                className="bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl p-3 text-left transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: ch.color + "30" }}
                  >
                    {ch.emoji}
                  </div>
                  <span className="text-white/60 text-xs font-bold">{ch.name}</span>
                </div>
                <div className="text-white text-xs font-semibold leading-tight line-clamp-2" style={{ fontFamily: "Golos Text" }}>
                  {current?.title ?? "—"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mults promo */}
        <h2 className="text-white font-bold mb-4" style={{ fontFamily: "Golos Text" }}>🎬 Мультсериалы</h2>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {ALL_SERIES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive("series")}
              className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-0.5"
            >
              <img src={s.cover} alt={s.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="font-black text-white text-lg leading-tight" style={{ fontFamily: "Nunito" }}>{s.title}</div>
                <div className="text-white/50 text-xs mt-0.5">{s.seasons} сезона · {s.episodes} серий</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

const Index = () => {
  const [active, setActive] = useState("home");

  return (
    <div className="min-h-screen bg-[#0d0f1a]" style={{ fontFamily: "Golos Text" }}>
      <Navbar active={active} setActive={setActive} />
      {active === "home" && <HomePage setActive={setActive} />}
      {active === "series" && <SeriesPage />}
      {active === "channels" && <ChannelsPage />}
    </div>
  );
};

export default Index;