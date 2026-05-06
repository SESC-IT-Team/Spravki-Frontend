import { useEffect, useState } from "react"

/* URL API сервера, можно менять в .env файле \*/
const API_URL = import.meta.env.VITE_API_URL;

/* Основаня инфа о справках */
const certificateConfigs = [
  { apiType: "standard", label: "Стандартная", department: "educational", fields: [] },
  { apiType: "militaryregistration", label: "Для военкомата", department: "educational", fields: [] },
  { apiType: "tax", label: "Для налоговой инспекции", department: "educational", fields: [] },
  { apiType: "socialfoundation", label: "Для социального фонда", department: "educational", fields: [] },
  { apiType: "certificate", label: "Копия аттестата", department: "CSD", fields: [] },
  { apiType: "extraditiondocuments", label: "Документы о выдаче", department: "CSD", fields: [] },
  { apiType: "hostel", label: "Общежитие", department: "hostel", fields: ["ФИО Родителя", "ФИО Ученика","Цель"] },
]

/* Словарь значение справки в API : ее название */
const certificateTypeMap = Object.fromEntries(
  certificateConfigs.map((certificate) => [certificate.apiType, certificate.label]),
)

/* Словарь название справки : запрашиваемые данные */
const orderFieldsByLabel = Object.fromEntries(
  certificateConfigs.map((certificate) => [certificate.label, certificate.fields]),
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

function FormOrder({ OrderType }) {
  return (
    <>
      {/* Поле для ввода данных для справки */}
      {(orderFieldsByLabel[OrderType] ?? []).length > 0 && (
        <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
          <div className="mb-2 text-xs font-semibold uppercase opacity-70">Данные для справки</div>
          {(orderFieldsByLabel[OrderType] ?? []).map((fieldLabel, idx) => (
            <input
              key={fieldLabel}
              className={`input w-full${idx !== 0 ? " mt-2" : ""}`}
              type="text"
              placeholder={fieldLabel}
            />
          ))}
    
        </div>
        )
      }
    </>
  )
}
function sendRequest(current) {
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
          })
        })
      } catch (error) {
        console.error("Ошибка при отправке заявки:", error)
      }
  }
  postRequest()

}
/* Экспортируем, чтобы в детях можно было использовать*/
export { orderFieldsByLabel, Order, FormOrder, formatOrderDate, certificateConfigs }

export default function UserPageContainer({children, title, department}) {
  const [ current, setCurrent ] = useState("Стандартная")
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
