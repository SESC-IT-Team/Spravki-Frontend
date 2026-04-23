import { useEffect, useState } from "react"

/* Основаня инфа о справках */
const certificateConfigs = [
  { apiType: "standard", label: "Стандартная", fields: [] },
  { apiType: "militaryregistration", label: "Для военкомата", fields: [] },
  { apiType: "tax", label: "Для налоговой инспекции", fields: [] },
  { apiType: "socialfoundation", label: "Для социального фонда", fields: [] },
  { apiType: "certificate", label: "Копия аттестата", fields: [] },
  { apiType: "extraditiondocuments", label: "Документы о выдаче", fields: [] },
  { apiType: "hostel", label: "Общежитие", fields: [] },
  { apiType: "test", label: "Тест", fields: ["Тестовое поле 1", "Тестовое поле 2"] },
]

/* Словарь значение справки в API : ее название */
const certificateTypeMap = Object.fromEntries(
  certificateConfigs.map((certificate) => [certificate.apiType, certificate.label]),
)

/* Словарь название справки : ее значение в API */
const orderFieldsByLabel = Object.fromEntries(
  certificateConfigs.map((certificate) => [certificate.label, certificate.fields]),
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
  
export default function UserPage() {
  const [ current, setCurrent ] = useState("Стандартная")
  const [ orders, setOrders ] = useState([])

  /* Получение списка заявок */
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://212.113.98.188/get_my_orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: "educational",
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
          <h1 className="text-3xl font-bold text-base-content sm:text-4xl">Заказ справок</h1>
        </div>

        <div className="card border border-primary/20 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="rounded-box bg-primary/10 p-4">
              <p className="text-sm leading-relaxed">
                Выберите нужный тип справки и отправьте заявку. Когда документ будет готов, статус автоматически
                обновится.
              </p>
            </div>

            {/* Поле для выбора типа справки */}
            <fieldset className="fieldset mt-4">
              <legend className="fieldset-legend text-base font-semibold">Тип справки</legend>
              <select
                value={current}
                onChange={(event) => setCurrent(event.target.value)}
                className="select select-bordered w-full bg-base-100"
              >
                {Object.keys(orderFieldsByLabel).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
            
              </select>
            </fieldset>

            <FormOrder OrderType={current}/>

            {/* Кнопка заказа справки */}
            <button className="btn btn-primary">
              Заказать справку
            </button>

            <div className="divider my-1" />
            
            {/* Заголовок и количество заявок */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Мои справки</h2>
              <span className="badge badge-outline badge-primary">
                {orders.length} {orders.length === 1 
                  ? 'заявка' 
                  : (orders.length > 1 && orders.length < 5 && orders.length % 100 < 10 || orders.length % 100 > 20) && (orders.length % 10 >= 2 && orders.length % 10 <= 4)
                    ? 'заявки' 
                    : 'заявок'}
              </span>
         
            </div>

            {/* Список заявок */}
            <ul className="list rounded-box border border-base-300 bg-base-100 px-4">
              {orders.length === 0 && (
                <li className="py-3 text-sm opacity-60">Заявок пока нет</li>
              )}
              {orders.map((order) => (
                <Order
                  OrderType={order.OrderType}
                  time={order.time}
                  status={order.status}
                />
              ))}
            </ul>

          </div>
        </div>
      </div>
    </div>
  )
}
