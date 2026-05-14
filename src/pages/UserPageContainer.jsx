import { useEffect, useState } from "react"
import { certificateConfigs } from "./configs"
import Cookies from "js-cookie"
/* URL API сервера, можно менять в .env файле \*/
const API_URL = import.meta.env.VITE_SPRAVKI_API_URL;

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
export function Order({ OrderType, time, status }) {
  return (
    <li className="list-row border-base-content/10 flex items-center justify-between gap-3 border-b py-3 last:border-b-0">
      <div className="space-y-1">
        <div className="text-sm font-semibold">{OrderType}</div>
        <div className="text-xs opacity-60">{time}</div>
      </div>
      <span className={`badge badge-sm ${status === 1 ? "badge-warning" : "badge-success"} font-semibold`}>
        {status === 1 ? "В процессе" : "Готово"}
      </span>
    </li>
  )
}

function sendRequest(current, formData) {
  /* Отправка заявки на справку */
  const token = Cookies.get("accessToken")

  async function postRequest() {
    try {
      const headers = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`

      await fetch(`${API_URL}/create_order`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          certificate_type: orderApiTypeByLabel[current],
          data: formData,
        }),
      })
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error)
    }
  }

  postRequest()

}

export default function UserPageContainer({children, title, department}) {
  const [ current, setCurrent ] = useState(certificateConfigs.find(certificate => certificate.department === department)?.label ?? "")
  const [ orders, setOrders ] = useState([])

  /* Redirect to auth if no accessToken cookie found */
  useEffect(() => {
    const token = Cookies.get("accessToken")
    if (!token) {
      const from = encodeURIComponent(window.location.href)
      window.location.href = `http://localhost:4001/?from=${from}`
    }
  }, [])

  /* Получение списка заявок */
  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = Cookies.get("accessToken")
        const headers = { "Content-Type": "application/json" }
        if (token) headers["Authorization"] = `Bearer ${token}`

        const response = await fetch(`${API_URL}/get_my_orders`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({
            department: department,
          }),
        })

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
      } catch (error) {
        console.error("Ошибка получения заявок:", error)
        setOrders([])
      }
    }

    fetchOrders()
  }, [department])

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
