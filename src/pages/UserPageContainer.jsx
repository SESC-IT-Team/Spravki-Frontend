import { useEffect, useState, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LogoutButton, useAuth, useAuthFetch } from "auth-lib"
import { certificateConfigs } from "./configs"
import { API_BASE } from "../auth/authConfig"

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
  const [ ordersLoading, setOrdersLoading ] = useState(true)
  const [ childrenList, setChildrenList ] = useState([])
  const [ selectedChildId, setSelectedChildId ] = useState("")
  const [ childrenLoading, setChildrenLoading ] = useState(false)
  const [ childrenError, setChildrenError ] = useState("")
  const authFetch = useAuthFetch()
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const currentUrl = `${location.pathname}${location.search}${location.hash}`
  const currentCertificateType = orderApiTypeByLabel[current]

  const fetchChildren = useCallback(async () => {
    if (!currentCertificateType) {
      setChildrenList([])
      setSelectedChildId("")
      return
    }

    setChildrenLoading(true)
    setChildrenError("")
    setSelectedChildId("")

    try {
      const params = new URLSearchParams({ certificate_type: currentCertificateType })
      const response = await authFetch(`${API_BASE}/get_children?${params}`, { method: "GET" })

      if (response.ok) {
        const data = await response.json()
        const nextChildren = Array.isArray(data) ? data : []
        setChildrenList(nextChildren)
        const onlyChild = nextChildren.length === 1 ? nextChildren[0] : null
        setSelectedChildId(onlyChild?.child_id ?? onlyChild?.id ?? onlyChild?.uuid ?? "")
      } else if (response.status === 401) {
        await logout()
        navigate(currentUrl)
      } else {
        setChildrenList([])
        setChildrenError("Не удалось загрузить список детей")
      }
    } catch (error) {
      console.error("Ошибка получения списка детей:", error)
      setChildrenList([])
      setChildrenError("Не удалось загрузить список детей")
    } finally {
      setChildrenLoading(false)
    }
  }, [authFetch, currentCertificateType, currentUrl, logout, navigate])

  useEffect(() => {
    Promise.resolve().then(fetchChildren)
  }, [fetchChildren])

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)

    try {
      const response = await authFetch(`${API_BASE}/my_orders?department=${department}`, {
        method: "GET"
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
        await logout()
        navigate(currentUrl)
      } else {
        console.error("Ошибка получения заявок, status:", response.status)
        setOrders([])
      }
    } catch (error) {
      console.error("Ошибка получения заявок:", error)
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }, [department, authFetch, currentUrl, logout, navigate])

  useEffect(() => {
    Promise.resolve().then(fetchOrders)
  }, [fetchOrders])

  /* Отправка заявки и обновление списка */
  async function sendRequest(current, formData) {
    if (!selectedChildId) {
      return false
    }

    try {
      const resp = await authFetch(`${API_BASE}/create_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          child_id: {
            child_id: selectedChildId,
          },
          headers: {
            certificate_type: orderApiTypeByLabel[current]
          },
          data: formData
        }),
      })

      if (!resp.ok) {
        if (resp.status === 401) {
          await logout()
          navigate(currentUrl)
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
        <div className="flex justify-end mb-2">
          <LogoutButton className="btn btn-soft btn-error" redirectTo={currentUrl}>Выйти</LogoutButton>
        </div>
        <div className="card border border-primary/20 bg-base-100 shadow-xl">
          {/* Отрисовка контента */}
          {typeof children === "function"
            ? children({
              current,
              setCurrent,
              orders,
              ordersLoading,
              sendRequest,
              department,
              title,
              children: childrenList,
              selectedChildId,
              setSelectedChildId,
              childrenLoading,
              childrenError,
            })
            : children}
        </div>
      </div>
    </div>
  )
}
