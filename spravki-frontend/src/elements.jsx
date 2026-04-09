export function Form(){
    function submit(formData){
        console.log(formData)
    }
    return (
        <form action={submit}>
            <label htmlFor="studentName">Фамилия, имя ребёнка</label>
            <input id="studentName" name="studentName"/>
            <label htmlFor="parentName">Фамилия, имя, отчество родителя, подающего заявление</label>
            <input id="parentName" name="parentName"/>
            <label htmlFor="purpose">Цель и/или причина самостоятельного выхода ребёнка за пределы СУНЦ</label>
            <textarea id="purpose" name="purpose"/>
            <p>Дата и время выхода из интерната СУНЦ</p>
            <input name="leaveDate" type="date"/>
            <input name="leaveTime" type="time"/>
            <p>Дата и время возвращения в интернат СУНЦ</p>
            <input name="returnDate" type="date"/>
            <input name="returnTime" type="time"/>
            <label htmlFor="address">Место (адрес) пребывания</label>
            <input id="address" name="address"/>
            <label htmlFor="contact">Контактное лицо в месте пребывания (ФИО, телефон)</label>
            <input id="contact" name="contact"/>
            <button type="submit">Отправить</button>
        </form>
    )
}

export function Table({caption,zayavleniya}){
    return (
        <table>
            <caption>{caption}</caption>
            <thead>
            <tr>
                <th>Номер</th>
                <th>Подано</th>
                <th>Учащийся</th>
                <th>Выход</th>
                <th>Возвращение</th>
            </tr>
            </thead>
            <tbody>
            {zayavleniya.map(declaration =>
                <tr key={declaration.id}>
                    <td>{declaration.id}</td>
                    <td>{declaration.created}</td>
                    <td>{declaration.fullname}</td>
                    <td>{declaration.leave}</td>
                    <td>{declaration.return}</td>
                </tr>
            )}
            </tbody>
        </table>
    )
}