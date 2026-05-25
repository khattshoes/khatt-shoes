import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";
import { createContactMessageAction } from "./actions";

type Locale = "az" | "en" | "ru";

const content = {
  az: {
    title: "Əlaqə",
    description:
      "Sifariş, fərdi ayaqqabı hazırlanması və təmir xidməti ilə bağlı müraciətinizi göndərin. Komandamız sizinlə əlaqə saxlayacaq.",
    contactInfo: "Əlaqə məlumatları",
    formTitle: "Müraciət göndərin",
    formDescription:
      "Formu doldurun, müraciətiniz birbaşa sistemimizə düşəcək.",
    fullName: "Ad və soyad",
    phone: "Telefon",
    email: "Email",
    subject: "Mövzu",
    message: "Mesaj",
    fullNamePlaceholder: "Məsələn: Cavid Məmmədov",
    phonePlaceholder: "+994 XX XXX XX XX",
    emailPlaceholder: "email@example.com",
    subjectPlaceholder: "Fərdi sifariş / Təmir / Ayaqqabı seçimi",
    messagePlaceholder:
      "Ölçü, model, rəng, təmir olunacaq hissə və ya digər qeydləri yazın.",
    submit: "Müraciəti göndər",
    requiredError: "Ad və mesaj xanaları mütləq doldurulmalıdır.",
    submitError: "Müraciət göndərilmədi. Zəhmət olmasa yenidən cəhd edin.",
    success: "Müraciətiniz qəbul edildi. Tezliklə sizinlə əlaqə saxlayacağıq.",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    location: "Ünvan",
    locationValue: "Bakı, Azərbaycan",
    mapTitle: "Xəritədə yerimiz",
    mapPlaceholder:
      "Xəritə üçün yer hazırdır. Koordinatlar əlavə edildikdən sonra burada Google Maps görünəcək.",
  },
  en: {
    title: "Contact",
    description:
      "Send your request about orders, custom footwear or repair services. Our team will contact you.",
    contactInfo: "Contact information",
    formTitle: "Send a request",
    formDescription:
      "Fill out the form and your request will be saved directly in our system.",
    fullName: "Full name",
    phone: "Phone",
    email: "Email",
    subject: "Subject",
    message: "Message",
    fullNamePlaceholder: "Example: Javid Mammadov",
    phonePlaceholder: "+994 XX XXX XX XX",
    emailPlaceholder: "email@example.com",
    subjectPlaceholder: "Custom order / Repair / Shoe selection",
    messagePlaceholder:
      "Write your size, model, color, repair details or other notes.",
    submit: "Send request",
    requiredError: "Full name and message are required.",
    submitError: "Request could not be sent. Please try again.",
    success: "Your request has been received. We will contact you soon.",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    location: "Location",
    locationValue: "Baku, Azerbaijan",
    mapTitle: "Find us on the map",
    mapPlaceholder:
      "Map area is ready. Google Maps will appear here after coordinates are added.",
  },
  ru: {
    title: "Контакты",
    description:
      "Отправьте запрос по заказу, индивидуальному пошиву или ремонту обуви. Наша команда свяжется с вами.",
    contactInfo: "Контактная информация",
    formTitle: "Отправить запрос",
    formDescription:
      "Заполните форму, и ваш запрос будет сохранен в нашей системе.",
    fullName: "Имя и фамилия",
    phone: "Телефон",
    email: "Email",
    subject: "Тема",
    message: "Сообщение",
    fullNamePlaceholder: "Например: Джавид Мамедов",
    phonePlaceholder: "+994 XX XXX XX XX",
    emailPlaceholder: "email@example.com",
    subjectPlaceholder: "Индивидуальный заказ / Ремонт / Выбор обуви",
    messagePlaceholder:
      "Укажите размер, модель, цвет, детали ремонта или другие заметки.",
    submit: "Отправить запрос",
    requiredError: "Имя и сообщение обязательны.",
    submitError: "Не удалось отправить запрос. Попробуйте еще раз.",
    success: "Ваш запрос принят. Мы скоро свяжемся с вами.",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    location: "Адрес",
    locationValue: "Баку, Азербайджан",
    mapTitle: "Мы на карте",
    mapPlaceholder:
      "Место для карты готово. После добавления координат здесь появится Google Maps.",
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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = content[currentLocale];

  return (
    <main className="bg-[#0B0A08] text-[#FFF8EA]">
      <section className="border-b border-white/10 py-14 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.34em] text-[#D8BD8A]">
              KHATT Shoes
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              {t.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/62">
              {t.description}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-5">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <h2 className="text-xl font-semibold text-white">
                  {t.contactInfo}
                </h2>

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
                    label="Email"
                    value={contactLinks.emailDisplay}
                    href={`mailto:${contactLinks.emailAddress}`}
                  />
                  <ContactItem
                    icon={<MapPin size={18} />}
                    label={t.location}
                    value={t.locationValue}
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#D8BD8A]/20 bg-[#D8BD8A]/10 p-6">
                <h2 className="text-xl font-semibold text-[#D8BD8A]">
                  {t.mapTitle}
                </h2>

                <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/25 p-6 text-center">
                  <div>
                    <MapPin className="mx-auto text-[#D8BD8A]" size={34} />
                    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/60">
                      {t.mapPlaceholder}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <div className="mb-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8BD8A]/25 bg-[#D8BD8A]/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#D8BD8A]">
                  <Send size={14} />
                  KHATT
                </div>

                <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-white">
                  {t.formTitle}
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/58">
                  {t.formDescription}
                </p>
              </div>

              {query.success === "1" ? (
                <div className="mb-5 flex gap-3 rounded-[1.4rem] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <span>{t.success}</span>
                </div>
              ) : null}

              {query.error ? (
                <div className="mb-5 rounded-[1.4rem] border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
                  {query.error === "required" ? t.requiredError : t.submitError}
                </div>
              ) : null}

              <form action={createContactMessageAction} className="grid gap-4">
                <input type="hidden" name="locale" value={currentLocale} />

                <FormField
                  label={t.fullName}
                  name="full_name"
                  placeholder={t.fullNamePlaceholder}
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label={t.phone}
                    name="phone"
                    placeholder={t.phonePlaceholder}
                  />

                  <FormField
                    label={t.email}
                    name="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                  />
                </div>

                <FormField
                  label={t.subject}
                  name="subject"
                  placeholder={t.subjectPlaceholder}
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
                    name="message"
                    rows={6}
                    required
                    placeholder={t.messagePlaceholder}
                    className="w-full resize-none rounded-[1.2rem] border border-white/10 bg-black/25 px-5 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/28 focus:border-[#D8BD8A]/45"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-7 py-4 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
                >
                  {t.submit}
                  <ArrowRight size={15} />
                </button>
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
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
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
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[1.2rem] border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#D8BD8A]/45"
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