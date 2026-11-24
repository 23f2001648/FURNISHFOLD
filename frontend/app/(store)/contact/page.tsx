"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { PageHeader } from "@/components/ui/page-header";
import { SITE } from "@/lib/constants";

// The backend has no contact endpoint, so the form opens the visitor's email app with the message pre-filled.
export default function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${f.message}\n\n— ${f.name} (${f.email})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Enquiry from " + f.name)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <>
      <PageHeader eyebrow="Contact" title="We’d love to hear from you" text={`Questions about an order or a product? Write to ${SITE.email}.`} />
      <form onSubmit={submit} className="container-ff max-w-xl space-y-5 py-12">
        <Field label="Your name"><Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Email"><Input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Message"><Textarea required value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></Field>
        <Button size="lg">Send message</Button>
      </form>
    </>
  );
}
