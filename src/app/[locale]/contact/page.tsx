import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";

type Locale = "az" | "en" | "ru";

const content = {
  az: {
    eyebrow: "Əlaqə",
    introTitle: "Sifarişiniz və ya sualınız üçün bizimlə rahat əlaqə saxlayın",
    introDescription:
      "Ayaqqabı seçimi, fərdi hazırlanma, təmir və bərpa xidmətləri üzrə sizə uyğun məlumatı təqdim etmək üçün müraciətinizi diqqətlə cavablandırırıq.",
    primaryCta: "WhatsApp ilə yazın",
    secondaryCta: "Email göndərin",
    contactInfo: "Əlaqə kanalları",
    formEyebrow: "Müraciət forması",
    formTitle: "Sorğunuzu qısa şəkildə qeyd edin",
    formDescription:
      "Formu doldurduqdan sonra mesajınız email tətbiqinizdə hazır şəkildə açılacaq. Təmir müraciəti üçün ayaqqabının şəkillərini də əlavə etməyiniz tövsiyə olunur.",
    name: "Ad və soyad",
    phone: "Telefon nömrəsi",
    service: "Müraciət mövzusu",
    message: "Qısa məlumat",
    namePlaceholder: "Məsələn: Cavid Məmmədov",
    phonePlaceholder: "+994 XX XXX XX XX",
    servicePlaceholder: "Məsələn: Fərdi sifariş / Təmir / Ayaqqabı seçimi",
    messagePlaceholder:
      "Ölçü, model, rəng, təmir olunacaq hissə və ya digər qeydləri yazın.",
    submit: "Email mesajı hazırla",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    email: "Email",
    location: "Ünvan",
    locationValue: "Bakı, Azərbaycan",
    responseTitle: "Cavablandırma",
    responseText:
      "Müraciətlər adətən gün ərzində cavablandırılır. Daha dəqiq qiymətləndirmə üçün məlumatı mümkün qədər aydın yazın.",
    noteTitle: "Təmir müraciəti üçün",
    noteText:
      "Ayaqqabının ön, yan, altlıq və problemli hissələrinin aydın şəkillərini göndərməyiniz ilkin baxışı sürətləndirir.",
    serviceOptions: [
      "Ayaqqabı seçimi",
      "Fərdi sifariş",
      "Ayaqqabı təmiri",
      "Bərpa və qulluq",
    ],
  },
  en: {
    eyebrow: "Contact",
    introTitle: "Contact us easily for your order or question",
    introDescription:
      "We carefully respond to requests about shoe selection, custom-made shoes, repair and restoration services.",
    primaryCta: "Write on WhatsApp",
    secondaryCta: "Send email",
    contactInfo: "Contact channels",
    formEyebrow: "Request form",
    formTitle: "Briefly describe your request",
    formDescription:
      "After filling the form, your message will open in your email app. For repair requests, adding shoe photos is recommended.",
    name: "Full name",
    phone: "Phone number",
    service: "Request topic",
    message: "Short message",
    namePlaceholder: "Example: Javid Mammadov",
    phonePlaceholder: "+994 XX XXX XX XX",
    servicePlaceholder: "Example: Custom order / Repair / Shoe selection",
    messagePlaceholder:
      "Write your size, model, color, repair details or other notes.",
    submit: "Prepare email message",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    email: "Email",
    location: "Location",
    locationValue: "Baku, Azerbaijan",
    responseTitle: "Response",
    responseText:
      "Requests are usually answered during the day. For a more accurate estimate, please describe your request clearly.",
    noteTitle: "For repair requests",
    noteText:
      "Clear photos of the front, side, sole and damaged parts help speed up the initial review.",
    serviceOptions: [
      "Shoe selection",
      "Custom order",
      "Shoe repair",
      "Restoration and care",
    ],
  },
  ru: {
    eyebrow: "Контакты",
    introTitle: "Свяжитесь с нами по заказу или вопросу",
    introDescription:
      "Мы внимательно отвечаем на обращения по выбору обуви, индивидуальному заказу, ремонту и восстановлению.",
    primaryCta: "Написать в WhatsApp",
    secondaryCta: "Отправить email",
    contactInfo: "Каналы связи",
    formEyebrow: "Форма обращения",
    formTitle: "Кратко опишите ваш запрос",
    formDescription:
      "После заполнения формы сообщение откроется в вашем email-приложении. Для ремонта рекомендуется добавить фото обуви.",
    name: "Имя и фамилия",
    phone: "Номер телефона",
    service: "Тема обращения",
    message: "Краткое сообщение",
    namePlaceholder: "Например: Джавид Мамедов",
    phonePlaceholder: "+994 XX XXX XX XX",
    servicePlaceholder: "Например: Индивидуальный заказ / Ремонт / Выбор обуви",
    messagePlaceholder:
      "Укажите размер, модель, цвет, детали ремонта или другие заметки.",
    submit: "Подготовить email",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    email: "Email",
    location: "Адрес",
    locationValue: "Баку, Азербайджан",
    responseTitle: "Ответ",
    responseText:
      "Обращения обычно обрабатываются в течение дня. Для более точной оценки опишите запрос максимально ясно.",
    noteTitle: "Для ремонта",
    noteText:
      "Четкие фото спереди, сбоку, подошвы и поврежденных участков ускоряют первичную оценку.",
    serviceOptions: [
      "Выбор обуви",
      "Индивидуальный заказ",
      "Ремонт обуви",
      "Восстановление и уход",
    ],
  },
};

