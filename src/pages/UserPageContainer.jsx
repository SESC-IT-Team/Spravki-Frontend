import { useEffect, useState } from "react"
import { certificateConfigs } from "./configs"
/* URL API сервера, можно менять в .env файле \*/
const API_URL = import.meta.env.VITE_API_URL;

/* Основаня инфа о справках */

/* Словарь значение справки в API : ее название */
const certificateTypeMap = Object.fromEntries(
  certificateConfigs.map((certificate) => [certificate.apiType, certificate.label]),
)

/* Словарь название справки : запрашиваемые данные */

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
function Order({ OrderType, time, status }) {
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
  async function postRequest() {
      try {
        
        await fetch(`${API_URL}/create_order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            certificate_type: orderApiTypeByLabel[current],
            data: formData,
          })
        })
      } catch (error) {
        console.error("Ошибка при отправке заявки:", error)
      }
  }
  postRequest()

}
/* Экспортируем, чтобы в детях можно было использовать*/
export { Order, certificateConfigs }

export default function UserPageContainer({children, title, department}) {
  const [ current, setCurrent ] = useState(certificateConfigs.find(certificate => certificate.department === department)?.label ?? "")
  const [ orders, setOrders ] = useState([])

  /* Получение списка заявок */
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`${API_URL}/get_my_orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
  }, [])

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-base-content sm:text-4xl">{title}</h1>
        </div>

        <div className="card border border-primary/20 bg-base-100 shadow-xl">
          {/* Отрисовка контента */}
          {typeof children === "function"
            ? children({ current, setCurrent, orders, sendRequest, department })
            : children}
        </div>
      </div>
    </div>
  )
}
