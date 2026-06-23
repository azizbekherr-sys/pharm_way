import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="section-pad bg-white">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}
