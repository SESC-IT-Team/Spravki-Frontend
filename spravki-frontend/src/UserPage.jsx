import { useState } from 'react'

function Certificate({ certificateType, time, status }) {
    return (
      <li className="list-row border-base-content/10 flex items-center justify-between gap-3 border-b py-3 last:border-b-0">
        <div className="space-y-1">
          <div className="text-sm font-semibold">{certificateType}</div>
          <div className="text-xs opacity-60">{time}</div>
        </div>
        <span className={`badge badge-sm ${status === 1 ? "badge-warning" : "badge-success"} font-semibold`}>
          {status === 1 ? "В процессе" : "Готово"}
        </span>
      </li>
    )
  }
  
  export default function UserPage() {
    const [ current, setCurrent ] = useState("Стандартная")

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
                  <option>Стандартная</option>
                  <option>Для военкомата</option>
                  <option>Для налоговой инспекции</option>
                  <option>Для социального фонда</option>
                  <option>Тест</option>
                </select>
              </fieldset>

              {/* Поле для ввода данных для справки */}
              {current === "Тест" && (
                <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase opacity-70">Данные для справки</div>
                  <input className="input w-full" type="text" placeholder='Тестовое поле 1'/>
                  <input className="input w-full mt-2" type="text" placeholder='Тестовое поле 2'/>
                </div>
                )
              }
  
              {/* Кнопка заказа справки */}
              <button className="btn btn-primary">
                Заказать справку
              </button>

              <div className="divider my-1" />
              
              {/* Заголовок и количество заявок */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Мои справки</h2>
                <span className="badge badge-outline badge-primary">4 заявки</span>
              </div>

              {/* Список заявок */}
              <ul className="list rounded-box border border-base-300 bg-base-100 px-4">
                <Certificate certificateType={"Стандартная"} time={"00.00.0000 — 00:00"} status={1}/>
                <Certificate certificateType={"Для военкомата"} time={"00.00.0000 — 00:00"} status={1}/>
                <Certificate certificateType={"Для налоговой инспекции"} time={"00.00.0000 — 00:00"} status={2}/>
                <Certificate certificateType={"Для социального фонда"} time={"00.00.0000 — 00:00"} status={2}/>
              </ul>
  
            </div>
          </div>
        </div>
      </div>
    )
  }
  