import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

type Locale = "az" | "en" | "ru";

type ContactMessageRow = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

const labels = {
  az: {
    back: "İdarə panelinə qayıt",
    title: "Əlaqə müraciətləri",
    description:
      "Saytdakı əlaqə formasından göndərilən müraciətlər burada görünür.",
    name: "Ad və soyad",
    phone: "Telefon",
    email: "Email",
    subject: "Mövzu",
    message: "Mesaj",
    status: "Status",
    date: "Tarix",
    noMessages: "Hələ əlaqə müraciəti yoxdur.",
    new: "Yeni",
    read: "Oxunub",
  },
  en: {
    back: "Back to dashboard",
    title: "Contact messages",
    description: "Requests submitted from the website contact form appear here.",
    name: "Full name",
    phone: "Phone",
    email: "Email",
    subject: "Subject",
    message: "Message",
    status: "Status",
    date: "Date",
    noMessages: "No contact messages yet.",
    new: "New",
    read: "Read",
  },
  ru: {
    back: "Назад к панели",
    title: "Сообщения",
    description:
      "Заявки, отправленные через контактную форму сайта, отображаются здесь.",
    name: "Имя и фамилия",
    phone: "Телефон",
    email: "Email",
    subject: "Тема",
    message: "Сообщение",
    status: "Статус",
    date: "Дата",
    noMessages: "Пока нет сообщений.",
    new: "Новое",
    read: "Прочитано",
  },
};

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(
    locale === "az" ? "az-AZ" : locale === "ru" ? "ru-RU" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function getStatusLabel(status: string, locale: Locale) {
  const t = labels[locale];

  if (status === "read") {
    return t.read;
  }

  return t.new;
}

function getStatusClass(status: string) {
  if (status === "read") {
    return "border-white/10 bg-white/[0.04] text-white/50";
  }

  return "border-[#D8BD8A]/30 bg-[#D8BD8A]/10 text-[#D8BD8A]";
}

export default async function AdminContactMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = labels[currentLocale];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_messages")
    .select(
      `
      id,
      full_name,
      phone,
      email,
      subject,
      message,
      status,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin contact messages error:", error.message);
  }

  const messages = error ? [] : ((data ?? []) as ContactMessageRow[]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/admin"
            locale={currentLocale}
            className="text-sm text-[#D8BD8A] transition hover:text-white"
          >
            ← {t.back}
          </Link>

          <h1 className="mt-5 text-4xl font-semibold">{t.title}</h1>

          <p className="mt-3 max-w-2xl text-white/50">{t.description}</p>
        </div>
      </div>

      {messages.length ? (
        <div className="grid gap-4">
          {messages.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">
                      {item.full_name}
                    </h2>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status, currentLocale)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-white/40">
                    {formatDate(item.created_at, currentLocale)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.phone ? (
                    <a
                      href={`tel:${item.phone}`}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-[#D8BD8A]/40 hover:text-[#D8BD8A]"
                    >
                      {item.phone}
                    </a>
                  ) : null}

                  {item.email ? (
                    <a
                      href={`mailto:${item.email}`}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-[#D8BD8A]/40 hover:text-[#D8BD8A]"
                    >
                      {item.email}
                    </a>
                  ) : null}
                </div>
              </div>

              {item.subject ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    {t.subject}
                  </p>
                  <p className="mt-2 text-white/75">{item.subject}</p>
                </div>
              ) : null}

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                  {t.message}
                </p>
                <p className="mt-2 whitespace-pre-wrap leading-7 text-white/70">
                  {item.message}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-14 text-center text-white/50">
          {t.noMessages}
        </div>
      )}
    </main>
  );
}