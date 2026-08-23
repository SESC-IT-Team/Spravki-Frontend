import UserPageContainer from "./UserPageContainer";
import {CertificateForm} from "./Content";

export function EducationalPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Учебный отдел" department="educational_department">
      {({ current, setCurrent, orders, ordersLoading, sendRequest, department, children, selectedChildId, setSelectedChildId, childrenLoading, childrenError }) => (
        <CertificateForm current={current} setCurrent={setCurrent}
        orders={orders} ordersLoading={ordersLoading} sendRequest={sendRequest} department={department} isHostel={false} title="Учебный отдел"
        children={children} selectedChildId={selectedChildId} setSelectedChildId={setSelectedChildId}
        childrenLoading={childrenLoading} childrenError={childrenError}/>
      )}
    </UserPageContainer>
  )
}

export function CSDPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Отдел конкурсного отбора" department="competitive_selection_department">
      {({ current, setCurrent, orders, ordersLoading, sendRequest, department, children, selectedChildId, setSelectedChildId, childrenLoading, childrenError }) => (
        <CertificateForm current={current} setCurrent={setCurrent}
        orders={orders} ordersLoading={ordersLoading} sendRequest={sendRequest} department={department} isHostel={false} title="Отдел конкурсного отбора"
        children={children} selectedChildId={selectedChildId} setSelectedChildId={setSelectedChildId}
        childrenLoading={childrenLoading} childrenError={childrenError}/>
      )}
    </UserPageContainer>
  )
}

export function HostelPage() {
  /* Запаковка в контейнер UI */
  return (
    <UserPageContainer title="Общежитие" department="dormitory">
      {({ current, setCurrent, orders, ordersLoading, sendRequest, department, children, selectedChildId, setSelectedChildId, childrenLoading, childrenError }) => (
        <CertificateForm current={current} setCurrent={setCurrent}
        orders={orders} ordersLoading={ordersLoading} sendRequest={sendRequest} department={department} isHostel={true} title="Общежитие"
        children={children} selectedChildId={selectedChildId} setSelectedChildId={setSelectedChildId}
        childrenLoading={childrenLoading} childrenError={childrenError}/>
      )}
    </UserPageContainer>
  )
}
