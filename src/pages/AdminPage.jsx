import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import Cookies from "js-cookie";
import { certificateConfigs } from "./configs";

const API_URL = import.meta.env.VITE_SPRAVKI_API_URL;
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const AUTH_FRONTEND_URL = import.meta.env.VITE_AUTH_FRONTEND_URL;

const testData = [
  {id:2, created_at:"23.02 15:44",full_name:"Иван Петренко", class:"10A", certificate_type: certificateConfigs[1].label, leaving_time:"26.02 05:00", returning_time: "28.02 23:00"},
  {id:1, created_at:"24.02 14:00",full_name:"Петр Иванов", class:"11B", certificate_type: certificateConfigs[3].label, leaving_time:"28.02 15:30", returning_time: "30.03 23:00"}
];

/* Шапки таблиц для разных отделов */
const tableHeaders = {
  "educational_department": ["id", "Подано", "Учащийся", "Класс", "Тип", "Справка"],
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
/* Таблица для отображения заявок */
function AdminTable({ data, department }) {
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
          {Array.isArray(data) && data.length > 0 ? (
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
                      <Link className="btn btn-outline btn-sm btn-primary" to={req.url}>Скачать</Link>
                    ) : (req[fieldMap[header]])}
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
  
  useEffect(() => {
    const token = Cookies.get("accessToken")
    if (!token) {
      const from = encodeURIComponent(window.location.href)
      window.location.replace(`${AUTH_FRONTEND_URL}/?from=${from}`)
    }
  }, [])

  useEffect(() => {
    async function fetchData(retried = false) {
      try {
        const token = Cookies.get("accessToken")
        const headers = { "Content-Type": "application/json" }
        if (token) headers["Authorization"] = `Bearer ${token}`

        const response = await fetch(`${API_URL}/get_orders`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({
            filter: "date_asc",
            department: department
          }),
        })

        if (response.ok) {
          const fetched_data = await response.json()
          setData(fetched_data)
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
                    return fetchData(true)
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
          console.error("Ошибка получения данных, status:", response.status)
          setData(testData)
        }

      } catch (error) {
        console.error("Ошибка получения данных:", error)
        setData(testData)
      }
    }

    fetchData()
  }, [department])

return (
  <div className="min-h-screen bg-base-200 px-4 py-8 sm:px-6">
    <div className="mx-auto w-full max-w-4xl">
      <div className="card border border-primary/20 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">{mainHeaders[department]}</h1>
          </div>
          <AdminTable data={data} department={department}/>
        </div>
      </div>
    </div>
  </div>
)
}