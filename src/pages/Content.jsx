import { Order } from "./UserPageContainer"
import { useState } from "react"
import { certificateConfigs } from "./configs"

function FormOrder({ OrderType, formData, setFormData, orderFieldsByLabel }) {
  return (
    <>
      {/* Поле для ввода данных для справки */}
      {(orderFieldsByLabel[OrderType] ?? []).length > 0 && (
        <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
          <div className="mb-2 text-xs font-semibold uppercase opacity-70">Введите Данные</div>
          {(orderFieldsByLabel[OrderType] ?? []).map((fieldLabel, idx) => (
            <>
            <input
              key={fieldLabel.key}
              className={`input w-full${idx !== 0 ? " mt-2" : ""}`}
              type={fieldLabel.input_type}
              placeholder={fieldLabel.formLabel}
              value={formData[fieldLabel.key] || ""}
              onChange={(e) => setFormData((prevData) => ({...prevData, [fieldLabel.key]: e.target.value}))}
            />
            {fieldLabel.input_type === "datetime-local" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs opacity-70">{fieldLabel.formLabel}</label>
              </div>
            )}
            </>
          ))}
    
        </div>
        )
      }
    </>
  )
}

/* Компонент кнопки заказа справки */
function SendButton({ onClick, disabled }) {
  return (
    <button className="btn btn-primary w-full" disabled={disabled} onClick={onClick}>
      Заказать
    </button>
  );
}

/* Валидация данных формы */
function isDataValid(formData, orderFieldsByLabel, current) {
  const currField = orderFieldsByLabel[current]?.every(form => {
    if (form.key in formData) {
      return formData[form.key] !== ""
    }
    return false;
  })
  return currField ?? true
}

export function CertificateForm({current, setCurrent, orders, sendRequest, department, isHostel, title}) {
  /* Словарь название справки : ее поля + фильтрация по департменту */
  const orderFieldsByLabel = Object.fromEntries(
    certificateConfigs.filter(certificate => certificate.department === department)
    .map((certificate) => [certificate.label, certificate.fields]),
  );
  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null) // null | 'success' | 'error'
  const [isSending, setIsSending] = useState(false)

  async function handleSend() {
    setSubmitStatus(null)
    setIsSending(true)
    const ok = await sendRequest(current, formData)
    setIsSending(false)
    if (ok) {
      setSubmitStatus('success')
      setFormData({})
    } else {
      setSubmitStatus('error')
    }
  }
  return (
    <div className="card-body">
      <div className="mb-4 text-center">
        <h1 className={`font-bold sm:text-4xl text-primary`}> {title} </h1>
      </div>
      <div className="rounded-box bg-primary/10 p-4">
        <p className="text-sm leading-relaxed">
          Выберите нужный тип и отправьте заявку. Когда документ будет готов, статус автоматически
          обновится.
        </p>
      </div>

      {!isHostel ? (
        <>
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
        </>
      ) : (
        <></>
      )}
      
      

      <FormOrder OrderType={current} formData={formData} setFormData={setFormData} orderFieldsByLabel={orderFieldsByLabel} />

      {/* Кнопка заказа справки */}
      <div className="mt-3">
        <SendButton onClick={handleSend} disabled={!isDataValid(formData, orderFieldsByLabel, current) || isSending} />
        {submitStatus === 'success' && (
          <div className="mt-2 text-sm text-primary">Заявка успешно отправлена</div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-2 text-sm text-error">Ошибка при отправке заявки</div>
        )}
      </div>
      

      <div className="divider my-1" />
      
      {/* Заголовок и количество заявок */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Мои заявки</h2>
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
        {orders.map((order, idx) => (
          <Order
            key={order.id ?? idx}
            className="animate-list-item"
            style={{ animationDelay: `${idx * 60}ms` }}
            OrderType={certificateConfigs.find(certificate => certificate.apiType === order.OrderType)?.label ?? order.OrderType}
            time={order.time}
            status={order.status}
          />
        ))}
      </ul>

    </div>
  )
}