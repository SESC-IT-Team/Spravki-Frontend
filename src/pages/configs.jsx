/* Конфигурация для различных типов справок */
export const certificateConfigs = [
  { apiType: "standard", label: "Стандартная", department: "educational", fields: [] },
  { apiType: "militaryregistration", label: "Для военкомата", department: "educational", fields: [] },
  { apiType: "tax", label: "Для налоговой инспекции", department: "educational", fields: [] },
  { apiType: "socialfoundation", label: "Для социального фонда", department: "educational", fields: [] },
  { apiType: "certificate", label: "Выдача аттестата", department: "CSD", fields: [
    { formLabel: "ФИО Ученика", key: "student_full_name", input_type: "text" },
    { formLabel: "Класс", key: "class", input_type: "text" },
    { formLabel: "Контактный телефон", key: "contact_phone", input_type: "text" },
    { formLabel: "Контактный e-mail", key: "contact_email", input_type: "text" },
    { formLabel: "Причина выбытия из СУНЦ", key: "reason_for_withdrawal", input_type: "text" },
    { formLabel: "Нужна ли справка об успеваемости?(Да/Нет)", key: "needs_transcript", input_type: "text" }
  ] },
  { apiType: "extraditiondocuments", label: "Выдача документов", department: "CSD", fields: [
    { formLabel: "ФИО Ученика", key: "student_full_name", input_type: "text" },
    { formLabel: "Класс", key: "class", input_type: "text" },
    { formLabel: "Контактный телефон", key: "contact_phone", input_type: "text" },
    { formLabel: "Контактный e-mail", key: "contact_email", input_type: "text" },
    { formLabel: "Место требования для аттестата", key: "location_for_certificate", input_type: "text" },
    { formLabel: "Нужна ли справка об успеваемости?(Да/Нет)", key: "needs_transcript", input_type: "text" }
  ] },
  { apiType: "hostel", label: "Общежитие", department: "hostel", fields: [
    { formLabel: "ФИО Родителя", key: "parent_full_name", input_type: "text" },
    { formLabel: "ФИО Ученика", key: "student_full_name", input_type: "text" },
    { formLabel: "Цель/Причина", key: "reason_for_stay", input_type: "text" },
    { formLabel: "Место(Адрес) Пребывания", key: "stay_location", input_type: "text" },
    { formLabel: "Контактное лицо в месте пребывания(ФИО, телефон)", key: "contact_person", input_type: "text" },
    { formLabel: "Дата и время выхода", key: "leaving_time", input_type: "datetime-local" },
    { formLabel: "Дата и время возвращения", key: "returning_time", input_type: "datetime-local" }
  ] },
]