const contactLinks = {
  whatsappDisplay: "+994 XX XXX XX XX",
  whatsappUrl: "https://wa.me/994XXXXXXXXX",
  instagramDisplay: "@khatt.shoes",
  instagramUrl: "https://www.instagram.com/khatt.shoes",
  emailDisplay: "info@khatt.az",
  emailAddress: "info@khatt.az",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const messages = (await import(`../../../messages/${currentLocale}.json`))
    .default;
  const pageText = messages.Pages;
  const t = content[currentLocale];

  const mailSubject =
    currentLocale === "az"
      ? "KHATT Shoes müraciət"
      : currentLocale === "ru"
        ? "Запрос KHATT Shoes"
        : "KHATT Shoes request";

  const mailBody =
    currentLocale === "az"
      ? "Salam, KHATT Shoes komandası.%0A%0AMüraciət mövzusu:%0AAd və soyad:%0ATelefon:%0AQısa məlumat:%0A"
      : currentLocale === "ru"
        ? "Здравствуйте, команда KHATT Shoes.%0A%0AТема обращения:%0AИмя и фамилия:%0AТелефон:%0AКраткая информация:%0A"
        : "Hello KHATT Shoes team.%0A%0ARequest topic:%0AFull name:%0APhone:%0AShort message:%0A";

  const emailUrl = `mailto:${contactLinks.emailAddress}?subject=${encodeURIComponent(
    mailSubject
  )}&body=${mailBody}`;

  return (
    <main className="bg-[#0B0A08] text-[#FFF8EA]">
      <PageHero
        eyebrow={t.eyebrow}
        title={pageText.contactTitle}
        description={pageText.contactDescription}
      />

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(216,189,138,0.16),rgba(255,255,255,0.035))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-10">
                <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#D8BD8A]/12 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[#8A5A2F]/12 blur-3xl" />

                <div className="relative">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8BD8A]/25 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#D8BD8A] backdrop-blur-md">
                    <Sparkles size={14} />
                    {t.eyebrow}
                  </div>

                  <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">
                    {t.introTitle}
                  </h2>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/64 sm:text-base">
                    {t.introDescription}
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <a
                      href={contactLinks.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
                    >
                      <MessageCircle size={16} />
                      {t.primaryCta}
                    </a>

                    <a
                      href={emailUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-black/15 px-6 py-3.5 text-sm font-semibold text-white/72 transition hover:border-[#D8BD8A]/45 hover:text-[#D8BD8A]"
                    >
                      <Mail size={16} />
                      {t.secondaryCta}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.3rem] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-white">
                    {t.contactInfo}
                  </h3>
                  <span className="rounded-full border border-[#D8BD8A]/20 bg-[#D8BD8A]/10 px-3 py-1 text-xs text-[#D8BD8A]">
                    KHATT
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  <ContactItem
                    icon={<MessageCircle size={18} />}
                    label={t.whatsapp}
                    value={contactLinks.whatsappDisplay}
                    href={contactLinks.whatsappUrl}
                  />
                  <ContactItem
                    icon={<MessageCircle size={18} />}
                    label={t.instagram}
                    value={contactLinks.instagramDisplay}
                    href={contactLinks.instagramUrl}
                  />
                  <ContactItem
                    icon={<Mail size={18} />}
                    label={t.email}
                    value={contactLinks.emailDisplay}
                    href={emailUrl}
                  />
                  <ContactItem
                    icon={<MapPin size={18} />}
                    label={t.location}
                    value={t.locationValue}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Clock size={18} />}
                  title={t.responseTitle}
                  text={t.responseText}
                />
                <InfoCard
                  icon={<Send size={18} />}
                  title={t.noteTitle}
                  text={t.noteText}
                />
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-8 lg:sticky lg:top-24 lg:self-start">
              <div className="mb-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8BD8A]/25 bg-[#D8BD8A]/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#D8BD8A]">
                  <Send size={14} />
                  {t.formEyebrow}
                </div>

                <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-white">
                  {t.formTitle}
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/58">
                  {t.formDescription}
                </p>
              </div>

              <form action={emailUrl} className="grid gap-4">
                <FormField
                  label={t.name}
                  name="name"
                  placeholder={t.namePlaceholder}
                />

                <FormField
                  label={t.phone}
                  name="phone"
                  placeholder={t.phonePlaceholder}
                />

                <FormField
                  label={t.service}
                  name="service"
                  placeholder={t.servicePlaceholder}
                />

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/38"
                  >
                    {t.message}
                  </label>
                  <textarea
                    id="message"
                    name="body"
                    rows={6}
                    placeholder={t.messagePlaceholder}
                    className="w-full resize-none rounded-[1.4rem] border border-white/10 bg-black/25 px-5 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/28 focus:border-[#D8BD8A]/45"
                  />
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/35">
                    {t.service}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {t.serviceOptions.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-sm text-white/58"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-7 py-4 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
                >
                  {t.submit}
                  <ArrowRight size={15} />
                </button>

                <a
                  href={contactLinks.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-7 py-4 text-sm font-semibold text-white/66 transition hover:border-[#D8BD8A]/40 hover:text-[#D8BD8A]"
                >
                  <MessageCircle size={16} />
                  {t.primaryCta}
                </a>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function FormField({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/38"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#D8BD8A]/45"
      />
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-[#D8BD8A]/30 hover:bg-white/[0.035]">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8BD8A]/10 text-[#D8BD8A] transition group-hover:bg-[#D8BD8A] group-hover:text-black">
          {icon}
        </span>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/35">
            {label}
          </p>
          <p className="mt-1 text-sm text-white/70">{value}</p>
        </div>
      </div>

      {href ? (
        <ArrowRight
          size={15}
          className="text-white/28 transition group-hover:text-[#D8BD8A]"
        />
      ) : null}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#D8BD8A]/10 text-[#D8BD8A]">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/54">{text}</p>
    </div>
  );
}