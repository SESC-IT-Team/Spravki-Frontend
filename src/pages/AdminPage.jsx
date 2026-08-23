import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogoutButton, useAuth, useAuthFetch } from "auth-lib";
import { certificateConfigs } from "./configs";
import { API_BASE } from "../auth/authConfig";

/* ФУНКЦИЯ ИЗ ДРУГОГО ФАЙЛА, НАДО СДЕЛАТЬ ЕЕ ИМПОРТ */
function formatOrderDate(dateRaw) {
  const date = new Date(dateRaw)

  const datePart = date.toLocaleDateString("ru-RU")
  const timePart = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })

  return `${datePart} — ${timePart}`
}

/* Шапки таблиц для разных отделов */
const tableHeaders = {
  "educational_department": ["id", "Подано", "Учащийся", "Тип", "Справка"],
  "competitive_selection_department" : ["id", "Подано", "Учащийся", "Класс", "Тип", "Контакные данные", "Справка"],
  "dormitory": ["id", "Подано", "Учащийся", "Выход", "Возвращение", "Справка"],
}
/* Заголовки для таблиц разных отделов */
const mainHeaders = {
  "educational_department": "Заявки на справки в учебный отдел",
  "competitive_selection_department" : "Заявки в ОКО",
  "dormitory": "Заявки на выход из общежития"
}

/* Словарь шапка : апи */
const fieldMap = {
  "id": "id",
  "number": "number",
  "Подано": "created_at",
  "Учащийся" : "full_name",
  "Класс": "class",
  "Тип": "certificate_type",
  "Контакные данные": "contact_info",
  "Справка": "needs_certificate",
  "Выход": "leaving_time",
  "Возвращение": "returning_time"
}

/* Таблица для отображения заявок */
function AdminTable({ data, department, ordersLoading }) {

  /* Функция для запроса при скачивании справки */
  async function sendDownloadRequest(orderId) {
    try {
      await fetch(`${API_BASE}/download`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
    } catch (error) {
      console.error("Ошибка при отправке запроса на скачивание:", error);
    }
  }

  return (
    <div className="overflow-x-auto w-full rounded-t-2xl border border-base-300">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr className="bg-primary">
            {tableHeaders[department]?.map((header, index) => (
              <th
                key={header}
                className={`
                  text-white
                  ${index === 0 ? "rounded-tl-2xl" : ""}
                  ${index === tableHeaders[department].length - 1 ? "rounded-tr-2xl" : ""}
                  whitespace-nowrap
                `}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* body */}
        <tbody>
          {ordersLoading ? (
            <tr>
              <td colSpan={tableHeaders[department]?.length} className="py-6 text-center">
                <span className="loading loading-spinner loading-md text-primary" />
              </td>
            </tr>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((req, idx) => (
              <tr key={req.id} className="animate-list-item" style={{ animationDelay: `${idx * 60}ms` }}>
                {tableHeaders[department]?.map((header) => (
                  <td
                    className={`
                      font-${fieldMap[header] === "id" ? "bold" : "normal"}
                      whitespace-nowrap
                    `}
                    key={`td-${req.id}-${header}`}
                  >
                    {fieldMap[header] === "needs_certificate" ? (
                      <Link className="btn btn-outline btn-sm btn-primary" to={req.link} onClick={() => sendDownloadRequest(req.id)}>
                        Скачать
                      </Link>
                    ) : (header !== "Тип" ? (header === "Подано" ? formatOrderDate(req[fieldMap[header]]) : req[fieldMap[header === "id" ? "number" : header]]) : certificateConfigs.find(certificate => certificate.apiType === req.certificate_type)?.label ?? req.certificate_type)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableHeaders[department]?.length}
                className="text-center py-4"
              >
                Нет заявок
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminPage({ department }) {
  const [ data, setData ] = useState([])
  const [ ordersLoading, setOrdersLoading ] = useState(true)
  const authFetch = useAuthFetch()
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const currentUrl = `${location.pathname}${location.search}${location.hash}`

  useEffect(() => {
    async function fetchData() {
      setOrdersLoading(true)

      try {
        const response = await authFetch(`${API_BASE}/orders?department=${department}&filter=date_desc`, {
          method: "GET",
        })

        if (response.ok) {
          const fetched_data = await response.json()
          setData(fetched_data)
        } else if (response.status === 401) {
          await logout()
          navigate(currentUrl)
        } else {
          console.error("Ошибка получения данных, status:", response.status);
        }

      } catch (error) {
        console.error("Ошибка получения данных:", error);
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchData()
  }, [department, authFetch, logout, navigate])

return (
  <div className="min-h-screen bg-base-200 px-4 py-8 sm:px-6">
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex justify-end mb-2">
        <LogoutButton className="btn btn-soft btn-error" redirectTo={currentUrl}>Выйти</LogoutButton>
      </div>
      <div className="card border border-primary/20 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">{mainHeaders[department]}</h1>
          </div>
          <AdminTable data={data} department={department} ordersLoading={ordersLoading}/>
        </div>
      </div>
    </div>
  </div>
)
}
