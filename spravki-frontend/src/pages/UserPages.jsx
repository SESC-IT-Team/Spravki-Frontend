import UserPageContainer from "./UserPageContainer";
import {CertificateForm, HostelForm} from "./Content";

export function EducationalPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Заказ справок" department="educational">
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
    <UserPageContainer title="Заказ документов" department="CSD">
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
    <UserPageContainer title="Заказ справок для общежития" department="hostel">
      {({ current, setCurrent, orders, sendRequest }) => (
        <HostelForm current={current} setCurrent={setCurrent} 
        orders={orders} sendRequest={sendRequest}/>
      )}
    </UserPageContainer>
  )
}