import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── DATA ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "series", label: "Мультсериалы", icon: "Tv" },
  { id: "channels", label: "ТВ-каналы", icon: "Radio" },
  { id: "schedule", label: "Программа", icon: "CalendarDays" },
  { id: "search", label: "Поиск", icon: "Search" },
];

const SERIES = [
  { id: 1, title: "Маша и Медведь", age: "0+", genre: "Комедия", episodes: 94, color: "#E91E8C", emoji: "🐻" },
  { id: 2, title: "Фиксики", age: "0+", genre: "Познавательный", episodes: 167, color: "#3498DB", emoji: "🔧" },
  { id: 3, title: "Смешарики", age: "0+", genre: "Комедия", episodes: 330, color: "#2ECC71", emoji: "🦔" },
  { id: 4, title: "Барбоскины", age: "0+", genre: "Семейный", episodes: 200, color: "#FF6B35", emoji: "🐕" },
  { id: 5, title: "Лунтик", age: "0+", genre: "Приключения", episodes: 560, color: "#9B59B6", emoji: "🌙" },
  { id: 6, title: "Зоомания", age: "6+", genre: "Природа", episodes: 78, color: "#1ABC9C", emoji: "🦁" },
  { id: 7, title: "Сказочный патруль", age: "0+", genre: "Фэнтези", episodes: 104, color: "#F1C40F", emoji: "✨" },
  { id: 8, title: "Чик-Чирикино", age: "0+", genre: "Приключения", episodes: 52, color: "#E74C3C", emoji: "🐦" },
];

const CHANNELS = [
  { id: 1, name: "Карусель", desc: "Главный детский телеканал России", color: "#E91E8C", emoji: "🎠", freq: "50 кнопка" },
  { id: 2, name: "Мульт", desc: "Лучшие отечественные мультфильмы", color: "#FF6B35", emoji: "🎨", freq: "72 кнопка" },
  { id: 3, name: "Disney", desc: "Любимые персонажи Disney и Marvel", color: "#3498DB", emoji: "🏰", freq: "73 кнопка" },
  { id: 4, name: "Nickelodeon", desc: "Развлечения без остановки", color: "#F1C40F", emoji: "🧡", freq: "74 кнопка" },
  { id: 5, name: "СТС Kids", desc: "Приключения и юмор для детей", color: "#2ECC71", emoji: "🌟", freq: "51 кнопка" },
  { id: 6, name: "Мульт в кино", desc: "Кино для всей семьи", color: "#9B59B6", emoji: "🎬", freq: "75 кнопка" },
];

type ScheduleItem = {
  time: string;
  title: string;
  age: string;
  desc: string;
  current?: boolean;
  past?: boolean;
  emoji: string;
};

const SCHEDULE: Record<string, ScheduleItem[]> = {
  "25": [
    { time: "07:00", title: "Маша и Медведь", age: "0+", desc: "Репетиция оркестра — Усатый-полосатый", past: true, emoji: "🐻" },
    { time: "08:00", title: "Смешарики", age: "0+", desc: "Новые серии", past: true, emoji: "🦔" },
    { time: "09:30", title: "Фиксики", age: "0+", desc: "Как устроен мир вокруг нас", past: true, emoji: "🔧" },
    { time: "12:00", title: "Парк Турум-Бурум", age: "0+", desc: "Развлекательное шоу, наполненное песнями и танцами", past: true, emoji: "🎡" },
    { time: "12:15", title: "Барбоскины", age: "0+", desc: "Важное событие — Нобелевская премия — Резонанс", past: true, emoji: "🐕" },
    { time: "14:00", title: "Зоомания", age: "6+", desc: "Кошачьи", past: true, emoji: "🦁" },
    { time: "14:20", title: "Чик-Чирикино", age: "0+", desc: "Аквапарк — Игра в гагару — Кладоискатели", past: true, emoji: "🐦" },
    { time: "16:00", title: "Большое Шоу", age: "6+", desc: "Познавательная игра к юбилею телеканала «Карусель»", past: true, emoji: "🌟" },
    { time: "16:30", title: "Сказочный патруль", age: "0+", desc: "Дорога домой — Принц Зарт — Неуловимый Хват", past: true, emoji: "✨" },
    { time: "19:30", title: "Фиксики. Большой секрет", age: "6+", desc: "Героям нужно объединиться, чтобы спасти самый большой секрет!", current: true, emoji: "🔧" },
    { time: "20:40", title: "Фиксипелки", age: "0+", desc: "Шоколадка — Зонтик — Ниточка — Холодильник", emoji: "🎵" },
    { time: "21:00", title: "Спокойной ночи, малыши!", age: "0+", desc: "Уникальное явление на телевидении с 1964 года", emoji: "🌙" },
    { time: "21:15", title: "Ум и Хрум", age: "0+", desc: "Запекантус — Тревожные сырки — Молекулярная кухня", emoji: "🧠" },
    { time: "23:00", title: "Дикие Скричеры!", age: "6+", desc: "Фальшивый Ксандер", emoji: "🦊" },
    { time: "23:15", title: "Приключения Пети и Волка", age: "12+", desc: "Дело Книги счастья — Дело о Мастерах блефа", emoji: "🐺" },
    { time: "02:00", title: "Маша и Медведь", age: "0+", desc: "Затерянный мир — Зуб даю! — Умный в гору не пойдёт", emoji: "🐻" },
  ],
  "26": [
    { time: "07:00", title: "Лунтик", age: "0+", desc: "Доброе утро с Лунтиком", emoji: "🌙" },
    { time: "09:00", title: "Смешарики", age: "0+", desc: "Утренний блок мультфильмов", emoji: "🦔" },
    { time: "11:00", title: "Маша и Медведь", age: "0+", desc: "Лучшие серии", emoji: "🐻" },
    { time: "13:00", title: "Фиксики", age: "0+", desc: "Воскресный марафон", emoji: "🔧" },
    { time: "15:00", title: "Сказочный патруль", age: "0+", desc: "Новые приключения", emoji: "✨" },
    { time: "17:00", title: "Барбоскины", age: "0+", desc: "Семейный вечер", emoji: "🐕" },
    { time: "19:00", title: "Зоомания", age: "6+", desc: "Воскресный выпуск", emoji: "🦁" },
    { time: "21:00", title: "Спокойной ночи, малыши!", age: "0+", desc: "Традиционная вечерняя передача", emoji: "🌙" },
  ],
};

