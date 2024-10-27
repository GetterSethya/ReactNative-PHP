import { todoStatus } from "@/constants/app";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is invalid" })
    .email({ message: "Email is invalid" }),

  password: z
    .string({ message: "Passoword is invalid" })
    .min(8, { message: "Password is too short, minimum 8 character" })
    .max(255, { message: "Password is too long" }),
});

export const registerSchema = z
  .object({
    email: z
      .string({ message: "Email is invalid" })
      .email({ message: "Email is invalid" }),
    name: z
      .string({ message: "Name is invalid" })
      .min(1, { message: "Name cant be blank" }),
    password: z
      .string({ message: "Password is invalid" })
      .min(8, { message: "Password is too short, minimum 8 character" })
      .max(255, { message: "Password is too long" }),
    passwordConfirm: z
      .string({ message: "Password confirm is invalid" })
      .min(8, { message: "Password confirm is too short, minimum 8 character" })
      .max(255, { message: "Password confrim is too long" }),
  })
  .refine(
    (data) => {
      if (data.password !== data.passwordConfirm) {
        return false;
      }

      return true;
    },
    { path: ["passwordConfirm"], message: "Password confirm iss invalid" },
  );

export const todoSchema = z.object({
  id: z.coerce.number(),
  todo: z
    .string({ message: "Todo is invalid" })
    .min(1, { message: "Todo cant be blank" }),
  status: z.enum(todoStatus),
  user_id: z.coerce.number(),
});

export const appResponseSchema = z.object({
  message: z.string(),
  data: z.unknown(),
});

export const profileSchema = z.object({
  id: z.coerce.number(),
  email: z
    .string({ message: "Email is invalid" })
    .email({ message: "Email is invalid" }),
  name: z
    .string({ message: "Name is invalid" })
    .min(1, { message: "Name cant be blank" }),
});

export type Profile = z.infer<typeof profileSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type AppResponse = z.infer<typeof appResponseSchema>;
