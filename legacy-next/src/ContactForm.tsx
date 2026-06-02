"use client";

import { useState } from "react";

interface FormState {
  name: string;
  phone: string;
  city: string;
  need: string;
}

const initialState: FormState = {
  name: "",
  phone: "",
  city: "",
  need: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  return (
    <form
      className="rounded-lg bg-white p-6 shadow-soft sm:p-8"
      onSubmit={event => {
        event.preventDefault();
        setSubmitted(true);
        setForm(initialState);
      }}
    >
      <h3 className="font-serif text-2xl font-semibold">预约咨询</h3>
      <p className="mt-2 text-sm leading-6 text-ink/58">留下基础信息，销售顾问会根据城市与户型需求联系您。</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">姓名</span>
          <input
            className="mt-2 h-12 w-full rounded-md border border-ink/10 bg-paper px-4 text-sm outline-none transition focus:border-clay focus:bg-white"
            required
            value={form.name}
            onChange={event => updateField("name", event.target.value)}
            placeholder="您的姓名"
            type="text"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">电话</span>
          <input
            className="mt-2 h-12 w-full rounded-md border border-ink/10 bg-paper px-4 text-sm outline-none transition focus:border-clay focus:bg-white"
            required
            value={form.phone}
            onChange={event => updateField("phone", event.target.value)}
            placeholder="联系电话"
            type="tel"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">城市 / 小区</span>
        <input
          className="mt-2 h-12 w-full rounded-md border border-ink/10 bg-paper px-4 text-sm outline-none transition focus:border-clay focus:bg-white"
          value={form.city}
          onChange={event => updateField("city", event.target.value)}
          placeholder="所在城市或小区"
          type="text"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">需求说明</span>
        <textarea
          className="mt-2 min-h-32 w-full rounded-md border border-ink/10 bg-paper px-4 py-3 text-sm outline-none transition focus:border-clay focus:bg-white"
          value={form.need}
          onChange={event => updateField("need", event.target.value)}
          placeholder="例如：卧室门、厨房门、加盟咨询或整屋定制"
        />
      </label>

      <button className="btn-primary mt-6 w-full" type="submit">
        提交预约
      </button>
      {submitted ? <p className="mt-4 rounded-md bg-moss/10 px-4 py-3 text-sm text-moss">已记录本次预约信息，正式上线后会接入后台通知。</p> : null}
    </form>
  );
}
