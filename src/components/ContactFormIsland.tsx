import { useState, type FormEvent } from "react";

interface FormState {
  city: string;
  name: string;
  need: string;
  phone: string;
}

const initialState: FormState = {
  city: "",
  name: "",
  need: "",
  phone: "",
};

export function ContactFormIsland() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft lg:p-8" onSubmit={handleSubmit}>
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-clay">Consultation</p>
      <h3 className="mt-4 font-serif-cn text-3xl font-bold">预约咨询</h3>
      <p className="mt-3 text-sm leading-7 text-ink/60">留下基础信息，销售顾问会根据城市与户型需求联系您。</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          姓名
          <input className="h-12 rounded-md border border-ink/10 bg-paper px-4 outline-none transition focus:border-clay focus:bg-white" value={form.name} placeholder="您的姓名" onChange={event => updateField("name", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          电话
          <input className="h-12 rounded-md border border-ink/10 bg-paper px-4 outline-none transition focus:border-clay focus:bg-white" value={form.phone} placeholder="联系电话" onChange={event => updateField("phone", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold sm:col-span-2">
          城市 / 小区
          <input className="h-12 rounded-md border border-ink/10 bg-paper px-4 outline-none transition focus:border-clay focus:bg-white" value={form.city} placeholder="所在城市或小区" onChange={event => updateField("city", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold sm:col-span-2">
          需求
          <textarea className="min-h-28 rounded-md border border-ink/10 bg-paper px-4 py-3 outline-none transition focus:border-clay focus:bg-white" value={form.need} placeholder="例如：卧室静音、厨卫玻璃门、招商合作..." onChange={event => updateField("need", event.target.value)} />
        </label>
      </div>

      <button className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-clay px-6 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#963126]" type="submit">
        提交咨询
      </button>
      {submitted ? <p className="mt-4 text-sm font-bold text-clay">已记录当前需求。正式接入 CMS/CRM 后可直接写入后台。</p> : null}
    </form>
  );
}
