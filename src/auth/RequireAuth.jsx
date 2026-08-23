import { useAuth, LoginButton } from "auth-lib"

export default function RequireAuth({ children }) {
  const { status, error, refresh } = useAuth()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 px-6">
        <p className="text-center text-sm text-error">
          {error?.description ?? error?.message ?? "Ошибка проверки сессии"}
        </p>
        <button className="btn btn-outline btn-primary" onClick={() => void refresh()}>
          Повторить
        </button>
      </div>
    )
  }

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 px-6">
        <p className="text-sm opacity-60">Вы не авторизованы</p>
        <LoginButton />
      </div>
    )
  }

  return children
}
