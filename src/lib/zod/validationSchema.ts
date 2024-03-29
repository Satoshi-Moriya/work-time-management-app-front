import { z } from "zod";

import { convertTimeToSeconds } from "../../features/RecordItemLog/functions/convertTimeToSeconds";
import { TimeRange } from "../../features/RecordItemLog/types";

export const changeEmailValidationSchema = z.object({
  password: z
  .string()
  .nonempty("パスワードは必須です。"),
  email: z
  .string()
  .nonempty("メールアドレスは必須です。")
  .email("メールアドレスが正しい形式ではありません。")
});

export const changePasswordValidationSchema = z.object({
  currentPassword: z
  .string()
  .nonempty("現在のパスワードは必須です。"),
  newPassword: z
  .string()
  .nonempty("新しいパスワードは必須です。")
  .min(8, "パスワードは8文字以上で入力してください。")
  .max(16, "パスワードは16文字以下で入力してください")
  .regex(
    /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,16}$/i,
    "パスワードは半角英数字混合で入力してください"
  ),
  confirmNewPassword: z
  .string()
  .nonempty("新しいパスワード（確認）は必須です。")
})
.superRefine(({ currentPassword, newPassword, confirmNewPassword }, ctx) => {
  if (newPassword !== confirmNewPassword) {
    ctx.addIssue({
      path: ["confirmNewPassword"],
      code: "custom",
      message: "パスワードが一致しません",
    });
  }
  if (currentPassword === newPassword) {
    ctx.addIssue({
      path: ["newPassword"],
      code: "custom",
      message: "現在のパスワードと同じです",
    });
  }
});

export const loginValidationSchema = z.object({
  email: z
  .string()
  .nonempty("メールアドレスは必須です。"),
  password: z
  .string()
  .nonempty("パスワードは必須です。"),
});

export const signUpValidationSchema = z.object({
  email: z
  .string()
  .nonempty("メールアドレスは必須です。")
  .email("メールアドレスが正しい形式ではありません。"),
  password: z
  .string()
  .nonempty("パスワードは必須です。")
  .min(8, "パスワードは8文字以上で入力してください。")
  .max(16, "パスワードは16文字以下で入力してください")
  .regex(
    /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,16}$/i,
    "パスワードは半角英数字混合で入力してください"
  ),
  confirmPassword: z
  .string()
  .nonempty("パスワード（確認）は必須です。")
})
.superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      code: "custom",
      message: "パスワードが一致しません",
    });
  }
});

export const createRegisterRecordItemLogValidationSchema =
  (recordItemLogTime: TimeRange[]) => z.object({
    editStartTime: z
      .string()
      .nonempty("開始時間は必須です。"),
    editEndTime: z
      .string()
      .nonempty("終了時間は必須です。")
})
.superRefine(({editStartTime, editEndTime}, ctx) => {
  const convertToSecondsEditStartTime = convertTimeToSeconds(editStartTime);
  const convertToSecondsEditEndTime = convertTimeToSeconds(editEndTime);

  recordItemLogTime.forEach((logTime) => {
    if (convertToSecondsEditStartTime >= logTime.start &&
       convertToSecondsEditStartTime < logTime.end)
    {
      ctx.addIssue({
        path: ["editStartTime"],
        code: "custom",
        message: "その開始時間は既に登録されています。",
      });
    }

    if (
      convertToSecondsEditEndTime > logTime.start &&
      convertToSecondsEditEndTime <= logTime.end)
    {
      ctx.addIssue({
        path: ["editEndTime"],
        code: "custom",
        message: "その終了時間は既に登録されています。",
      });
    }
  });

  if (convertToSecondsEditEndTime <= convertToSecondsEditStartTime) {
    ctx.addIssue({
      path: ["editEndTime"],
      code: "custom",
      message: "終了時間は開始時間より遅い時間を入力してください。",
    });
  }
});