/* Конфигурация для различных типов справок */
export const certificateConfigs = [
  { apiType: "Standard", label: "Стандартная", department: "educational_department", departmentLabel: "Учебный отдел", fields: [] },
  { apiType: "MilitaryRegistration", label: "Для военкомата", department: "educational_department", departmentLabel: "Учебный отдел", fields: [] },
  { apiType: "Tax", label: "Для налоговой инспекции", department: "educational_department", departmentLabel: "Учебный отдел", fields: [] },
  { apiType: "SocialFoundation", label: "Для социального фонда", department: "educational_department", departmentLabel: "Учебный отдел", fields: [] },
  { apiType: "Certificate", label: "Выдача аттестата", department: "competitive_selection_department", departmentLabel: "ОКО", fields: [
    { formLabel: "ФИО Ученика", key: "child_name", input_type: "text" },
    { formLabel: "Класс", key: "child_class", input_type: "text" },
    { formLabel: "Контактный телефон", key: "contact_phone", input_type: "text" },
    { formLabel: "Контактный e-mail", key: "contact_email", input_type: "text" },
    { formLabel: "Причина выбытия из СУНЦ", key: "reason_for_departure", input_type: "text" },
    { formLabel: "Нужна ли справка об успеваемости?(Да/Нет)", key: "need_performance_certificate", input_type: "text" }
  ] },
  { apiType: "ExtraditionDocuments", label: "Выдача документов", department: "competitive_selection_department", departmentLabel: "ОКО", fields: [
    { formLabel: "ФИО Ученика", key: "child_name", input_type: "text" },
    { formLabel: "Класс", key: "child_class", input_type: "text" },
    { formLabel: "Контактный телефон", key: "contact_phone", input_type: "text" },
    { formLabel: "Контактный e-mail", key: "contact_email", input_type: "text" },
    { formLabel: "Место требования для аттестата", key: "place_asking", input_type: "text" },
    { formLabel: "Нужна ли справка об успеваемости?(Да/Нет)", key: "need_performance_certificate", input_type: "text" }
  ] },
  { apiType: "Hostel", label: "Общежитие", department: "dormitory", departmentLabel: "Общежитие", fields: [
    { formLabel: "ФИО Ученика", key: "child_name", input_type: "text" },
    { formLabel: "Цель/Причина", key: "purnope", input_type: "text" },
    { formLabel: "Место(Адрес) Пребывания", key: "address", input_type: "text" },
    { formLabel: "Контактное лицо в месте пребывания(ФИО)", key: "contact_person", input_type: "text" },
    { formLabel: "Контактное лицо в месте пребывания(телефон)", key: "phone", input_type: "text" },
    { formLabel: "Дата и время выхода", key: "departure_datetime", input_type: "datetime-local" },
    { formLabel: "Дата и время возвращения", key: "return_datetime", input_type: "datetime-local" }
  ] },
]
