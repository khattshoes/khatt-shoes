import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  
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
    branchTitle: "KHATT Shoes Atelye",
    address: "Kövkəb Səfərəliyeva 17, Bakı",
    workingHours: "10:00–22:00",
    contactInfo: "Əlaqə məlumatları",
    formTitle: "Müraciət göndərin",
    fullName: "Ad və soyad",
    phone: "Telefon",
    email: "Email",
    subject: "Mövzu",
    message: "Mesaj",
    fullNamePlaceholder: "Ad və soyad",
    phonePlaceholder: "+994 XX XXX XX XX",
    emailPlaceholder: "Email",
    subjectPlaceholder: "Müraciət mövzusu",
    messagePlaceholder: "Mesajınızı yazın...",
    submit: "Göndər",
    requiredError: "Ad və mesaj xanaları mütləq doldurulmalıdır.",
    submitError: "Müraciət göndərilmədi. Zəhmət olmasa yenidən cəhd edin.",
    success: "Müraciətiniz qəbul edildi. Tezliklə sizinlə əlaqə saxlayacağıq.",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    openMap: "Xəritədə göstər",
  },
  en: {
    title: "Contact us",
    branchTitle: "KHATT Shoes Atelier",
    address: "Kovkeb Sefereliyeva 17, Baku",
    workingHours: "10:00–22:00",
    contactInfo: "Contact information",
    formTitle: "Send a message",
    fullName: "Full name",
    phone: "Phone",
    email: "Email",
    subject: "Subject",
    message: "Message",
    fullNamePlaceholder: "Full name",
    phonePlaceholder: "+994 XX XXX XX XX",
    emailPlaceholder: "Email",
    subjectPlaceholder: "Subject",
    messagePlaceholder: "Write your message...",
    submit: "Send",
    requiredError: "Full name and message are required.",
    submitError: "Request could not be sent. Please try again.",
    success: "Your request has been received. We will contact you soon.",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    openMap: "Show on map",
  },
  ru: {
    title: "Контакты",
    branchTitle: "KHATT Shoes Ателье",
    address: "Ковкаб Сафаралиева, 17, Баку",
    workingHours: "10:00–22:00",
    contactInfo: "Контактная информация",
    formTitle: "Отправить сообщение",
    fullName: "Имя и фамилия",
    phone: "Телефон",
    email: "Email",
    subject: "Тема",
    message: "Сообщение",
    fullNamePlaceholder: "Имя и фамилия",
    phonePlaceholder: "+994 XX XXX XX XX",
    emailPlaceholder: "Email",
    subjectPlaceholder: "Тема обращения",
    messagePlaceholder: "Напишите сообщение...",
    submit: "Отправить",
    requiredError: "Имя и сообщение обязательны.",
    submitError: "Не удалось отправить запрос. Попробуйте еще раз.",
    success: "Ваш запрос принят. Мы скоро свяжемся с вами.",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    openMap: "Показать на карте",
  },
};

