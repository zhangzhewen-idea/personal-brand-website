import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./login-page";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock("react-router", async (importOriginal) => {
  const original = await importOriginal<typeof import("react-router")>();
  return { ...original, useNavigate: () => navigate };
});

describe("LoginPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    navigate.mockReset();
  });

  it("提交登录表单后返回首页", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <LoginPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText("邮箱"), {
      target: { value: "creator@example.com" },
    });
    fireEvent.change(screen.getByLabelText("密码"), {
      target: { value: "Password1" },
    });
    fireEvent.submit(screen.getByLabelText("邮箱").closest("form")!);

    expect(navigate).toHaveBeenCalledWith("/");
  });
});
