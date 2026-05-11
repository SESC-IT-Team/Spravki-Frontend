import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const testData = [
{id:2, created_at:"23.02 15:44",full_name:"Иван Петренко", leaving_time:"26.02 05:00", returning_time: "28.02 23:00"},
{id:1, created_at:"24.02 14:00",full_name:"Петр Иванов", leaving_time:"28.02 15:30", returning_time: "30.03 23:00"}
];

/* Шапки таблиц для разных отделов */
const tableHeaders = {
  "Educational": ["id", "Подано", "Учащийся", "Класс", "Тип"],
  "CSD" : ["id", "Подано", "Учащийся", "Класс", "Тип", "Контакные данные", "Справка?"],
  "hostel": ["id", "Подано", "Учащийся", "Выход", "Возвращение"],
}
/* Заголовки для таблиц разных отделов */
const mainHeaders = {
  "Educational": "Заявки на справки в учебный отдел",
  "CSD" : "Заявки в ОКО",
  "hostel": "Заявки на выход из общежития"
}

/* Словарь шапка : апи */
const fieldMap = {
  "id": "id",
  "Подано": "created_at",
  "Учащийся" : "full_name",
  "Класс": "class",
  "Тип": "certificate_type",
  "Контакные данные": "contact_info",
  "Справка?": "certificate_ready",
  "Выход": "leaving_time",
  "Возвращение": "returning_time"
}

/* Таблица для отображения заявок */
function AdminTable({ data, department }) {
  return (
    <div className="table">
      {/* head */}
      <thead>
        <tr>
          {tableHeaders[department]?.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>

      {/* body */}
      <tbody>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((req) => (
            <tr key={req.id}>
              {tableHeaders[department]?.map((header) => (
                <td key={`td-${req.id}-${header}`}>{req[fieldMap[header]]}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={tableHeaders[department]?.length} className="text-center py-4">
              Нет заявок
            </td>
          </tr>
        )}
      </tbody>
    </div>

  )
}

export default function AdminPage({ department }) {
  const [ data, setData ] = useState([])
  
  /* Получение списка заявок */
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_URL}/get_orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {filter: "date_asc"},
            department: { department: department }
          }),
        })

        const fetched_data = await response.json()
        setData(fetched_data)

      } catch (error) {
        console.error("Ошибка получения данных:", error)
      }

    }          
    fetchData();
  }, [])

return (
  <div className="min-h-screen bg-base-200 px-4 py-8 sm:px-6">
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-base-content sm:text-4xl">{mainHeaders[department]}</h1>
      </div>
      <div className="card border border-primary/20 bg-base-100 shadow-xl">
        <div className="card-body">
          <AdminTable data={data} department={department}/>
        </div>
      </div>
    </div>
  </div>
)
}