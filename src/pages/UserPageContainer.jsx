import { useEffect, useState, useCallback } from "react"
import { certificateConfigs } from "./configs"
import Cookies from "js-cookie"
/* URL API сервера, можно менять в .env файле \*/
const SPRAVKI_API_URL = import.meta.env.VITE_SPRAVKI_API_URL;
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const AUTH_FRONTEND_URL = import.meta.env.VITE_AUTH_FRONTEND_URL;

/* Словарь значение справки в API : ее название */
const certificateTypeMap = Object.fromEntries(
  certificateConfigs.map((certificate) => [certificate.apiType, certificate.label]),
)

/* Словарь название справки : ее значение в API */
const orderApiTypeByLabel = Object.fromEntries(
  certificateConfigs.map((certificate) => [certificate.label, certificate.apiType]),
)

/* Форматирование даты справки */
function formatOrderDate(dateRaw) {
  const date = new Date(dateRaw)

  const datePart = date.toLocaleDateString("ru-RU")
  const timePart = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })

  return `${datePart} — ${timePart}`
}

/* Компонент для отображения одной заявки */
export function Order({ OrderType, time, status, className, style }) {
  return (
    <li
      className={["list-row border-base-content/10 flex items-center justify-between gap-3 border-b py-3 last:border-b-0", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <div className="space-y-1">
        <div className="text-sm font-semibold">{OrderType}</div>
        <div className="text-xs opacity-60">{time}</div>
      </div>
      {/* Добавлен класс whitespace-nowrap и shrink-0, чтобы бадж не сжимался */}
      <span className={`badge badge-sm ${status === 1 ? "badge-warning" : "badge-success"} font-semibold whitespace-nowrap shrink-0`}>
        {status === 1 ? "В процессе" : "Готово"}
      </span>
    </li>
  )
}

export default function UserPageContainer({children, title, department}) {
  const [ current, setCurrent ] = useState(certificateConfigs.find(certificate => certificate.department === department)?.label ?? "")
  const [ orders, setOrders ] = useState([])

  const fetchOrders = useCallback(async (retried = false) => {
    try {
      const token = Cookies.get("accessToken")
      const headers = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const response = await fetch(`${SPRAVKI_API_URL}/get_my_orders`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          department: department,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        const normalizedOrders = data.map((order) => {
          const orderTypeKey = String(order.certificate_type ?? "").toLowerCase()

          return {
            id: order.id,
            OrderType: certificateTypeMap[orderTypeKey] ?? order.certificate_type ?? "Неизвестный тип",
            time: formatOrderDate(order.created_at),
            status: order.is_created ? 0 : 1,
          }
        })

        setOrders(normalizedOrders)
      } else if (response.status === 401) {
        const errBody = await response.json().catch(() => ({}))
        if (errBody.detail === "Invalid or expired token.") {
          if (!retried) {
            try {
              const refreshResp = await fetch(`${AUTH_API_URL}/api/v1/auth/refresh`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
              })

              if (refreshResp.ok) {
                const refreshData = await refreshResp.json()
                if (refreshData.access_token) {
                  Cookies.set("accessToken", refreshData.access_token)
                  return fetchOrders(true)
                }
              }
            } catch (refreshError) {
              console.error("Ошибка при попытке обновить токен:", refreshError)
            }
          }
        }

        const from = encodeURIComponent(window.location.href)
        window.location.replace(`${AUTH_FRONTEND_URL}/?from=${from}`)
      } else {
        console.error("Ошибка получения заявок, status:", response.status)
        setOrders([])
      }
    } catch (error) {
      console.error("Ошибка получения заявок:", error)
      setOrders([])
    }
  }, [department])

  useEffect(() => {
    const token = Cookies.get("accessToken")
    if (!token) {
      const from = encodeURIComponent(window.location.href)
      window.location.replace(`${AUTH_FRONTEND_URL}/?from=${from}`)
    }
  }, [])

  /* Получение списка заявок */
  useEffect(() => {
    Promise.resolve().then(fetchOrders)
  }, [fetchOrders])

  /* Отправка заявки и обновление списка */
  async function sendRequest(current, formData, retried = false) {
    const token = Cookies.get("accessToken")

    try {
      const headers = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const resp = await fetch(`${SPRAVKI_API_URL}/create_order`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          certificate_type: orderApiTypeByLabel[current],
          data: formData,
        }),
      })

      if (!resp.ok) {
        if (resp.status === 401) {
          const errBody = await resp.json().catch(() => ({}))
          if (errBody.detail === "Invalid or expired token.") {
            if (!retried) {
              try {
                const refreshResp = await fetch(`${AUTH_API_URL}/api/v1/auth/refresh`, {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                })

                if (refreshResp.ok) {
                  const refreshData = await refreshResp.json()
                  if (refreshData.access_token) {
                    Cookies.set("accessToken", refreshData.access_token)
                    // retry sendRequest once after successful refresh
                    return sendRequest(current, formData, true)
                  }
                }
              } catch (refreshError) {
                console.error("Ошибка при попытке обновить токен:", refreshError)
              }
            }
          }

          const from = encodeURIComponent(window.location.href)
          window.location.replace(`${AUTH_FRONTEND_URL}/?from=${from}`)
          return false
        }

        console.error("Ошибка при отправке заявки, status:", resp.status)
        return false
      }

      await fetchOrders()
      return true
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error)
      return false
    }
  }

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">

        <div className="card border border-primary/20 bg-base-100 shadow-xl">
          {/* Отрисовка контента */}
          {typeof children === "function"
            ? children({ current, setCurrent, orders, sendRequest, department, title })
            : children}
        </div>
      </div>
    </div>
  )
}
