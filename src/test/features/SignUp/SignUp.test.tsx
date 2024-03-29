import { render, renderHook, screen, act, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";

import { signUpValidationSchema } from "../../../lib/zod/validationSchema";
import { routesConfig } from "../../../pages/Router";

const router = createMemoryRouter(routesConfig, { initialEntries: ["/signup"] });

const server = setupServer(
  rest.post("http://localhost:8080/auth/signup", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json(
        {
          message: "アカウント登録が完了しました"
        }
      )
    );
  }),

  rest.post("http://localhost:8080/csrf", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: "testToken"
      })
    );
  })
);

describe("SingUpページの単体テスト", () => {
  test("初期状態で送信ボタンは非活性", () => {
    render(<RouterProvider router={router} />);
    const submitButtonEl = screen.getByRole("button", { name: "送信" });
    expect(submitButtonEl).toBeDisabled();
  });

  test("メールアドレスとパスワードとパスワード（確認）を入力すると送信ボタンが活性化する", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const emailInputEl = screen.getByPlaceholderText("メールアドレス");
    const passwordInputEl = screen.getByPlaceholderText("パスワード");
    const confirmPasswordInputEl =
      screen.getByPlaceholderText("パスワード（確認）");
    const submitButtonEl = screen.getByRole("button", { name: "送信" });

    await act(async () => {
      await user.type(emailInputEl, "test@test.com");
      await user.type(passwordInputEl, "test1234");
      await user.type(confirmPasswordInputEl, "test1234");
    });

    expect(submitButtonEl).toBeEnabled();
  });

  test("メールアドレスとパスワードとパスワード（確認）を入力後メールアドレスを削除した場合送信ボタンが非活性化する", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const emailInputEl = screen.getByPlaceholderText("メールアドレス");
    const passwordInputEl = screen.getByPlaceholderText("パスワード");
    const confirmPasswordInputEl =
      screen.getByPlaceholderText("パスワード（確認）");
    const submitButtonEl = screen.getByRole("button", { name: "送信" });

    await act(async () => {
      user.type(emailInputEl, "test@test.com");
      user.type(passwordInputEl, "test1234");
      user.type(confirmPasswordInputEl, "test1234");
    });
    user.clear(emailInputEl);

    await waitFor(() => expect(submitButtonEl).toBeDisabled());
  });

  test("メールアドレスとパスワードとパスワード（確認）を入力後パスワードを削除した場合送信ボタンが非活性化する", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const emailInputEl = screen.getByPlaceholderText("メールアドレス");
    const passwordInputEl = screen.getByPlaceholderText("パスワード");
    const confirmPasswordInputEl =
      screen.getByPlaceholderText("パスワード（確認）");
    const submitButtonEl = screen.getByRole("button", { name: "送信" });

    await act(async () => {
      user.type(emailInputEl, "test@test.com");
      user.type(passwordInputEl, "test1234");
      user.type(confirmPasswordInputEl, "test1234");
    });
    user.clear(passwordInputEl);

    await waitFor(() => expect(submitButtonEl).toBeDisabled());
  });

  test("メールアドレスとパスワードとパスワード（確認）を入力後パスワード（確認）を削除した場合送信ボタンが非活性化する", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const emailInputEl = screen.getByPlaceholderText("メールアドレス");
    const passwordInputEl = screen.getByPlaceholderText("パスワード");
    const confirmPasswordInputEl =
      screen.getByPlaceholderText("パスワード（確認）");
    const submitButtonEl = screen.getByRole("button", { name: "送信" });

    await act(async () => {
      user.type(emailInputEl, "test@test.com");
      user.type(passwordInputEl, "test1234");
      user.type(confirmPasswordInputEl, "test1234");
    });
    user.clear(confirmPasswordInputEl);

    await waitFor(() => expect(submitButtonEl).toBeDisabled());
  });

  test("正しい値が送信される", () => {
    const { result } = renderHook(() =>
      useForm({
        resolver: zodResolver(signUpValidationSchema),
      })
    );

    const { setValue, handleSubmit } = result.current;

    setValue("email", "test@test.com");
    setValue("password", "test1234");
    setValue("confirmPassword", "test1234");

    handleSubmit((data) => {
      expect(data.email).toBe("test@test.com");
      expect(data.password).toBe("test1234");
      expect(data.confirmPassword).toBe("test1234");
    })();
  });

  describe("メールアドレスのバリデーションチェック", () => {
    test("必須のバリデーションチェック", async () => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const emailInputEl = screen.getByPlaceholderText("メールアドレス");

      // ToDo ここをactで囲まなければいけない理由がいまいちわからない
      await act(async () => {
        await user.type(emailInputEl, "email@test.com");
      });
      user.clear(emailInputEl);

      const expectedEmailEmptyErrorMessage = await screen.findByText("メールアドレスは必須です。");
      expect(expectedEmailEmptyErrorMessage).toBeInTheDocument();
    });

    test("形式のバリデーションチェック", async () => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const emailInputEl = screen.getByPlaceholderText("メールアドレス");

      user.type(emailInputEl, "email");

      const expectedEmailFormatErrorMessage = await screen.findByText("メールアドレスが正しい形式ではありません。");
      expect(expectedEmailFormatErrorMessage).toBeInTheDocument();
    });
  });

  describe("パスワードのバリデーションチェック", () => {
    test("必須のバリデーションチェック", async () => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const passwordInputEl = screen.getByPlaceholderText("パスワード");

      // ToDo ここをactで囲まなければいけない理由がいまいちわからない
      await act(async () => {
        await user.type(passwordInputEl, "test1234");
      });
      user.clear(passwordInputEl);

      const expectedPasswordEmptyErrorMessage = await screen.findByText("パスワードは必須です。");
      expect(expectedPasswordEmptyErrorMessage).toBeInTheDocument();
    });

    test("最低文字数のバリデーションチェック", async () => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const passwordInputEl = screen.getByPlaceholderText("パスワード");

      user.type(passwordInputEl, "test123");

      const expectedPasswordMinErrorMessage = await screen.findByText("パスワードは8文字以上で入力してください。");
      expect(expectedPasswordMinErrorMessage).toBeInTheDocument();

      // ToDo ここをactで囲まなければいけない理由がいまいちわからない
      await act(async () => {
        await user.clear(passwordInputEl);
        await user.type(passwordInputEl, "test1234");
      });

      expect(expectedPasswordMinErrorMessage).not.toBe("パスワードは8文字以上で入力してください。");
    });

    test("最高文字数のバリデーションチェック", async () => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const passwordInputEl = screen.getByPlaceholderText("パスワード");

      user.type(passwordInputEl, "test1234test1234t");

      const expectedPasswordMaxErrorMessage = await screen.findByText("パスワードは16文字以下で入力してください");
      expect(expectedPasswordMaxErrorMessage).toBeInTheDocument();

      // ToDo ここをactで囲まなければいけない理由がいまいちわからない
      await act(async () => {
        await user.clear(passwordInputEl);
        await user.type(passwordInputEl, "test1234test1234");
      });

      expect(expectedPasswordMaxErrorMessage).not.toBe("パスワードは16文字以下で入力してください");
    });

    test("半角英数字混合のバリデーションチェック", async () => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const passwordInputEl = screen.getByPlaceholderText("パスワード");

      user.type(passwordInputEl, "testtest");

      const expectedPasswordHalfWidthAlphanumericErrorMessage = await screen.findByText("パスワードは半角英数字混合で入力してください");
      expect(expectedPasswordHalfWidthAlphanumericErrorMessage).toBeInTheDocument();

      // ToDo ここをactで囲まなければいけない理由がいまいちわからない
      await act(async () => {
        await user.clear(passwordInputEl);
        await user.type(passwordInputEl, "test1234");
      });

      expect(expectedPasswordHalfWidthAlphanumericErrorMessage).not.toBe("パスワードは半角英数字混合で入力してください");
    });
  });

  test("パスワード（確認）のバリデーションチェック", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const confirmPasswordInputEl =
      screen.getByPlaceholderText("パスワード（確認）");

    // ToDo ここをactで囲まなければいけない理由がいまいちわからない
    await act(async () => {
      await user.type(confirmPasswordInputEl, "test");
      user.clear(confirmPasswordInputEl);
    });

    const expectedPasswordEmptyErrorMessageEl = await screen.findByText("パスワード（確認）は必須です。");
    expect(expectedPasswordEmptyErrorMessageEl).toBeInTheDocument();
  });

  test("パスワードとパスワード（確認）の一致チェック", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const passwordInputEl = screen.getByPlaceholderText("パスワード");
    const confirmPasswordInputEl =
      screen.getByPlaceholderText("パスワード（確認）");

    user.type(passwordInputEl, "test1234");
    user.type(confirmPasswordInputEl, "test123");

    const expectedPasswordNotMatchErrorMessage = await screen.findByText("パスワードが一致しません");
    expect(expectedPasswordNotMatchErrorMessage).toBeInTheDocument();

    // ToDo ここをactで囲まなければいけない理由がいまいちわからない
    await act(async () => {
      await user.clear(confirmPasswordInputEl);
      await user.type(confirmPasswordInputEl, "test1234");
    });

    expect(expectedPasswordNotMatchErrorMessage).not.toBe("パスワードが一致しません");
  });

  describe("api通信のテスト", () => {
    beforeAll(() => {
      server.listen();
    });

    afterEach(() => {
      server.resetHandlers();
    });

    afterAll(() => server.close());

    test.skip("ユーザーの登録ができた場合", async () => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const emailInputEl = screen.getByPlaceholderText("メールアドレス");
      const passwordInputEl = screen.getByPlaceholderText("パスワード");
      const confirmPasswordInputEl =
        screen.getByPlaceholderText("パスワード（確認）");
      const submitButtonEl = screen.getByRole("button", { name: "送信" });

      await user.type(emailInputEl, "test@test.com");
      await user.type(passwordInputEl, "test12345");
      await user.type(confirmPasswordInputEl, "test12345");
      await user.click(submitButtonEl);

      const targetPageText = await screen.findByText("登録完了");
      expect(targetPageText).toBeInTheDocument();

      // 次のテストのためにユーザー登録画面に戻る
      const loginPageBackEl = screen.getByText("ログインページへ戻る");
      await user.click(loginPageBackEl);
      const signupPageForwardEl = await screen.findByText("アカウントをお持ちでない場合");
      await user.click(signupPageForwardEl);
    });

    test.skip("ユーザー登録に失敗した場合", async () => {
      server.use(
        rest.post("http://localhost:8080/auth/signup", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json(
              {
                message: "登録に失敗しました。少し時間を置いてから、もう一度お試しください。"
              }
            )
          );
        })
      );
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const emailInputEl = screen.getByPlaceholderText("メールアドレス");
      const passwordInputEl = screen.getByPlaceholderText("パスワード");
      const confirmPasswordInputEl = screen.getByPlaceholderText("パスワード（確認）");
      const submitButtonEl = screen.getByRole("button", { name: "送信" });

      await user.type(emailInputEl, "test@test.com");
      await user.type(passwordInputEl, "test12345");
      await user.type(confirmPasswordInputEl, "test12345");
      await user.click(submitButtonEl);

      const expectedMessage = await screen.findByText("予期せぬエラーが発生し、ユーザー登録ができませんでした。時間をおいて再度お試しください。");
      expect(expectedMessage).toBeInTheDocument();
    });
  });
});
