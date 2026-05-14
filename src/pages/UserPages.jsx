import UserPageContainer from "./UserPageContainer";
import {CertificateForm} from "./Content";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

export function EducationalPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Учебный отдел" department="educational">
      {({ current, setCurrent, orders, sendRequest, department }) => (
        <CertificateForm current={current} setCurrent={setCurrent}
        orders={orders} sendRequest={sendRequest} department={department}/>
      )}
    </UserPageContainer>
  )
}

export function CSDPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Отдел конкурсного отбора" department="CSD">
      {({ current, setCurrent, orders, sendRequest, department }) => (
        <CertificateForm current={current} setCurrent={setCurrent} 
        orders={orders} sendRequest={sendRequest} department={department}/>
      )}
    </UserPageContainer>
  )
}

export function HostelPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Общежитие" department="hostel">
      {({ current, setCurrent, orders, sendRequest, department }) => (
        <CertificateForm current={current} setCurrent={setCurrent} 
        orders={orders} sendRequest={sendRequest} department={department}/>
      )}
    </UserPageContainer>
  )
}