const contactLinks = {
  whatsappDisplay: "+994 XX XXX XX XX",
  whatsappUrl: "https://wa.me/994XXXXXXXXX",
  instagramDisplay: "@khatt.shoes",
  instagramUrl: "https://www.instagram.com/khatt.shoes",
  emailDisplay: "info@khatt.az",
  emailAddress: "info@khatt.az",
  mapsUrl: "https://maps.app.goo.gl/Rq2B7JKvbhNdDDnJA",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.3196665005603!2d49.854920976419876!3d40.37960725789714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307ddab8f444b5%3A0x38d562eb273d2282!2sKHATT%20shoes!5e0!3m2!1str!2saz!4v1779690106842!5m2!1str!2saz",
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
     

      <section className="py-12 sm:py-14">
        <Container>
          <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
            <BranchCard
              title={t.branchTitle}
              address={t.address}
              workingHours={t.workingHours}
              phone={contactLinks.whatsappDisplay}
              mapText={t.openMap}
              mapUrl={contactLinks.mapsUrl}
            />

            <ContactInfoCard
              title={t.contactInfo}
              whatsappLabel={t.whatsapp}
              whatsapp={contactLinks.whatsappDisplay}
              whatsappUrl={contactLinks.whatsappUrl}
              instagramLabel={t.instagram}
              instagram={contactLinks.instagramDisplay}
              instagramUrl={contactLinks.instagramUrl}
              email={contactLinks.emailDisplay}
              emailUrl={`mailto:${contactLinks.emailAddress}`}
            />
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-white">
                {t.formTitle}
              </h2>

              {query.success === "1" ? (
                <div className="mt-5 flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <span>{t.success}</span>
                </div>
              ) : null}

              {query.error ? (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
                  {query.error === "required" ? t.requiredError : t.submitError}
                </div>
              ) : null}

              <form action={createContactMessageAction} className="mt-6 grid gap-4">
                <input type="hidden" name="locale" value={currentLocale} />

                <FormField
                  label={t.fullName}
                  name="full_name"
                  placeholder={t.fullNamePlaceholder}
                  required
                />

                <FormField
                  label={t.email}
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                />

                <FormField
                  label={t.phone}
                  name="phone"
                  placeholder={t.phonePlaceholder}
                />

                <FormField
                  label={t.subject}
                  name="subject"
                  placeholder={t.subjectPlaceholder}
                />

                <div>
                  <label htmlFor="message" className="sr-only">
                    {t.message}
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder={t.messagePlaceholder}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-[#D8BD8A]/45"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-[#D8BD8A] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
                >
                  {t.submit}
                </button>
              </form>
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.035]">
              <iframe
                src={contactLinks.mapEmbedUrl}
                title={t.address}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full min-h-[430px] w-full border-0"
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function BranchCard({
  title,
  address,
  workingHours,
  phone,
  mapText,
  mapUrl,
}: {
  title: string;
  address: string;
  workingHours: string;
  phone: string;
  mapText: string;
  mapUrl: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-6">
      <h2 className="text-xl font-semibold tracking-wide text-white">{title}</h2>

      <div className="mt-5 grid gap-3 text-sm leading-6 text-white/65">
        <p className="flex gap-3">
          <MapPin size={16} className="mt-1 shrink-0 text-[#D8BD8A]" />
          <span>{address}</span>
        </p>

        <p className="flex gap-3">
          <Clock size={16} className="mt-1 shrink-0 text-[#D8BD8A]" />
          <span>{workingHours}</span>
        </p>

        <p className="flex gap-3">
          <MessageCircle size={16} className="mt-1 shrink-0 text-[#D8BD8A]" />
          <span>{phone}</span>
        </p>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-[#E7D2A8]"
        >
          {mapText}
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

function ContactInfoCard({
  title,
  whatsappLabel,
  whatsapp,
  whatsappUrl,
  instagramLabel,
  instagram,
  instagramUrl,
  email,
  emailUrl,
}: {
  title: string;
  whatsappLabel: string;
  whatsapp: string;
  whatsappUrl: string;
  instagramLabel: string;
  instagram: string;
  instagramUrl: string;
  email: string;
  emailUrl: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-6">
      <h2 className="text-xl font-semibold tracking-wide text-white">{title}</h2>

      <div className="mt-5 grid gap-3">
        <SimpleLink
          icon={<MessageCircle size={16} />}
          label={whatsappLabel}
          value={whatsapp}
          href={whatsappUrl}
        />

        <SimpleLink
          icon={<MessageCircle size={16} />}
          label={instagramLabel}
          value={instagram}
          href={instagramUrl}
        />

        <SimpleLink
          icon={<Mail size={16} />}
          label="Email"
          value={email}
          href={emailUrl}
        />
      </div>
    </div>
  );
}

function SimpleLink({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm transition hover:border-[#D8BD8A]/35"
    >
      <span className="text-[#D8BD8A]">{icon}</span>
      <span>
        <span className="block text-xs uppercase tracking-[0.16em] text-white/35">
          {label}
        </span>
        <span className="mt-0.5 block text-white/70">{value}</span>
      </span>
    </a>
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
      <label htmlFor={name} className="sr-only">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D8BD8A]/45"
      />
    </div>
  );
}