const WEEK_DAYS = [
  { num: "20", day: "пн" },
  { num: "21", day: "вт" },
  { num: "22", day: "ср" },
  { num: "23", day: "чт" },
  { num: "24", day: "пт" },
  { num: "25", day: "сб" },
  { num: "26", day: "вс" },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E91E8C] to-[#FF6B35] flex items-center justify-center text-white text-lg font-black shadow-lg">
        📺
      </div>
      <div>
        <div className="font-black text-lg leading-none text-gray-900" style={{ fontFamily: "Nunito" }}>
          КарусельГид
        </div>
        <div className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">программа передач</div>
      </div>
    </div>
  );
}

function Navbar({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Logo />
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active === item.id
                  ? "bg-[#E91E8C] text-white shadow-md shadow-pink-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              style={{ fontFamily: "Golos Text" }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
              active === item.id ? "text-[#E91E8C]" : "text-gray-400"
            }`}
          >
            <Icon name={item.icon} size={20} />
            <span className="text-[9px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── HOME ───────────────────────────────────────────────────────────────────

function HomePage({ setActive }: { setActive: (id: string) => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#E91E8C] via-[#c0136e] to-[#FF6B35] p-8 md:p-12 mb-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <img src="https://cdn.poehali.dev/projects/910fe3ca-ad3d-465b-9bdc-241cb78b681d/files/1683c972-e18c-44dc-a7a7-f57f038f1095.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <div className="text-5xl mb-4">📺✨</div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3" style={{ fontFamily: "Nunito" }}>
            Всё детское ТВ<br />в одном месте
          </h1>
          <p className="text-pink-100 text-lg mb-6 max-w-lg">
            Программа передач, расписание мультфильмов и каталог сериалов для ваших детей
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActive("schedule")}
              className="bg-white text-[#E91E8C] font-bold px-6 py-3 rounded-2xl hover:bg-pink-50 transition-colors shadow-lg"
              style={{ fontFamily: "Golos Text" }}
            >
              📅 Программа сегодня
            </button>
            <button
              onClick={() => setActive("series")}
              className="bg-white/20 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/30 transition-colors border border-white/30"
              style={{ fontFamily: "Golos Text" }}
            >
              🎬 Мультсериалы
            </button>
          </div>
        </div>
      </div>

      {/* Now on air */}
      <div className="mb-8">
        <h2 className="text-xl font-black text-gray-900 mb-4" style={{ fontFamily: "Nunito" }}>
          🟢 Сейчас в эфире
        </h2>
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#1ABC9C] rounded-2xl p-5 text-white flex items-center gap-4 shadow-lg shadow-green-100">
          <div className="text-4xl">🔧</div>
          <div className="flex-1">
            <div className="font-black text-xl" style={{ fontFamily: "Nunito" }}>Фиксики. Большой секрет</div>
            <div className="text-green-100 text-sm">19:30 · Карусель · 6+</div>
            <div className="text-white/80 text-sm mt-1">Героям нужно объединиться, чтобы спасти самый большой секрет!</div>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <div className="text-2xl font-black">19:30</div>
            <div className="text-green-100 text-xs">в эфире</div>
          </div>
        </div>
      </div>

      {/* Quick sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "📺", label: "Программа передач", sub: "25 апреля", action: "schedule", color: "from-[#E91E8C] to-[#c0136e]" },
          { icon: "🎬", label: "Мультсериалы", sub: "8 сериалов", action: "series", color: "from-[#3498DB] to-[#2980B9]" },
          { icon: "📡", label: "ТВ-каналы", sub: "6 каналов", action: "channels", color: "from-[#FF6B35] to-[#e55a22]" },
          { icon: "🔍", label: "Поиск", sub: "Найти передачу", action: "search", color: "from-[#9B59B6] to-[#8e44ad]" },
        ].map((card) => (
          <button
            key={card.action}
            onClick={() => setActive(card.action)}
            className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-5 text-left hover:scale-105 transition-transform shadow-md`}
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="font-bold text-sm" style={{ fontFamily: "Golos Text" }}>{card.label}</div>
            <div className="text-white/70 text-xs mt-0.5">{card.sub}</div>
          </button>
        ))}
      </div>

      {/* Popular series */}
      <div>
        <h2 className="text-xl font-black text-gray-900 mb-4" style={{ fontFamily: "Nunito" }}>
          ⭐ Популярные мультсериалы
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SERIES.slice(0, 4).map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="font-bold text-gray-900 text-sm leading-tight" style={{ fontFamily: "Golos Text" }}>{s.title}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{s.age}</span>
                <span className="text-xs text-gray-400">{s.genre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SERIES ─────────────────────────────────────────────────────────────────

function SeriesPage() {
  const [filter, setFilter] = useState("all");
  const genres = ["all", "Комедия", "Познавательный", "Приключения", "Природа", "Семейный", "Фэнтези"];
  const filtered = filter === "all" ? SERIES : SERIES.filter((s) => s.genre === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: "Nunito" }}>🎬 Мультсериалы</h1>
        <p className="text-gray-400">Каталог детских сериалов в эфире</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === g ? "bg-[#E91E8C] text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
            }`}
            style={{ fontFamily: "Golos Text" }}
          >
            {g === "all" ? "Все жанры" : g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: s.color + "20" }}
            >
              {s.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900" style={{ fontFamily: "Golos Text" }}>{s.title}</div>
              <div className="text-sm text-gray-400 mt-0.5">{s.genre} · {s.episodes} серий</div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: s.color }}
                >
                  {s.age}
                </span>
              </div>
            </div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#E91E8C] hover:bg-pink-50 transition-colors flex-shrink-0">
              <Icon name="Bell" size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHANNELS ───────────────────────────────────────────────────────────────

function ChannelsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: "Nunito" }}>📡 ТВ-каналы</h1>
        <p className="text-gray-400">Детские телеканалы в вашем кабельном пакете</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHANNELS.map((ch) => (
          <div key={ch.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                style={{ background: ch.color + "20" }}
              >
                {ch.emoji}
              </div>
              <div>
                <div className="font-black text-gray-900 text-lg" style={{ fontFamily: "Nunito" }}>{ch.name}</div>
                <div className="text-xs text-gray-400 font-medium">{ch.freq}</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">{ch.desc}</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">Нажмите, чтобы смотреть программу</span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{ background: ch.color }}
              >
                <Icon name="ChevronRight" size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-[#3498DB] to-[#2980B9] rounded-2xl p-6 text-white">
        <div className="text-2xl mb-2">📶</div>
        <h3 className="font-black text-lg mb-1" style={{ fontFamily: "Nunito" }}>Онлайн-просмотр</h3>
        <p className="text-blue-100 text-sm">Все перечисленные каналы доступны в кабельном, спутниковом и цифровом эфирном ТВ. Точный номер кнопки зависит от вашего оператора.</p>
      </div>
    </div>
  );
}

// ─── SCHEDULE ───────────────────────────────────────────────────────────────

function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("25");
  const [showPast, setShowPast] = useState(false);
  const items = SCHEDULE[selectedDay] || [];
  const past = items.filter((i) => i.past);
  const upcoming = items.filter((i) => !i.past);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: "Nunito" }}>📅 Программа передач</h1>
        <p className="text-gray-400">Канал Карусель · апрель 2026</p>
      </div>

      {/* Day picker */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {WEEK_DAYS.map((d) => (
          <button
            key={d.num}
            onClick={() => setSelectedDay(d.num)}
            className={`flex-shrink-0 flex flex-col items-center w-14 py-2 rounded-2xl font-bold transition-all ${
              selectedDay === d.num
                ? "bg-[#E91E8C] text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-500 border border-gray-200 hover:border-pink-200"
            }`}
            style={{ fontFamily: "Golos Text" }}
          >
            <span className="text-lg leading-none">{d.num}</span>
            <span className="text-[10px] mt-0.5 uppercase tracking-wide">{d.day}</span>
          </button>
        ))}
      </div>

      {/* Past toggle */}
      {past.length > 0 && (
        <button
          onClick={() => setShowPast(!showPast)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3 mb-4 text-gray-500 hover:border-gray-300 transition-colors"
          style={{ fontFamily: "Golos Text" }}
        >
          <span className="font-semibold text-sm">Прошедшие передачи ({past.length})</span>
          <Icon name={showPast ? "ChevronUp" : "ChevronDown"} size={18} />
        </button>
      )}

      {showPast && past.length > 0 && (
        <div className="space-y-2 mb-4">
          {past.map((item, i) => (
            <ScheduleCard key={i} item={item} dimmed />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {upcoming.map((item, i) => (
          <ScheduleCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

function ScheduleCard({ item, dimmed }: { item: ScheduleItem; dimmed?: boolean }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl p-4 transition-all ${
        item.current
          ? "bg-gradient-to-r from-[#2ECC71] to-[#1ABC9C] text-white shadow-lg shadow-green-100"
          : dimmed
          ? "bg-white border border-gray-100 opacity-60"
          : "bg-white border border-gray-100 hover:shadow-sm"
      }`}
    >
      <div className={`text-xl font-black w-14 flex-shrink-0 ${item.current ? "text-white" : "text-gray-400"}`} style={{ fontFamily: "Nunito" }}>
        {item.time}
      </div>
      <div className="text-2xl flex-shrink-0">{item.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm ${item.current ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "Golos Text" }}>
          {item.title}
          <span className={`ml-2 text-xs font-normal ${item.current ? "text-green-100" : "text-gray-400"}`}>{item.age}</span>
        </div>
        <div className={`text-xs mt-0.5 truncate ${item.current ? "text-green-100" : "text-gray-400"}`}>{item.desc}</div>
      </div>
      <button className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
        item.current ? "text-white/70 hover:text-white" : "text-gray-300 hover:text-[#E91E8C] hover:bg-pink-50"
      }`}>
        <Icon name="Bell" size={16} />
      </button>
    </div>
  );
}

// ─── SEARCH ─────────────────────────────────────────────────────────────────

function SearchPage() {
  const [query, setQuery] = useState("");
  const all = [...SERIES.map((s) => ({ type: "series", title: s.title, sub: `Сериал · ${s.genre} · ${s.age}`, emoji: s.emoji })),
    ...CHANNELS.map((c) => ({ type: "channel", title: c.name, sub: `Канал · ${c.freq}`, emoji: c.emoji })),
    ...SCHEDULE["25"].map((s) => ({ type: "schedule", title: s.title, sub: `Программа · ${s.time}`, emoji: s.emoji })),
  ];
  const results = query.length > 1 ? all.filter((i) => i.title.toLowerCase().includes(query.toLowerCase())) : [];
  const popular = SERIES.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: "Nunito" }}>🔍 Поиск</h1>
        <p className="text-gray-400">Найдите мультфильм или передачу</p>
      </div>

      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
          <Icon name="Search" size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Маша и Медведь, Фиксики, Карусель..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#E91E8C] outline-none text-gray-900 text-lg font-medium transition-colors bg-white"
          style={{ fontFamily: "Golos Text" }}
        />
      </div>

      {query.length > 1 ? (
        <div>
          <p className="text-sm text-gray-400 mb-3">Найдено: {results.length}</p>
          {results.length === 0 ? (
            <div className="text-center py-16 text-gray-300">
              <div className="text-5xl mb-3">🔦</div>
              <div className="font-semibold text-gray-400">Ничего не найдено</div>
              <div className="text-sm mt-1">Попробуйте другой запрос</div>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                  <div className="text-2xl">{r.emoji}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: "Golos Text" }}>{r.title}</div>
                    <div className="text-xs text-gray-400">{r.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Популярные запросы</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {["Маша и Медведь", "Фиксики", "Смешарики", "Карусель", "Барбоскины", "Лунтик"].map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:border-[#E91E8C] hover:text-[#E91E8C] transition-colors"
                style={{ fontFamily: "Golos Text" }}
              >
                {q}
              </button>
            ))}
          </div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Сериалы</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popular.map((s) => (
              <button
                key={s.id}
                onClick={() => setQuery(s.title)}
                className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: "Golos Text" }}>{s.title}</div>
                <div className="text-xs text-gray-400">{s.genre}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────

const Index = () => {
  const [active, setActive] = useState("home");

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Golos Text" }}>
      <Navbar active={active} setActive={setActive} />
      <main>
        {active === "home" && <HomePage setActive={setActive} />}
        {active === "series" && <SeriesPage />}
        {active === "channels" && <ChannelsPage />}
        {active === "schedule" && <SchedulePage />}
        {active === "search" && <SearchPage />}
      </main>
    </div>
  );
};

export default Index;