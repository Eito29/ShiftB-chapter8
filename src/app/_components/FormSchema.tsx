import {z} from 'zod';

export const formSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(1, "パスワードは必須です")
});