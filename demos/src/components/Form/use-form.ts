import { z } from 'zod';
import { signal, computed } from 'kasper-js';

export function useForm<T extends Record<string, any>>(
  schema: z.ZodObject<any>,
  initial: T
) {
  const values    = signal<T>({ ...initial });
  const errors    = signal<Partial<Record<keyof T, string>>>({});
  const touched   = signal<Partial<Record<keyof T, boolean>>>({});
  const submitting = signal(false);
  const submitted  = signal(false);
  const isValid    = computed(() => schema.safeParse(values.value).success);

  function set(field: keyof T, value: any) {
    values.value = { ...values.value, [field]: value };
    if (touched.value[field]) _validateField(field);
  }

  function touch(field: keyof T) {
    touched.value = { ...touched.value, [field]: true };
    _validateField(field);
  }

  function _validateField(field: keyof T) {
    const result = schema.safeParse(values.value);
    const next = { ...errors.value };
    if (result.success) {
      delete next[field];
    } else {
      const issue = result.error.issues.find(i => i.path[0] === (field as string));
      if (issue) next[field] = issue.message;
      else delete next[field];
    }
    errors.value = next;
  }

  function validate(): boolean {
    touched.value = Object.fromEntries(
      Object.keys(initial).map(k => [k, true])
    ) as Partial<Record<keyof T, boolean>>;

    const result = schema.safeParse(values.value);
    if (result.success) {
      errors.value = {};
      return true;
    }
    const next: Partial<Record<keyof T, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof T;
      if (!next[field]) next[field] = issue.message;
    }
    errors.value = next;
    return false;
  }

  function reset() {
    values.value    = { ...initial };
    errors.value    = {};
    touched.value   = {};
    submitted.value  = false;
    submitting.value = false;
  }

  return { values, errors, touched, submitting, submitted, isValid, set, touch, validate, reset };
}
