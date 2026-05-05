import { Order, FormOrder, certificateConfigs } from "./UserPageContainer"

export function CertificateForm({current, setCurrent, orders, sendRequest, department}) {
  /* Словарь название справки : ее поля + фильтрация по департменту */
  const orderFieldsByLabel = Object.fromEntries(
    certificateConfigs.filter(certificate => certificate.department === department)
    .map((certificate) => [certificate.label, certificate.fields]),
  )
  return (
      <div className="card-body">
          <div className="rounded-box bg-primary/10 p-4">
            <p className="text-sm leading-relaxed">
              Выберите нужный тип и отправьте заявку. Когда документ будет готов, статус автоматически
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
          <button className="btn btn-primary" onClick = {() => sendRequest(current)}>
            Заказать
          </button>

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
            {orders.map((order) => (
              <Order
                OrderType={order.OrderType}
                time={order.time}
                status={order.status}
              />
            ))}
          </ul>

        </div>
  )
}

export function HostelForm({current, setCurrent, orders, sendRequest}) {
  /* Словарь название справки : ее поля + фильтрация по департменту */
  const orderFieldsByLabel = Object.fromEntries(
    certificateConfigs.filter(certificate => certificate.department === 'hostel')
    .map((certificate) => [certificate.label, certificate.fields]),
  )
  return (
      <div className="card-body">
          {/* Поле для выбора типа справки */}
          { setCurrent("Общежитие") }

          <FormOrder OrderType={current}/>

          {/* Кнопка заказа справки */}
          <button className="btn btn-primary" onClick = {() => sendRequest(current)}>
            Отправить заявку
          </button>

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
            {orders.map((order) => (
              <Order
                OrderType={order.OrderType}
                time={order.time}
                status={order.status}
              />
            ))}
          </ul>

        </div>
  )
}