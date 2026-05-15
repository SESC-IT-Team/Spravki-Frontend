import UserPageContainer from "./UserPageContainer";
import {CertificateForm} from "./Content";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

export function EducationalPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Учебный отдел" department="educational_department">
      {({ current, setCurrent, orders, sendRequest, department }) => (
        <CertificateForm current={current} setCurrent={setCurrent}
        orders={orders} sendRequest={sendRequest} department={department} isHostel={false} title="Учебный отдел"/>
      )}
    </UserPageContainer>
  )
}

export function CSDPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Отдел конкурсного отбора" department="competitive_selection_department">
      {({ current, setCurrent, orders, sendRequest, department }) => (
        <CertificateForm current={current} setCurrent={setCurrent} 
        orders={orders} sendRequest={sendRequest} department={department} isHostel={false} title="Отдел конкурсного отбора"/>
      )}
    </UserPageContainer>
  )
}

export function HostelPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Общежитие" department="dormitory">
      {({ current, setCurrent, orders, sendRequest, department }) => (
        <CertificateForm current={current} setCurrent={setCurrent} 
        orders={orders} sendRequest={sendRequest} department={department} isHostel={true} title="Общежитие"/>
      )}
    </UserPageContainer>
  )
}